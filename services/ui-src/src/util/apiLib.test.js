import { apiLib } from "./apiLib";
import { API } from "aws-amplify";
import { updateTimeout } from "../hooks/authHooks";

jest.mock("aws-amplify", () => ({
  API: {
    post: jest.fn(),
    put: jest.fn(),
    get: jest.fn(),
    del: jest.fn(),
  },
}));

jest.mock("../hooks/authHooks", () => ({
  updateTimeout: jest.fn(),
}));

const mockOptions = {
  headers: {
    "x-api-key": "mock key",
  },
  body: {
    foo: "bar",
  },
};

describe("API lib", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Calling post should update the session timeout", () => {
    apiLib.post("my-api", "my/url", mockOptions);

    expect(API.post).toBeCalledWith("my-api", "my/url", mockOptions);
    expect(updateTimeout).toBeCalled();
  });

  test("Calling put should update the session timeout", () => {
    apiLib.put("my-api", "my/url", mockOptions);

    expect(API.put).toBeCalledWith("my-api", "my/url", mockOptions);
    expect(updateTimeout).toBeCalled();
  });

  test("Calling get should update the session timeout", () => {
    apiLib.get("my-api", "my/url", mockOptions);

    expect(API.get).toBeCalledWith("my-api", "my/url", mockOptions);
    expect(updateTimeout).toBeCalled();
  });

  test("Calling del should update the session timeout", () => {
    apiLib.del("my-api", "my/url", mockOptions);

    expect(API.del).toBeCalledWith("my-api", "my/url", mockOptions);
    expect(updateTimeout).toBeCalled();
  });
});
