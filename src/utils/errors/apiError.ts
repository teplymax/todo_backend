export class APIError extends Error {
  status: number;
  additionalInfo?: string;

  constructor(errorMessage: string, status: number, additionalInfo?: string) {
    super(errorMessage);

    this.status = status;
    this.additionalInfo = additionalInfo;
  }
}
