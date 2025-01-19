import { Request, Response } from "express";

import { Cookies } from "@typeDeclarations/common";

type MockedRequestObject<Body = unknown> = {
  body: Body;
  headers: Partial<Request["headers"]>;
  cookies: Cookies;
};

export function mockRequestObject<Body>(req: Partial<MockedRequestObject<Body>>) {
  return req as unknown as Request<Record<string, string>, unknown, Body>;
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
