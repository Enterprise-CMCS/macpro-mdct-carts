import handlerLib from "../handler-lib";
import { testEvent } from "../../test-util/testEvents";
import { authenticateUser, isAuthorized } from "../authorization";
import { ServiceUnavailableError, UnauthenticatedError } from "../httpErrors";
import * as logger from "../debug-lib";
import { AppRoles } from "../../types";

jest.mock("../debug-lib", () => ({
  init: jest.fn(),
  debug: jest.fn(),
  error: jest.fn(),
  flush: jest.fn(),
}));

jest.mock("../authorization", () => ({
  authenticateUser: jest.fn(),
  isAuthorized: jest.fn(),
}));

const verifiedUser = { role: AppRoles.STATE_USER, state: "AL" };

describe("Test Lambda Handler Lib", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (authenticateUser as jest.Mock).mockResolvedValue(verifiedUser);
  });

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
    expect(authenticateUser).toHaveBeenCalledWith(testEvent);
    expect(isAuthorized).toHaveBeenCalledWith(testEvent, verifiedUser);
    expect(testFunc).toHaveBeenCalledWith(testEvent, null, verifiedUser);
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
    expect(testFunc).not.toHaveBeenCalled();
  });

  test("Test invalid or missing token returns 401 and never runs the lambda", async () => {
    const testFunc = jest.fn();
    const handler = handlerLib(testFunc);

    (authenticateUser as jest.Mock).mockRejectedValue(
      new UnauthenticatedError("Invalid authentication token")
    );
    const res = await handler(testEvent, null);

    expect(res.statusCode).toBe(401);
    expect(isAuthorized).not.toHaveBeenCalled();
    expect(testFunc).not.toHaveBeenCalled();
    expect(logger.flush).toHaveBeenCalled();
    // Expected events like expired tokens shouldn't trip error alarms
    expect(logger.error).not.toHaveBeenCalled();
  });

  test("Test auth outage returns 503 without logging it twice", async () => {
    const testFunc = jest.fn();
    const handler = handlerLib(testFunc);

    (authenticateUser as jest.Mock).mockRejectedValue(
      new ServiceUnavailableError("Unable to verify credentials right now")
    );
    const res = await handler(testEvent, null);

    expect(res.statusCode).toBe(503);
    expect(testFunc).not.toHaveBeenCalled();
    expect(logger.error).not.toHaveBeenCalled();
  });

  test("Test Errored lambda workflow", async () => {
    const err = new Error("Test Error");
    const testFunc = jest.fn().mockImplementation(() => {
      throw err;
    });
    const handler = handlerLib(testFunc);

    (isAuthorized as jest.Mock).mockReturnValue(true);
    const res = await handler(testEvent, null);

    expect(testFunc).toHaveBeenCalledWith(testEvent, null, verifiedUser);
    expect(logger.error).toHaveBeenCalledWith("Error: %O", err);
    expect(logger.flush).toHaveBeenCalled();
    expect(res.statusCode).toBe(500);
    expect(res.body).toContain("Test Error");
  });
});
