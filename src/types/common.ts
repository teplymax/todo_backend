import { RequestHandler } from "express";

export type AppRequestHandler<
  ResponseBody = unknown,
  RequestBody = unknown,
  RequestParams = unknown,
  RequestQueryParams = unknown
> = RequestHandler<RequestParams, ResponseBody, RequestBody, RequestQueryParams, Record<string, unknown>>;

export interface Mapper<D, T, Props = unknown> {
  map(data: D, props?: Props): T;
}
