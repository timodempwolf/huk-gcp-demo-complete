# GCP serverless complete demo repo

## Deploy frontend

Install all dependencies wit `npm install` and install the angular CLI with `npm install -g @angular/cli`

1. Create a GCS bucket in your GCP project and grant public access
2. Replace the URL of the CRUD-function in the [todo.service.ts](./frontend/src/app/todo/services/todo.service.ts) with the URL of the function that is running in your project
3. Run the following command in your the directory where the Angular code is located: `ng build -c production --base-href /<BUCKET_NAME>/` - replace the bucket name with the bucket name you selected
4. Run the following command to upload the frontend file to the bucket: `gsutil -m -o "GSUtil:parallel_process_count=1" cp -r -z js,css ./dist/frontend/* gs://<YOUR_BUCKET_NAME>`
5. Create a file with the name `cors.json` and update the buckets configuration with this command `gcloud storage  buckets update gs://<YOUR_BUCKET_NAME> --cors-file=cors.json` the file has the follwing content:
```
[
    {
      "origin": ["*"],
      "method": ["PUT","GET"],
      "responseHeader": ["Content-Type"],
      "maxAgeSeconds": 3600
    }
]
```