import { Category } from "@db/entities/Category.entity";
import { Todo } from "@db/entities/Todo.entity";
import { User } from "@db/entities/User.entity";
import { db } from "@db/index";
import { TodoPayload } from "@typeDeclarations/todo";
import { APIError } from "@utils/errors/apiError";

import { TodoServiceInterface } from "./index.interface";

export class TodoService implements TodoServiceInterface {
  async getTodoById(todoId: string) {
    const todoRepository = db.getRepository(Todo);

    const todo = await todoRepository.findOne({
      where: {
        id: todoId
      }
    });
    if (!todo) {
      throw new APIError("Todo not found.", 404);
    }

    return todo;
  }

  async getTodos(userId: string) {
    const todoRepository = db.getRepository(Todo);

    return await todoRepository.find({
      where: {
        user: {
          id: userId
        }
      }
    });
  }

  async createTodo(payload: TodoPayload, user: User, categories?: Category[]) {
    const todoRepository = db.getRepository(Todo);

    const todo = new Todo();
    if (categories) {
      todo.categories = categories;
    }
    todo.title = payload.title;
    todo.description = payload.description;
    todo.user = user;

    return await todoRepository.save(todo);
  }

  async editTodo(payload: Partial<TodoPayload>, todoId: string, categories?: Category[]) {
    const todoRepository = db.getRepository(Todo);

    const todo = await todoRepository.findOne({
      where: {
        id: todoId
      }
    });
    if (!todo) {
      throw new APIError("Todo not found.", 404);
    }

    if (categories) {
      todo.categories = categories;
    }
    await todoRepository.update(todo.id, {
      ...todo,
      ...payload
    });

    return todo;
  }

  async deleteTodo(todoId: string) {
    const todoRepository = db.getRepository(Category);

    const todo = await todoRepository.findOne({
      where: {
        id: todoId
      }
    });
    if (!todo) {
      throw new APIError("Todo not found.", 404);
    }

    await todoRepository.remove(todo);

    return todoId;
  }
}
