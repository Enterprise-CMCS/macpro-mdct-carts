import { testEvent } from "../../../test-util/testEvents";
import { APIGatewayProxyEvent } from "../../../types";
import { print } from "../printPdf";
import { gzipSync } from "node:zlib";
import Prince from "prince";

jest.spyOn(console, "error").mockImplementation();
jest.spyOn(console, "warn").mockImplementation();

jest.mock("prince", () => {
  const mockExecute = jest.fn().mockResolvedValue(undefined);
  const mockOption = jest.fn().mockReturnThis();
  const mockOutput = jest.fn().mockReturnThis();
  const mockInputs = jest.fn().mockReturnThis();
  const mockLicense = jest.fn().mockReturnThis();
  const mockPrince = jest.fn(() => ({
    license: mockLicense,
    inputs: mockInputs,
    output: mockOutput,
    option: mockOption,
    execute: mockExecute,
  }));
  return mockPrince;
});

jest.mock("node:fs", () => ({
  writeFileSync: jest.fn(),
  readFileSync: jest.fn(() => Buffer.from("%PDF-1.7")),
  unlinkSync: jest.fn(),
}));

jest.mock("../../../libs/authorization", () => ({
  isAuthorized: jest.fn().mockReturnValue(true),
}));

const dangerousHtml =
  "<html><head></head><body><p>abc<iframe//src=jAva&Tab;script:alert(3)>def</p></body></html>";
const compressedHtml = gzipSync(dangerousHtml);
const sanitizedHtml = "<html><head></head><body><p>abcdef</p></body></html>";
const base64EncodedDangerousHtml =
  Buffer.from(compressedHtml).toString("base64");

describe("Test Print PDF handler", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.princeLicense = "mock-license-content";
  });

  test("should use Prince XML and return PDF data", async () => {
    const event: APIGatewayProxyEvent = {
      ...testEvent,
      body: base64EncodedDangerousHtml,
    };

    const res = await print(event, null);

    expect(Prince).toHaveBeenCalled();
    const princeInstance = (Prince as jest.Mock).mock.results[0].value;
    expect(princeInstance.license).toHaveBeenCalled();
    expect(princeInstance.inputs).toHaveBeenCalled();
    expect(princeInstance.output).toHaveBeenCalled();
    expect(princeInstance.option).toHaveBeenCalledWith(
      "pdf-profile",
      "PDF/UA-1"
    );
    expect(princeInstance.execute).toHaveBeenCalled();

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body)).toEqual({
      data: "JVBERi0xLjc=",
    });

    const fs = require("node:fs");
    expect(fs.writeFileSync).toHaveBeenCalled();
    const writtenHtml = (fs.writeFileSync as jest.Mock).mock.calls[0][1];
    expect(writtenHtml).toBe(sanitizedHtml);
  });

  test("should throw an error if event body is empty", async () => {
    const event: APIGatewayProxyEvent = {
      ...testEvent,
      body: null,
    };

    const res = await print(event, null);
    expect(res.statusCode).toBe(500);
  });

  test("should throw an error if license is missing", async () => {
    delete process.env.princeLicense;
    const event: APIGatewayProxyEvent = {
      ...testEvent,
      body: base64EncodedDangerousHtml,
    };

    const res = await print(event, null);
    expect(res.statusCode).toBe(500);
  });

  test("should handle errors from Prince XML", async () => {
    const event: APIGatewayProxyEvent = {
      ...testEvent,
      body: base64EncodedDangerousHtml,
    };

    const mockExecute = jest
      .fn()
      .mockRejectedValue(new Error("Prince conversion failed"));
    (Prince as jest.Mock).mockReturnValueOnce({
      license: jest.fn().mockReturnThis(),
      inputs: jest.fn().mockReturnThis(),
      output: jest.fn().mockReturnThis(),
      option: jest.fn().mockReturnThis(),
      execute: mockExecute,
    });

    const res = await print(event, null);

    expect(res.statusCode).toBe(500);
    expect(console.warn).toHaveBeenCalled();
  });

  test("should preserve html, head, and body tags", async () => {
    const inputHtml = `<html lang="en"><head><title>My Page</title><meta name="author" content="CMS" /></head><body>Hello, world</body></html>`;
    const event = {
      ...testEvent,
      body: Buffer.from(gzipSync(inputHtml)).toString("base64"),
    };

    await print(event, null);

    const fs = require("node:fs");
    expect(fs.writeFileSync).toHaveBeenCalled();
    const writtenHtml = (fs.writeFileSync as jest.Mock).mock.calls[0][1];
    expect(writtenHtml).toBe(inputHtml);
  });
});
