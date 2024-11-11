import { TokenServiceInterface } from "./index.interface";
import { TokenService } from "./index.service";

export class TokenServiceSingleton {
  private static instance: TokenServiceInterface;

  static getInstance(): TokenServiceInterface {
    if (!this.instance) {
      this.instance = new TokenService();
    }

    return this.instance;
  }
}
