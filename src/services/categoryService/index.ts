import { CategoryServiceInterface } from "./index.interface";
import { CategoryService } from "./index.service";

export class CategoryServiceSingleton {
  private static instance: CategoryServiceInterface;

  static getInstance(): CategoryServiceInterface {
    if (!this.instance) {
      this.instance = new CategoryService();
    }

    return this.instance;
  }
}
