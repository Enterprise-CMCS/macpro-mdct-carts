/* eslint-disable no-console */
import { testEvent } from "../../../test-util/testEvents";
import { APIGatewayProxyEvent } from "../../../types";
import { print } from "../printPdf";
import { fetch } from "cross-fetch";

jest.spyOn(console, "error").mockImplementation();

jest.mock("../../../libs/authorization", () => ({
  isAuthorized: jest.fn().mockReturnValue(true),
}));

jest.mock("@smithy/signature-v4", () => ({
  SignatureV4: function () {
    return {
      sign: jest.fn().mockImplementation((request) => ({
        ...request,
        headers: {
          ...request.headers,
          "x-amz-date": "mock date",
          "x-amz-security-token": "mock token",
          "x-amz-content-sha256": "mock sha",
          authorization: `SignedHeaders=${Object.keys(request.headers).join(
            ","
          )},x-amz-content-sha256;x-amz-date;x-amz-security-token, Signature=mock signature`,
        },
      })),
    };
  },
}));

jest.mock("cross-fetch", () => ({
  fetch: jest.fn().mockResolvedValue({
    // Base64 PDFs always start with JBVERi0, which is "%PDF-"
    json: jest.fn().mockResolvedValue("JVBERi0xLjc="),
  }),
}));

describe("Test Print PDF handler", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.AWS_ACCESS_KEY_ID = "mock key id"; // pragma: allowlist secret
  });

  test("should make a request to prince and return data", async () => {
    const event: APIGatewayProxyEvent = {
      ...testEvent,
      body: `{"encodedHtml": "HtMl"}`,
    };

    const res = await print(event, null);

    expect(fetch).toHaveBeenCalledWith(
      "https://mockhost/mockpath/",
      expect.objectContaining({
        body: "HtMl",
        headers: expect.objectContaining({
          authorization: expect.stringContaining("SignedHeaders=host,"),
        }),
      })
    );
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body)).toEqual({
      data: "JVBERi0xLjc=",
    });
  });

  test("missing encoded Html should throw an error", async () => {
    const event: APIGatewayProxyEvent = {
      ...testEvent,
      pathParameters: {},
      body: `{}`,
    };

    const res = await print(event, null);
    expect(res.statusCode).toBe(500);
  });

  test("missing AWS credentials should throw an error", async () => {
    delete process.env.AWS_ACCESS_KEY_ID;
    const event: APIGatewayProxyEvent = {
      ...testEvent,
      pathParameters: {},
      body: `{"encodedHtml": "HtMl"}`,
    };

    const res = await print(event, null);
    expect(res.statusCode).toBe(500);
  });
});
