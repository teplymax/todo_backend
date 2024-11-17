import { UserServiceInterface } from "./index.interface";
import { UserService } from "./index.service";

export class UserServiceSingleton {
  private static instance: UserServiceInterface;

  static getInstance(): UserServiceInterface {
    if (!this.instance) {
      this.instance = new UserService();
    }

    return this.instance;
  }
}
