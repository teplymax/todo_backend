export interface MailerServiceInterface {
  sendVerificationEmail: (emailAddress: string, verificationCode: string) => Promise<string>;
}
