import { Todo } from "@db/entities/Todo.entity";

import { ParamsDictionary } from "./common";

export interface GetTodoResponse {
  todo: MappedTodo;
}

export interface GetTodosResponse {
  todos: MappedTodo[];
}

export interface TodoPayload {
  title: string;
  description: string | null;
}

export interface CreateTodoPayload extends TodoPayload {
  categories: Array<string>;
}

export interface CreateTodoResponse {
  todo: MappedTodo;
}

export interface EditTodoPayload extends Partial<TodoPayload> {
  categories?: Array<string>;
}

export interface EditTodoResponse {
  todo: MappedTodo;
}

export interface DeleteTodoResponse {
  todoId: string;
}

export interface TodoIdParams extends ParamsDictionary {
  todoId: string;
}

export type MappedTodo = Omit<Todo, "user">;
