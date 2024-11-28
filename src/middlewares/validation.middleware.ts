import { NextFunction, Request, Response } from "express";
import { ValidationError } from "yup";

import { APIError } from "@utils/errors/apiError";
import { VALIDATORS } from "@utils/validation";

export function validationMiddleware(validator: keyof typeof VALIDATORS) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const { body } = req;

      const schema = VALIDATORS[validator];

      await schema.validate(body);

      next();
    } catch (error) {
      if (error instanceof ValidationError) {
        next(new APIError(error.errors.join("\n"), 400));
      }

      next(new APIError("Unknown validation error", 400));
    }
  };
}
