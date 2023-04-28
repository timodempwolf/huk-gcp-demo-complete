import { Component, Input, EventEmitter, Output } from '@angular/core';
import { IFile, ITodo } from '../../interfaces/ITodo';
import { TodoItemService } from '../../services/todo.service';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Subscription, finalize } from 'rxjs';

interface IUrl {
  url: string
}
@Component({
  selector: "app-todo-item",
  templateUrl: "./todo-item.component.html",
  styleUrls: ["./todo-item.component.scss"],
})
export class TodoItemComponent {
  @Input()
  data?: ITodo;

  @Output()
  onDelete = new EventEmitter<string>();
  @Output()
  onUploaded = new EventEmitter<void>();
  constructor(private backend: TodoItemService, private http: HttpClient) { }


  saveTimout?: any;


  uploadProgress?: number;
  uploadSub?: Subscription;

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      this.backend.put(this.data!.id!, file.name).subscribe({
        next: (o) => { this.uploadToUrl(file, (o as IUrl).url) },
        error: (error: Error) => { console.log(error) },
        complete: () => { console.log("put complete") }
      })
    }
  }

  getFile(): IFile | undefined {
    if (this.data?.files)
      return this.data!.files[0]
    return undefined;
  }

  uploadToUrl(file: File, url: string) {

    const upload$ = this.backend.upload(file, url)
      .pipe(
        finalize(() => {
          this.reset();
          this.onUploaded.emit();
        })
      );

    this.uploadSub = upload$.subscribe((event: any) => {
      if (event.type == HttpEventType.UploadProgress) {
        this.uploadProgress = Math.round(100 * (event.loaded / event.total));
      }
    })
  }

  cancelUpload() {
    this.uploadSub?.unsubscribe();
    this.reset();
  }

  reset() {
    this.uploadProgress = undefined;
    this.uploadSub = undefined;
  }

  getCreationDate(): string | undefined {
    if (!this.data) return undefined;
    return new Date(this.data?.creationDate).toLocaleString();
  }

  restartSaveTimer() {
    if (this.saveTimout) clearTimeout(this.saveTimout);

    this.saveTimout = setTimeout(() => {
      this.backend.patch(this.data!).subscribe(
        {
          error: (error: Error) => console.log(error),
          complete: () => console.log("patch complete"),
        },
      );
    }, 2000);
  }

  setAuthor(event: Event) {
    this.restartSaveTimer();

    const inputValue = (event.target as HTMLInputElement).value;
    this.data!.author = inputValue;
  }

  setText(event: Event) {
    this.restartSaveTimer();
    const element = event.target as HTMLTextAreaElement;
    const inputValue = element.value;
    element.style.height = "5px";
    element.style.height = (element.scrollHeight) + "px";
    this.data!.text = inputValue;
  }

  deleteTodo() {
    if (this.data && this.data.id) {
      this.backend.delete(this.data!.id!).subscribe(
        {
          error: (error: Error) => console.log(error),
          complete: () => {
            console.log("delete complete");
            this.onDelete.emit(this.data!.id!);
          },
        },
      );
    }
  }

  toggleCompletion() {
    this.restartSaveTimer();
    this.data!.completed = !this.data?.completed;
  }
}
