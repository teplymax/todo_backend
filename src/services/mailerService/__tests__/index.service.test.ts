import config from "@config/index";

import { MailerServiceInterface } from "../index.interface";

const mockTransporter = {
  sendMail: jest.fn()
};

jest.mock("nodemailer", () => ({
  default: {
    createTransport: jest.fn().mockReturnValue(mockTransporter)
  }
}));

const nodeMailer = await import("nodemailer");
const { MailerService } = await import("../index.service");

interface MockError {
  message: string;
}

function mockSendMailImplementation(error?: MockError) {
  mockTransporter.sendMail.mockImplementation((_config, callback: (error?: MockError) => void) => {
    callback(error);
  });
}

const mockEmail = "mockEmail@email.com";

const mockVerificationCode = "1234";

const expectedEmailText = `<div>
            <h2>Verify code:</h2>
            <h1>${mockVerificationCode}</h1>
            <p>Don't tell this code to anyone!</p>
          </div>`;

describe("MailerService tests", () => {
  let service: MailerServiceInterface;

  beforeAll(() => {
    mockSendMailImplementation();
    service = new MailerService();
  });

  it("should create trasporter with correct config", () => {
    expect(nodeMailer.default.createTransport).toHaveBeenCalledWith(config.mailer);
  });

  it("should send valid mail and resolve with sended code if there is no error", async () => {
    const result = service.sendVerificationEmail(mockEmail, mockVerificationCode);

    await expect(result).resolves.toEqual(mockVerificationCode);
    expect(mockTransporter.sendMail).toHaveBeenCalledWith(
      {
        from: "TODO ADMIN",
        to: mockEmail,
        subject: "Account verification",
        html: expectedEmailText
      },
      expect.any(Function)
    );
  });

  it.each([
    {
      message: "mockErrorMessage"
    },
    {
      message: ""
    }
  ] as Array<MockError>)(
    "should send valid mail and resolve with error message if there is no error",
    async (error) => {
      mockSendMailImplementation(error);
      const result = service.sendVerificationEmail(mockEmail, mockVerificationCode);

      await expect(result).resolves.toEqual(error.message ?? "Error during email sending process");
      expect(mockTransporter.sendMail).toHaveBeenCalledWith(
        {
          from: "TODO ADMIN",
          to: mockEmail,
          subject: "Account verification",
          html: expectedEmailText
        },
        expect.any(Function)
      );
    }
  );
});
