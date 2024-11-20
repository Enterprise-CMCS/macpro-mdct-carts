import { API } from "aws-amplify";
import {
  apiLib,
  getRequestHeaders,
  authenticateWithIDM,
  getTokens,
  loginUser,
  logoutUser,
  refreshSession,
} from "./apiLib";
import { updateTimeout } from "../hooks/authHooks";

const mockAuthenticatedUser = jest.fn();
const mockSession = jest.fn();
const mockFederatedSignIn = jest.fn();
const mockSignIn = jest.fn();
const mockSignOut = jest.fn();
jest.mock("aws-amplify", () => ({
  API: {
    post: jest.fn(),
    put: jest.fn(),
    get: jest.fn(),
    del: jest.fn(),
  },
  Auth: {
    currentAuthenticatedUser: () => mockAuthenticatedUser(),
    currentSession: () => mockSession(),
    signIn: () => mockSignIn(),
    signOut: () => mockSignOut(),
    federatedSignIn: () => mockFederatedSignIn(),
  },
}));

jest.mock("../hooks/authHooks", () => ({
  updateTimeout: jest.fn(),
  initAuthManager: jest.fn(),
  refreshCredentials: jest.fn(),
}));

const path = "my/url";
const mockOptions = {
  headers: {
    "x-api-key": "mock key",
  },
  body: {
    foo: "bar",
  },
};
const requestObj = {
  apiName: "carts-api",
  path,
  options: mockOptions,
};

describe("API lib", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Calling post should update the session timeout", async () => {
    await apiLib.post(path, mockOptions);

    expect(API.post).toBeCalledWith(requestObj);
    expect(updateTimeout).toBeCalled();
  });

  test("Calling put should update the session timeout", async () => {
    await apiLib.put(path, mockOptions);

    expect(API.put).toBeCalledWith(requestObj);
    expect(updateTimeout).toBeCalled();
  });

  test("Calling get should update the session timeout", async () => {
    await apiLib.get(path, mockOptions);

    expect(API.get).toBeCalledWith(requestObj);
    expect(updateTimeout).toBeCalled();
  });

  test("Calling del should update the session timeout", async () => {
    await apiLib.del(path, mockOptions);

    expect(API.del).toBeCalledWith(requestObj);
    expect(updateTimeout).toBeCalled();
  });

  test("API errors should be surfaced for handling", async () => {
    API.del.mockImplementationOnce(() => {
      throw new Error("500");
    });

    await expect(apiLib.del(path, mockOptions)).rejects.toThrow(Error);
  });

  describe("getRequestHeaders()", () => {
    test("Logs error to console if Auth throws error", async () => {
      jest.spyOn(console, "log").mockImplementation(jest.fn());
      const spy = jest.spyOn(console, "log");

      mockSession.mockImplementation(() => {
        throw new Error();
      });

      await getRequestHeaders();

      expect(spy).toHaveBeenCalledTimes(1);
    });

    test("Returns token if current idToken exists", async () => {
      mockSession.mockResolvedValue({
        getIdToken: () => ({
          getJwtToken: () => {
            return "mock token";
          },
        }),
      });

      const result = await getRequestHeaders();

      expect(result).toStrictEqual({ "x-api-key": "mock token" });
    });
  });

  test("getTokens()", async () => {
    await getTokens();
    expect(mockSession).toHaveBeenCalledTimes(1);
  });

  test("authenticateWithIDM()", async () => {
    await authenticateWithIDM();
    expect(mockFederatedSignIn).toHaveBeenCalledTimes(1);
  });

  test("loginUser()", async () => {
    await loginUser("email@address.com", "test");
    expect(mockSignIn).toHaveBeenCalledTimes(1);
  });

  test("logoutUser()", async () => {
    await logoutUser();
    expect(mockSignOut).toHaveBeenCalledTimes(1);
  });

  test("refreshSession()", async () => {
    await refreshSession();
    expect(mockAuthenticatedUser).toHaveBeenCalledTimes(1);
  });
});
