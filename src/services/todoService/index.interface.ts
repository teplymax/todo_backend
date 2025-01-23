import { Category } from "@db/entities/Category.entity";
import { Todo } from "@db/entities/Todo.entity";
import { User } from "@db/entities/User.entity";
import { PaginationQueryParams, PaginationResult } from "@typeDeclarations/common";
import { TodoPayload } from "@typeDeclarations/todo";

export interface TodoServiceInterface {
  getTodos(userId: string, pagination: PaginationQueryParams): Promise<PaginationResult<Todo[]>>;
  getTodos(userId: string): Promise<Todo[]>;
  getTodoById: (todoId: string) => Promise<Todo>;
  createTodo: (payload: TodoPayload, user: User, categories?: Category[]) => Promise<Todo>;
  editTodo: (payload: Partial<TodoPayload>, todoId: string, categories?: Category[]) => Promise<Todo>;
  deleteTodo: (todoId: string) => Promise<string>;
}
