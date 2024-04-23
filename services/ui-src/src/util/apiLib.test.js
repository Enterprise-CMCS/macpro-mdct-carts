import { apiLib } from "./apiLib";
import { put, post, get, del } from "aws-amplify/api";
import { updateTimeout } from "../hooks/authHooks";

jest.mock("aws-amplify/api", () => ({
  post: jest.fn(),
  put: jest.fn(),
  get: jest.fn(),
  del: jest.fn(),
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
    await apiLib.post("my-api", "my/url", mockOptions);

    expect(post).toBeCalledWith("my-api", "my/url", mockOptions);
    expect(updateTimeout).toBeCalled();
  });

  test("Calling put should update the session timeout", () => {
    await apiLib.put("my-api", "my/url", mockOptions);

    expect(put).toBeCalledWith("my-api", "my/url", mockOptions);
    expect(updateTimeout).toBeCalled();
  });

  test("Calling get should update the session timeout", () => {
    await apiLib.get("my-api", "my/url", mockOptions);

    expect(get).toBeCalledWith("my-api", "my/url", mockOptions);
    expect(updateTimeout).toBeCalled();
  });

  test("Calling del should update the session timeout", () => {
    await apiLib.del("my-api", "my/url", mockOptions);

    expect(del).toBeCalledWith("my-api", "my/url", mockOptions);
    expect(updateTimeout).toBeCalled();
  });
});
