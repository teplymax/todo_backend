import { RequestHandler } from "express";

export interface BaseResponse<P = undefined> {
  payload?: P;
  success: boolean;
}

export type ParamsDictionary = Record<string, string>;

export interface ParsedQs {
  [key: string]: undefined | string | string[] | ParsedQs | ParsedQs[];
}

export type AppRequestHandler<
  ResponsePayload = unknown,
  RequestBody = unknown,
  RequestParams extends ParamsDictionary = ParamsDictionary,
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

export interface Cookies {
  refreshToken: string;
}

export interface PaginationResult<Data> {
  prevPage: number | null;
  currentPage: number;
  nextPage: number | null;
  data: Data;
  total: number;
}

export interface PaginationConfig {
  page?: number;
  limit?: number;
}

export interface PaginationQueryParams {
  page?: string;
  limit?: string;
}
