import { Todo } from "@db/entities/Todo.entity";

import { ParamsDictionary } from "./common";

export interface GetTodoResponse {
  todo: Todo;
}

export interface GetTodosResponse {
  todos: Todo[];
}

export interface TodoPayload {
  title: string;
  description: string | null;
}

export interface CreateTodoPayload extends TodoPayload {
  categories: Array<string>;
}

export interface CreateTodoResponse {
  todo: Todo;
}

export interface EditTodoPayload extends Partial<TodoPayload> {
  categories?: Array<string>;
}

export interface EditTodoResponse {
  todo: Todo;
}

export interface DeleteTodoResponse {
  todoId: string;
}

export interface TodoIdParams extends ParamsDictionary {
  todoId: string;
}
