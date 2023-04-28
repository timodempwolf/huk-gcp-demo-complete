import { Component } from '@angular/core';
import { TodoItemService } from '../services/todo.service';
import { ITodo } from '../interfaces/ITodo';

@Component({
  selector: 'app-todo-page',
  templateUrl: './todo-page.component.html',
  styleUrls: ['./todo-page.component.scss']
})

export class TodoPageComponent {

  id?: string
  data?: ITodo[]
  dataLoaded: boolean = false;
  refreshTimout?: any;

  constructor(private todoBackend: TodoItemService) { }

  ngOnInit() {
    this.get()
  }

  deleteTodo(id: string) {
    this.data = this.data?.filter(todo => todo.id != id)
  }

  refreshin2Secs() {
    if (this.refreshTimout) clearTimeout(this.refreshTimout);

    this.refreshTimout = setTimeout(() => {
      this.get()
    }, 2000);

  }

  createNew() {
    if (!this.data) this.data = []
    const todo: ITodo = { author: "Autor", completed: false, creationDate: new Date(Date.now()), text: "Todo Text" }
    this.data.splice(0, 0, todo)
    this.todoBackend.post(todo).subscribe(
      {
        next: (a: any) => { todo.id = a.id },
        error: (error: Error) => console.log(error),
        complete: () => console.log("post complete")
      })
  }

  setId(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    this.id = inputValue;
  }

  get() {
    this.todoBackend.getAll().subscribe(
      {
        next: (data: ITodo[]) => this.data = data,
        error: (error: Error) => console.log(error),
        complete: () => {
          this.dataLoaded = true;
          console.log("getall complete")
        }
      })
  }

  post() {
    const todo: ITodo = { author: "Manfred", completed: true, creationDate: new Date(Date.now()), text: "test" }
    this.todoBackend.post(todo).subscribe(
      {
        error: (error: Error) => console.log(error),
        complete: () => console.log("post complete")
      })
  }

  patch() {
    const todo: ITodo = { author: "Manfred", completed: true, creationDate: new Date(Date.now()), text: "test" }
    this.todoBackend.patch(todo).subscribe(
      {
        error: (error: Error) => console.log(error),
        complete: () => console.log("patch complete")
      })
  }

  delete() {
    this.todoBackend.delete(this.id!).subscribe(
      {
        error: (error: Error) => console.log(error),
        complete: () => console.log("delete complete")
      })
  }

}
