import { parentPort, workerData } from "worker_threads";

import { MailerServiceSingleton } from "@services/mailerService";

interface VerificationEmailWorkerData {
  email: string;
  code: string;
}

const { email, code } = (workerData ?? {}) as VerificationEmailWorkerData;

MailerServiceSingleton.getInstance()
  .sendVerificationEmail(email, code)
  .then((code) => {
    parentPort?.postMessage(`Code sent:${code}`);
  })
  .catch((error) => {
    parentPort?.postMessage(error);
  });
