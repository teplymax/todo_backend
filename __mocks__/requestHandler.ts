import { Request, Response } from "express";

type MockedRequestObject = {
  body: unknown;
  headers: Partial<Request["headers"]>;
};

export function mockRequestObject({ body, headers }: Partial<MockedRequestObject>) {
  return {
    body,
    headers
  } as unknown as Request;
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
