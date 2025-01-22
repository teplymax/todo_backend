import { TodoServiceInterface } from "./index.interface";
import { TodoService } from "./index.service";

export class TodoServiceSingleton {
  private static instance: TodoServiceInterface;

  static getInstance(): TodoServiceInterface {
    if (!this.instance) {
      this.instance = new TodoService();
    }

    return this.instance;
  }
}
