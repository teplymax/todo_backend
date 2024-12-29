import config from "@config/index";

const mockApiRouter = jest.fn();
jest.mock("@routes/index", () => ({
  default: mockApiRouter
}));

const mockUse = jest.fn();
const mockListen = jest.fn();
const mockJson = jest.fn();
jest.mock("express", () => ({
  default: jest.fn().mockReturnValue({
    use: mockUse,
    listen: mockListen
  }),
  json: jest.fn().mockReturnValue(mockJson)
}));

const mockCors = jest.fn();
jest.mock("cors", () => ({
  default: jest.fn().mockReturnValue(mockCors)
}));

const mockCookieParser = jest.fn();
jest.mock("cookie-parser", () => ({
  default: jest.fn().mockReturnValue(mockCookieParser)
}));

const mockErrorHandler = jest.fn();
jest.mock("@utils/errors/errorHandler", () => ({
  errorHandler: mockErrorHandler
}));

await import("../index");

describe("App initialization tests", () => {
  it("should initialize app correctly", () => {
    expect(mockUse.mock.calls[0][0]).toEqual(mockJson);
    expect(mockUse.mock.calls[1][0]).toEqual(mockCookieParser);
    expect(mockUse.mock.calls[2][0]).toEqual(mockCors);
    expect(mockListen).toHaveBeenCalledWith(config.port, expect.any(Function));
    expect(mockUse.mock.calls[3][0]).toEqual("/api");
    expect(mockUse.mock.calls[3][1]).toEqual(mockApiRouter);
    expect(mockUse.mock.calls[4][0]).toEqual(mockErrorHandler);
  });
});
