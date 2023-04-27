### GCP serverless demo challenge repo

## Deploy frontend
1. Create a GCS bucket in your GCP project and grant public access
2. Replace the URL of the CRUD-function in the todo.service.ts with the URL of the function that is running in your project
3. Run the following command in your the directory where the Angular code is located: `ng build -c production --base-href /<BUCKET_NAME>/` - replace the bucket name with the bucket name you selected
4. Run the following command to upload the frontend file to the bucket: `gsutil -m -o "GSUtil:parallel_process_count=1" cp -r -z js,css ./dist/frontend/* gs://<YOUR_BUCKET_NAME>`