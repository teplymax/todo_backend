import { RequestHandler } from "express";

export interface BaseResponse<P = undefined> {
  payload?: P;
  success: boolean;
}

export type AppRequestHandler<
  ResponsePayload = unknown,
  RequestBody = unknown,
  RequestParams = unknown,
  RequestQueryParams = unknown
> = RequestHandler<
  RequestParams,
  BaseResponse<ResponsePayload>,
  RequestBody,
  RequestQueryParams,
  Record<string, unknown>
>;

export interface Mapper<D, T, Props = unknown> {
  map(data: D, props?: Props): T;
}
