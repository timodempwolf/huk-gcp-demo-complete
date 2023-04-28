export interface ITodo {
  id?: string;
  text: string;
  author: string;
  creationDate: Date;
  completed: boolean;
  files?: IFile[]
}

export interface IFile {
  filename: string;
  url: string;
}
