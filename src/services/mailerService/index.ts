import { MailerServiceInterface } from "./index.interface";
import { MailerService } from "./index.service";

export class MailerServiceSingleton {
  private static instance: MailerServiceInterface;

  static getInstance(): MailerServiceInterface {
    if (!this.instance) {
      this.instance = new MailerService();
    }

    return this.instance;
  }
}
