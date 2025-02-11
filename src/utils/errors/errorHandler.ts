import { Request, Response, NextFunction } from "express";

import { IS_DEV } from "@config";
import { BaseErrorObject, ErrorResponse } from "@typeDeclarations/error";

import { APIError } from "./apiError";

function buildErrorObject(error: APIError): BaseErrorObject {
  const errorObject: BaseErrorObject = {
    message: error.message,
    additionalInfo: error.additionalInfo,
    status: error.status
  };

  if (IS_DEV) {
    errorObject.stack = error.stack;
  }

  return errorObject;
}

export function errorHandler(error: unknown, _req: Request, res: Response<ErrorResponse>, _next: NextFunction) {
  if (IS_DEV) {
    console.log(error);
  }

  if (error instanceof APIError) {
    res.status(error.status).json({
      success: false,
      error: buildErrorObject(error)
    });
  } else {
    res.status(500).json({
      success: false,
      error: {
        message: "Unknown server error",
        status: 500
      }
    });
  }
}
