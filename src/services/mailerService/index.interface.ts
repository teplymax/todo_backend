export interface MailerServiceInterface {
  sendVerificationEmail: (emailAddress: string) => Promise<string>;
}
