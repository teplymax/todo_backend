import { MailerServiceSingleton } from "..";
import { MailerService } from "../index.service";

describe("MailerServiceSingleton tests", () => {
  it("should return same instance of MailerService", () => {
    const firstCall = MailerServiceSingleton.getInstance();
    const secondCall = MailerServiceSingleton.getInstance();

    expect(firstCall).toBeInstanceOf(MailerService);
    expect(secondCall).toBeInstanceOf(MailerService);
    expect(secondCall).toEqual(firstCall);
  });
});
