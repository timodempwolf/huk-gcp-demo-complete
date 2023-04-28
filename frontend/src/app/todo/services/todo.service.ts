import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ITodo } from "../interfaces/ITodo";

@Injectable({
  providedIn: 'root'
})


export class TodoItemService {

  //environment variables in angular sind wieder ganz besonders umständlich, wenn man die von docker oder CI/CD injectn will.... unnötig
  private backendUrl = "https://europe-west1-cw-huk-workshop-internal.cloudfunctions.net/crud"
  private headers = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
  private uploadheaders = { headers: new HttpHeaders({ 'Content-Type': 'image/jpeg' }) }

  constructor(private http: HttpClient) { }

  public getAll() {
    return this.http.get<ITodo[]>(this.backendUrl, this.headers);
  }

  public post(item: ITodo) {
    return this.http.post(this.backendUrl, item, this.headers);
  }

  public upload(file: File, url: string) {
    return this.http.put(url, file, {
      ...this.uploadheaders,
      reportProgress: true,
      observe: 'events'
    });
  }

  public patch(item: Partial<ITodo>) {
    return this.http.patch(this.backendUrl, item, this.headers);
  }

  public put(id: string, filename: string) {
    return this.http.put(this.backendUrl, { id, filename }, this.headers);
  }

  public delete(id: string) {
    return this.http.delete(this.backendUrl, { ...this.headers, body: { id } });
  }

}
