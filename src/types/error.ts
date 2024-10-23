import { BaseResponse } from "./response";

export interface BaseErrorObject {
  message: string;
  status: number;
  additionalInfo?: string;
  stack?: string;
}

export interface ErrorResponse extends BaseResponse {
  error: BaseErrorObject;
}
