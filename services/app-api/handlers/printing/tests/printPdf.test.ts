import { testEvent } from "../../../test-util/testEvents";
import { APIGatewayProxyEvent } from "../../../types";
import { print } from "../printPdf";

jest.spyOn(console, "error").mockImplementation();
jest.spyOn(console, "warn").mockImplementation();
global.fetch = jest.fn().mockImplementationOnce(() => {
  return new Promise((resolve) => {
    resolve({
      status: 200,
      headers: {
        get: jest.fn().mockResolvedValue("3"),
      },
      arrayBuffer: jest.fn().mockResolvedValue(
        // An ArrayBuffer containing `%PDF-1.7`
        new Uint8Array([37, 80, 68, 70, 45, 49, 46, 55]).buffer
      ),
    });
  });
});

jest.mock("../../../libs/authorization", () => ({
  isAuthorized: jest.fn().mockReturnValue(true),
}));

const html = "<p>abc</p>";
const base64EncodedHtml = Buffer.from(html).toString("base64");

describe("Test Print PDF handler", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.docraptorApiKey = "mock api key"; // pragma: allowlist secret
  });

  test("should make a request to prince and return data", async () => {
    const event: APIGatewayProxyEvent = {
      ...testEvent,
      body: `{"encodedHtml": "${base64EncodedHtml}"}`,
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
        document_content: html,
        type: "pdf",
        tag: expect.stringMatching("CARTS"),
        prince_options: expect.objectContaining({
          profile: "PDF/UA-1",
        }),
      }),
    });

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body)).toEqual({
      // The string `%PDF-1.7`, base64-encoded
      data: "JVBERi0xLjc=",
    });
  });

  test("should throw an error if event body is empty", async () => {
    const event: APIGatewayProxyEvent = {
      ...testEvent,
      body: `{}`,
    };

    const res = await print(event, null);
    expect(res.statusCode).toBe(500);
  });

  test("should throw an error if API key is missing", async () => {
    delete process.env.docraptorApiKey;
    const event: APIGatewayProxyEvent = {
      ...testEvent,
      body: `{"encodedHtml": "${base64EncodedHtml}"}`,
    };

    const res = await print(event, null);
    expect(res.statusCode).toBe(500);
  });

  test("should handle errors from PDF API", async () => {
    const event: APIGatewayProxyEvent = {
      ...testEvent,
      body: `{"encodedHtml": "${base64EncodedHtml}"}`,
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      status: 500,
      text: jest.fn().mockResolvedValue("<error>It broke.</error>"),
    });

    const res = await print(event, null);

    expect(res.statusCode).toBe(500);
    expect(console.warn).toHaveBeenCalledWith(
      expect.any(Date),
      expect.stringContaining("It broke.")
    );
  });

  test("should preserve html, head, and body tags", async () => {
    const inputHtml = `<html lang="en"><head><title>My Page</title></head><body>Hello, world</body></html>`;
    const b64html = Buffer.from(inputHtml).toString("base64");
    const event = {
      ...testEvent,
      body: JSON.stringify({ encodedHtml: b64html }),
    };

    await print(event, null);

    const request = (fetch as jest.Mock).mock.calls[0][1];
    const body = JSON.parse(request.body);
    const sentHtml = body.doc.document_content;
    expect(sentHtml).toBe(inputHtml);
  });
});
