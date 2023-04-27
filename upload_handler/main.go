package http

import (
	"context"
	"fmt"
	"log"
	"os"
	"strings"

	"cloud.google.com/go/firestore"
	"google.golang.org/api/iterator"
)

type GCSEvent struct {
	Bucket    string `json:"bucket"`
	Name      string `json:"name"`
	MediaLink string `json:"mediaLink"`
}

// when a file is uploaded to the bucket, this Cloud function gets triggerd.
// The the identifier id of the file in the GCS bucket is set

func UploadHandler(ctx context.Context, e GCSEvent) error {
	projectId, ok := os.LookupEnv("PROJECT_ID")
	if !ok {
		err := fmt.Errorf("missing environment variable PROJECT_ID")
		log.Print(err.Error())
		return err
	}

	split := strings.Split(e.Name, "/")
	if len(split) != 2 {
		err := fmt.Errorf("unable to parse object name %v", e.Name)
		log.Print(err.Error())
		return err
	}
	documentId := split[0]
	filename := split[1]

	client, err := firestore.NewClient(ctx, projectId)
	if err != nil {
		log.Print("Failed to create client: ", err)
		return err
	}
	defer client.Close()

	subcol := client.Collection("todos").Doc(documentId).Collection("files")

	iter := subcol.Documents(ctx)
	var fileId string
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			log.Print("Error while reading documents: ", err)
			return err
		}
		docData := doc.Data()
		if docData["filename"] == filename && docData["bucket"] == e.Bucket {
			fileId = doc.Ref.ID
		}
	}
	data := map[string]interface{}{
		"bucket":   e.Bucket,
		"filename": filename,
		"url":      e.MediaLink,
	}
	if fileId == "" {
		_, _, err = subcol.Add(ctx, data)
	} else {
		_, err = subcol.Doc(fileId).Set(ctx, data)
	}
	if err != nil {
		log.Print("Error while writing document: ", err)
		return err
	}
	return nil
}
