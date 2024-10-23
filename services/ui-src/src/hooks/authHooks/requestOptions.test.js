import requestOptions from "./requestOptions";

jest.mock("aws-amplify/auth", () => ({
  fetchAuthSession: jest.fn().mockReturnValue({
    tokens: {
      idToken: "mock token",
    },
  }),
}));

describe("requestOptions", () => {
  test("should provide an empty request with an API key header", async () => {
    const result = await requestOptions();

    expect(result).toEqual({
      headers: {
        "x-api-key": "mock token",
      },
    });
  });

  test("should decorate requests with an API key header", async () => {
    const mockBody = { foo: "bar" };
    const result = await requestOptions(mockBody);

    expect(result).toEqual({
      headers: {
        "x-api-key": "mock token",
      },
      body: {
        foo: "bar",
      },
    });
  });
});
