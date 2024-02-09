import { testEvent } from "../../../test-util/testEvents";
import { APIGatewayProxyEvent } from "../../../types";
import { print } from "../printPdf";
import { fetch } from "cross-fetch";

jest.spyOn(console, "error").mockImplementation();
jest.spyOn(console, "warn").mockImplementation();

jest.mock("../../../libs/authorization", () => ({
  isAuthorized: jest.fn().mockReturnValue(true),
}));

jest.mock("cross-fetch", () => ({
  fetch: jest.fn().mockResolvedValue({
    status: 200,
    headers: {
      get: jest.fn().mockResolvedValue("3"),
    },
    arrayBuffer: jest.fn().mockResolvedValue(
      // An ArrayBuffer containing `%PDF-1.7`
      new Uint8Array([37, 80, 68, 70, 45, 49, 46, 55]).buffer
    ),
  }),
}));

describe("Test Print PDF handler", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.docraptorApiKey = "mock api key"; // pragma: allowlist secret
  });

  test("should make a request to prince and return data", async () => {
    const event: APIGatewayProxyEvent = {
      ...testEvent,
      // The string `<html>`, base64-encoded
      body: `{"encodedHtml": "PGh0bWw+"}`,
    };

    const res = await print(event, null);

    expect(fetch).toHaveBeenCalled();
    const [url, request] = (fetch as jest.Mock).mock.calls[0];
    const body = JSON.parse(request.body);
    expect(url).toBe("https://docraptor.com/docs");
    expect(request).toEqual({
      method: "POST",
      headers: { "content-type": "application/json" },
      body: expect.stringMatching(/^\{.*\}$/),
    });
    expect(body).toEqual({
      user_credentials: "mock api key", // pragma: allowlist secret
      doc: expect.objectContaining({
        document_content: "<html>",
        type: "pdf",
      }),
    });

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body)).toEqual({
      // The string `%PDF-1.7`, base64-encoded
      data: "JVBERi0xLjc=",
    });
  });

  test("missing encoded Html should throw an error", async () => {
    const event: APIGatewayProxyEvent = {
      ...testEvent,
      body: `{}`,
    };

    const res = await print(event, null);
    expect(res.statusCode).toBe(500);
  });

  test("missing API Key should throw an error", async () => {
    delete process.env.docraptorApiKey;
    const event: APIGatewayProxyEvent = {
      ...testEvent,
      // The string `<html>`, base64-encoded
      body: `{"encodedHtml": "PGh0bWw+"}`,
    };

    const res = await print(event, null);
    expect(res.statusCode).toBe(500);
  });

  test("error response from PDF API should be handled", async () => {
    const event: APIGatewayProxyEvent = {
      ...testEvent,
      // The string `<html>`, base64-encoded
      body: `{"encodedHtml": "PGh0bWw+"}`,
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      status: 500,
      text: jest.fn().mockResolvedValue("<error>It broke.</error>"),
    });

    const res = await print(event, null);

    expect(res.statusCode).toBe(500);
    // eslint-disable-next-line no-console
    expect(console.warn).toBeCalledWith(
      expect.any(Date),
      expect.stringContaining("It broke.")
    );
  });
});
