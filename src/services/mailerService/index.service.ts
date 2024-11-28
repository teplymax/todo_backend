import nodeMailer, { Transporter } from "nodemailer";

import config from "@config/index";

import { MailerServiceInterface } from "./index.interface";

export class MailerService implements MailerServiceInterface {
  private mailerTransporeter: Transporter;

  constructor() {
    this.mailerTransporeter = nodeMailer.createTransport(config.mailer);
  }

  sendVerificationEmail(emailAddress: string, verificationCode: string) {
    return new Promise<string>((resolve) => {
      this.mailerTransporeter.sendMail(
        {
          from: "TODO ADMIN",
          to: emailAddress,
          subject: "Account verification",
          html: `
          <div>
            <h2>Verify code:</h2>
            <h1>${verificationCode}</h1>
            <p>Don't tell this code to anyone!</p>
          </div>`
        },
        (error) => {
          if (!error) {
            resolve(`${verificationCode}`);
          }

          resolve(error?.message ?? "Error during email sending process");
        }
      );
    });
  }
}
