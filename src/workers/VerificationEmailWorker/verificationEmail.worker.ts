import { parentPort, workerData } from "worker_threads";

import { MailerServiceSingleton } from "@services/mailerService";
import { VerificationEmailWorkerData } from "@typeDeclarations/auth";

const { email, code } = (workerData ?? {}) as VerificationEmailWorkerData;

MailerServiceSingleton.getInstance()
  .sendVerificationEmail(email, code)
  .then((code) => {
    parentPort?.postMessage(`Code sent:${code}`);
  });
