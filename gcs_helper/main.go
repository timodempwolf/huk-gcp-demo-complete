package http

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"mime"
	"net/http"
	"time"

	"cloud.google.com/go/storage"
	"github.com/GoogleCloudPlatform/functions-framework-go/functions"
)

func init() {
	functions.HTTP("GcsHelper", GcsHelper)
}

// generate a sigend url for the passed GCS bucket, to allow the frontend to upload a file to the bucket without authentication

func GcsHelper(w http.ResponseWriter, r *http.Request) {

	if r.Method != "POST" {
		log.Printf("Invalid Method %v aborting request", r.Method)
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
	mediatype, _, err := mime.ParseMediaType(r.Header.Get("Content-Type"))
	if err != nil {
		log.Printf("Invalid Content-Type %v aborting request", r.Header.Get("Content-Type"))
		w.WriteHeader(http.StatusUnsupportedMediaType)
		return
	}
	if mediatype != "application/json" {
		log.Printf("Invalid Media Type %v aborting request", mediatype)
		w.WriteHeader(http.StatusUnsupportedMediaType)
		return
	}
	var d struct {
		Bucket   string `json:"bucket"`
		Folder   string `json:"folder"`
		Filename string `json:"filename"`
	}
	err = json.NewDecoder(r.Body).Decode(&d)
	if err != nil {
		log.Printf("error parsing application/json: %v", err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	ctx := context.Background()
	client, err := storage.NewClient(ctx)
	if err != nil {
		log.Printf("storage.NewClient: %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	defer client.Close()

	filepath := fmt.Sprint(d.Folder, "/", d.Filename)
	url, err := client.Bucket(d.Bucket).SignedURL(filepath, &storage.SignedURLOptions{
		Scheme:  storage.SigningSchemeV4,
		Method:  "PUT",
		Expires: time.Now().Add(15 * time.Minute),
	})
	if err != nil {
		log.Printf("Bucket(%q).SignedURL: %v", d.Bucket, err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	e := struct {
		Url string `json:"url"`
	}{
		Url: url,
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(e)
}
