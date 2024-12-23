import { RequestHandler } from "express";

type MockedRequestObject = Pick<Partial<Parameters<RequestHandler>["0"]>, "body" | "headers">;

export function getMockRequestObject({ body, headers }: MockedRequestObject) {
  return {
    body,
    headers
  };
}
