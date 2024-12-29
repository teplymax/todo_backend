import { AuthServiceInterface } from "./index.interface";
import { AuthService } from "./index.service";

export class AuthServiceSingleton {
  private static instance: AuthServiceInterface;

  static getInstance(): AuthServiceInterface {
    if (!this.instance) {
      this.instance = new AuthService();
    }

    return this.instance;
  }
}
