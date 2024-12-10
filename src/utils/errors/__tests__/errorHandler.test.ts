import { Request, Response, NextFunction } from "express";

import { APIError } from "../apiError";
import { errorHandler } from "../errorHandler";

const res = {} as Response;
res.json = jest.fn();
res.status = jest.fn(() => res);

const req = {} as Request;
const next = (() => {}) as NextFunction;

describe("Error handler tests", () => {
  it("should send correct error response if APIError has been thrown", () => {
    errorHandler(new APIError("Error occured", 401, "Additional info"), req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: {
        message: "Error occured",
        additionalInfo: "Additional info",
        status: 401
      }
    });
  });

  it("should send correct unknown error response if other Error has been thrown", () => {
    errorHandler(new Error("Rendom Error occured"), req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: {
        message: "Unknown server error",
        status: 500
      }
    });
  });
});
