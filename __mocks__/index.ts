import { RequestHandler } from "express";

type MockedRequestObject = Pick<Partial<Parameters<RequestHandler>["0"]>, "body" | "headers">;

export const getMockRequestObject = ({ body, headers }: MockedRequestObject) => ({
  body,
  headers
});
