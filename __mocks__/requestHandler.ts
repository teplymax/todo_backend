import { Request, Response } from "express";

import { Cookies, ParamsDictionary, ParsedQs } from "@typeDeclarations/common";

type MockedRequestObject<
  Body = unknown,
  Params extends ParamsDictionary = ParamsDictionary,
  RequestQueryParams = ParsedQs
> = {
  body: Body;
  headers: Partial<Request["headers"]>;
  cookies: Cookies;
  params: Params;
  query: RequestQueryParams;
};

export function mockRequestObject<
  Body,
  Params extends ParamsDictionary = ParamsDictionary,
  RequestQueryParams = ParsedQs
>(req: Partial<MockedRequestObject<Body, Params>>) {
  return req as unknown as Request<Params, unknown, Body, RequestQueryParams>;
}

export function mockResponseObject() {
  const mockJson = jest.fn().mockImplementation((value) => value);
  const mockStatus = jest.fn();
  const mockClearCookie = jest.fn();
  const mockCookie = jest.fn();

  const mockResponse = {
    json: mockJson,
    status: mockStatus,
    cookie: mockCookie,
    clearCookie: mockClearCookie
  } as unknown as Response;

  mockStatus.mockReturnValue(mockResponse);
  mockCookie.mockReturnValue(mockResponse);
  mockClearCookie.mockReturnValue(mockResponse);

  return mockResponse;
}

export const mockNextFunction = jest.fn();
