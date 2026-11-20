import handlerLib from "../handler-lib";
import { testEvent } from "../../test-util/testEvents";
import { authenticateUser, isAuthorized } from "../authorization";
import {
  BadRequestError,
  NotFoundError,
  ServiceUnavailableError,
  UnauthenticatedError,
} from "../httpErrors";
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
const eventWithRequestId = {
  ...testEvent,
  requestContext: { requestId: "req-123" },
};

describe("Lambda handler wrapper", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (authenticateUser as jest.Mock).mockResolvedValue(verifiedUser);
    (isAuthorized as jest.Mock).mockReturnValue(true);
  });

  test("runs the handler with the verified user and returns 200", async () => {
    const testFunc = jest.fn().mockReturnValue({ test: "test" });

    const res = await handlerLib(testFunc)(testEvent, null);

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

  test("returns 403 when the user isn't allowed", async () => {
    const testFunc = jest.fn();
    (isAuthorized as jest.Mock).mockReturnValue(false);

    const res = await handlerLib(testFunc)(testEvent, null);

    expect(res.statusCode).toBe(403);
    expect(res.body).toContain(
      "User is not authorized to access this resource."
    );
    expect(testFunc).not.toHaveBeenCalled();
  });

  test.each([
    [
      "an invalid or missing token",
      401,
      new UnauthenticatedError("Invalid authentication token"),
    ],
    [
      "being unable to check the token",
      503,
      new ServiceUnavailableError("Unable to verify credentials right now"),
    ],
  ])("%s returns %i", async (_reason, status, error) => {
    const testFunc = jest.fn();
    (authenticateUser as jest.Mock).mockRejectedValue(error);

    const res = await handlerLib(testFunc)(testEvent, null);

    expect(res.statusCode).toBe(status);
    expect(isAuthorized).not.toHaveBeenCalled();
    expect(testFunc).not.toHaveBeenCalled();
    expect(logger.flush).toHaveBeenCalled();
    expect(logger.error).not.toHaveBeenCalled();
  });

  test("a handler that throws an unexpected error returns a generic 500 with the request ID and logs the details", async () => {
    const error = new Error("Table carts-main-sections not found");
    const testFunc = jest.fn().mockRejectedValue(error);

    const res = await handlerLib(testFunc)(eventWithRequestId, null);

    expect(res.statusCode).toBe(500);
    expect(JSON.parse(res.body)).toEqual({
      error: "Internal server error",
      requestId: "req-123",
    });
    expect(logger.error).toHaveBeenCalledWith(
      "Error (request %s): %O",
      "req-123",
      error
    );
    expect(logger.flush).toHaveBeenCalled();
  });

  test.each([
    ["a bad-request", 400, new BadRequestError("Test Error")],
    ["a not-found", 404, new NotFoundError("Test Error")],
  ])(
    "a handler that throws %s error returns %i with its message and logs it",
    async (_kind, status, error) => {
      const testFunc = jest.fn().mockRejectedValue(error);

      const res = await handlerLib(testFunc)(eventWithRequestId, null);

      expect(res.statusCode).toBe(status);
      expect(JSON.parse(res.body)).toEqual({ error: "Test Error" });
      expect(logger.error).toHaveBeenCalledWith(
        "Error (request %s): %O",
        "req-123",
        error
      );
      expect(logger.flush).toHaveBeenCalled();
    }
  );
});
