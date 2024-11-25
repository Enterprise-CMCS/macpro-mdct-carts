import { apiLib } from "./apiLib";
import { updateTimeout } from "../hooks/authHooks";

const mockAmplifyApi = require("aws-amplify/api");

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
    const apiSpy = jest.spyOn(mockAmplifyApi, "post");
    await apiLib.post(path, mockOptions);

    expect(apiSpy).toBeCalledWith(requestObj);
    expect(updateTimeout).toBeCalled();
  });

  test("Calling put should update the session timeout", async () => {
    const apiSpy = jest.spyOn(mockAmplifyApi, "put");
    await apiLib.put(path, mockOptions);

    expect(apiSpy).toBeCalledWith(requestObj);
    expect(updateTimeout).toBeCalled();
  });

  test("Calling get should update the session timeout", async () => {
    const apiSpy = jest.spyOn(mockAmplifyApi, "get");
    await apiLib.get(path, mockOptions);

    expect(apiSpy).toBeCalledWith(requestObj);
    expect(updateTimeout).toBeCalled();
  });

  test("Calling del should update the session timeout", async () => {
    const apiSpy = jest.spyOn(mockAmplifyApi, "del");
    await apiLib.del(path, mockOptions);

    expect(apiSpy).toBeCalledWith(requestObj);
    expect(updateTimeout).toBeCalled();
  });

  test("API errors should be surfaced for handling", async () => {
    const apiSpy = jest.spyOn(mockAmplifyApi, "del");
    apiSpy.mockImplementationOnce(() => {
      throw new Error("500");
    });

    await expect(apiLib.del(path, mockOptions)).rejects.toThrow(Error);
  });
});
