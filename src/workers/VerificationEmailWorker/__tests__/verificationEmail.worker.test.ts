import { VerificationEmailWorkerData } from "@typeDeclarations/auth";

const mockWorkerData: VerificationEmailWorkerData = {
  email: "email@email.com",
  code: "1234"
};
const mockPostMessage = jest.fn();
jest.mock("worker_threads", () => ({
  parentPort: {
    postMessage: mockPostMessage
  },
  workerData: mockWorkerData
}));

const mockSendVerificationEmail = jest.fn();
jest.mock("@services/mailerService", () => ({
  MailerServiceSingleton: {
    getInstance: jest.fn().mockReturnValue({
      sendVerificationEmail: mockSendVerificationEmail.mockResolvedValueOnce(mockWorkerData.code)
    })
  }
}));

await import("../verificationEmail.worker");

describe("Verification email worker tests", () => {
  it("should send email correctly and post correct message", () => {
    expect(mockSendVerificationEmail).toHaveBeenCalledWith(mockWorkerData.email, mockWorkerData.code);
    expect(mockPostMessage).toHaveBeenCalledWith(`Code sent:${mockWorkerData.code}`);
  });
});
