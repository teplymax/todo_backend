import nodeMailer, { Transporter } from "nodemailer";

import config from "@config/index";

import { MailerServiceInterface } from "./index.interface";
export class MailerService implements MailerServiceInterface {
  private mailerTransporeter: Transporter;

  constuctor() {
    this.mailerTransporeter = nodeMailer.createTransport(config.mailer);
  }

  sendVerificationEmail(emailAddress: string) {
    return new Promise<string>((resolve) => {
      this.mailerTransporeter.sendMail(
        {
          from: "TODO ADMIN",
          to: emailAddress,
          subject: "Account verification",
          html: "Your verification code:"
        },
        (error) => {
          if (!error) {
            resolve("");
          }
        }
      );
    });
  }
}
