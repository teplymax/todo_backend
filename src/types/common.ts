import { RequestHandler } from "express";

export type AppRequestHandler<
  ResponseBody = unknown,
  RequestBody = unknown,
  RequestParams = unknown,
  RequestQueryParams = unknown
> = RequestHandler<RequestParams, ResponseBody, RequestBody, RequestQueryParams, Record<string, unknown>>;
