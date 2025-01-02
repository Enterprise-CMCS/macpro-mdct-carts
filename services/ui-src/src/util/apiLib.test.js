import {
  apiLib,
  authenticateWithIDM,
  getRequestHeaders,
  getTokens,
  loginUser,
  logoutUser,
  refreshSession,
} from "./apiLib";

const mockAmplifyApi = require("aws-amplify/api");

const mockSession = jest.fn();
const mockSignInWithRedirect = jest.fn();
const mockSignIn = jest.fn();
const mockSignOut = jest.fn();
const mockTimeout = jest.fn();

jest.mock("aws-amplify/auth", () => ({
  fetchAuthSession: () => mockSession(),
  signIn: () => mockSignIn(),
  signOut: () => mockSignOut(),
  signInWithRedirect: () => mockSignInWithRedirect(),
}));

jest.mock("../hooks/authHooks/authLifecycle", () => ({
  updateTimeout: () => mockTimeout(),
}));

describe("API lib", () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
        tokens: {
          idToken: {
            toString: () => "stringToken",
          },
        },
      });

      const result = await getRequestHeaders();

      expect(result).toStrictEqual({ "x-api-key": "stringToken" });
    });
  });

  test("getTokens()", async () => {
    await getTokens();
    expect(mockSession).toHaveBeenCalledTimes(1);
  });

  test("authenticateWithIDM()", async () => {
    await authenticateWithIDM();
    expect(mockSignInWithRedirect).toHaveBeenCalledTimes(1);
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
    expect(mockSession).toHaveBeenCalledTimes(1);
  });

  test("Calling post should update the session timeout", async () => {
    const apiSpy = jest.spyOn(mockAmplifyApi, "post");
    const test = async () => await apiLib.post("/post");
    await expect(test()).resolves.toEqual({ json: "blob" });
    expect(apiSpy).toHaveBeenCalledTimes(1);
    expect(mockTimeout).toHaveBeenCalledTimes(1);
  });

  test("Calling put should update the session timeout", async () => {
    const apiSpy = jest.spyOn(mockAmplifyApi, "put");
    const test = async () => await apiLib.put("/put");
    await expect(test()).resolves.toEqual({ json: "blob" });
    expect(apiSpy).toHaveBeenCalledTimes(1);
    expect(mockTimeout).toHaveBeenCalledTimes(1);
  });

  test("Calling get should update the session timeout", async () => {
    const apiSpy = jest.spyOn(mockAmplifyApi, "get");
    const test = async () => await apiLib.get("/get");
    await expect(test()).resolves.toEqual({ json: "blob" });
    expect(apiSpy).toHaveBeenCalledTimes(1);
    expect(mockTimeout).toHaveBeenCalledTimes(1);
  });

  test("Calling del should update the session timeout", async () => {
    const apiSpy = jest.spyOn(mockAmplifyApi, "del");
    const test = async () => await apiLib.del("/del");
    await expect(test()).resolves.toEqual(undefined);
    expect(apiSpy).toHaveBeenCalledTimes(1);
    expect(mockTimeout).toHaveBeenCalledTimes(1);
  });

  test("API error throws with response info", async () => {
    const apiSpy = jest.spyOn(mockAmplifyApi, "get");
    jest.spyOn(console, "log").mockImplementation(jest.fn());
    const spy = jest.spyOn(console, "log");

    apiSpy.mockImplementationOnce(() => {
      throw {
        response: {
          body: "Error Info",
        },
      };
    });

    await expect(apiLib.get("/get")).rejects.toThrow(
      "Request Failed - /get - Error Info"
    );
    expect(spy).toHaveBeenCalledTimes(2);
  });

  test("API error throws without response info", async () => {
    const apiSpy = jest.spyOn(mockAmplifyApi, "post");
    jest.spyOn(console, "log").mockImplementation(jest.fn());
    const spy = jest.spyOn(console, "log");

    apiSpy.mockImplementationOnce(() => {
      throw "String Error";
    });

    await expect(apiLib.post("/post")).rejects.toThrow(
      "Request Failed - /post - undefined"
    );
    expect(spy).toHaveBeenCalledTimes(2);
  });
});
