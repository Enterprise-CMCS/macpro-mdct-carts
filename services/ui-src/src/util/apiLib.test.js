import { apiLib } from "./apiLib";
import { updateTimeout } from "../hooks/authHooks";
import { mockAmplifyRequest } from "./testing/testUtils";

const mockRequest = mockAmplifyRequest("some response");
jest.mock("aws-amplify/api", () => ({
  post: (r) => mockRequest(r),
  put: (r) => mockRequest(r),
  get: (r) => mockRequest(r),
  del: (r) => mockRequest(r),
}));

jest.mock("../hooks/authHooks", () => ({
  updateTimeout: jest.fn(),
  initAuthManager: jest.fn(),
  refreshCredentials: jest.fn(),
}));

const path = "my/url";
const apiName = "my-api";
const mockOptions = {
  headers: {
    "x-api-key": "mock key",
  },
  body: {
    foo: "bar",
  },
};
const requestObj = {
  apiName,
  path,
  options: mockOptions,
};

describe("API lib", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Calling post should update the session timeout", async () => {
    await apiLib.post(apiName, path, mockOptions);

    expect(mockRequest).toBeCalledWith(requestObj);
    expect(updateTimeout).toBeCalled();
  });

  test("Calling put should update the session timeout", async () => {
    await apiLib.put(apiName, path, mockOptions);

    expect(mockRequest).toBeCalledWith(requestObj);
    expect(updateTimeout).toBeCalled();
  });

  test("Calling get should update the session timeout", async () => {
    await apiLib.get(apiName, path, mockOptions);

    expect(mockRequest).toBeCalledWith(requestObj);
    expect(updateTimeout).toBeCalled();
  });

  test("Calling del should update the session timeout", async () => {
    await apiLib.del(apiName, path, mockOptions);

    expect(mockRequest).toBeCalledWith(requestObj);
    expect(updateTimeout).toBeCalled();
  });

  test("API errors should be surfaced for handling", async () => {
    mockRequest.mockImplementationOnce(() => {
      throw new Error("500");
    });

    await expect(apiLib.del(apiName, path, mockOptions)).rejects.toThrow(Error);
  });
});
