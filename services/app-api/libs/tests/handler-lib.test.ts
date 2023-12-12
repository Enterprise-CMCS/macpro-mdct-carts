import handlerLib from "../handler-lib";
import { testEvent } from "../../test-util/testEvents";
import { isAuthorized } from "../authorization";
import * as logger from "../debug-lib";

jest.mock("../debug-lib", () => ({
  init: jest.fn(),
  debug: jest.fn(),
  error: jest.fn(),
  flush: jest.fn(),
}));

jest.mock("../authorization", () => ({
  isAuthorized: jest.fn(),
}));

describe("Test Lambda Handler Lib", () => {
  test("Test successful authorized lambda workflow", async () => {
    const testFunc = jest.fn().mockReturnValue({ test: "test" });
    const handler = handlerLib(testFunc);

    (isAuthorized as jest.Mock).mockReturnValue(true);
    const res = await handler(testEvent, null);

    expect(res.statusCode).toBe(200);
    expect(res.body).toContain("test");
    expect(logger.init).toHaveBeenCalled();
    expect(logger.debug).toHaveBeenCalledWith(
      "API event: %O",
      expect.objectContaining({
        body: testEvent.body,
        pathParameters: testEvent.pathParameters,
        queryStringParameters: testEvent.queryStringParameters,
      })
    );
    expect(logger.flush).toHaveBeenCalled();
    expect(testFunc).toHaveBeenCalledWith(testEvent, null);
  });

  test("Test unsuccessful authorization lambda workflow", async () => {
    const testFunc = jest.fn();
    const handler = handlerLib(testFunc);

    (isAuthorized as jest.Mock).mockReturnValue(false);
    const res = await handler(testEvent, null);

    expect(res.statusCode).toBe(403);
    expect(res.body).toContain(
      "User is not authorized to access this resource."
    );
  });

  test("Test Errored lambda workflow", async () => {
    const err = new Error("Test Error");
    const testFunc = jest.fn().mockImplementation(() => {
      throw err;
    });
    const handler = handlerLib(testFunc);

    (isAuthorized as jest.Mock).mockReturnValue(true);
    const res = await handler(testEvent, null);

    expect(testFunc).toHaveBeenCalledWith(testEvent, null);
    expect(logger.error).toHaveBeenCalledWith("Error: %O", err);
    expect(logger.flush).toHaveBeenCalled();
    expect(res.statusCode).toBe(500);
    expect(res.body).toContain("Test Error");
  });
});
