import { testEvent } from "../../../test-util/testEvents";
import { APIGatewayProxyEvent } from "../../../types";
import { print } from "../printPdf";
import { gzipSync } from "node:zlib";
import Prince from "prince";
import { EventEmitter } from "node:events";
import { spawn } from "node:child_process";

jest.spyOn(console, "error").mockImplementation();
jest.spyOn(console, "warn").mockImplementation();

jest.mock("prince", () => {
  const mockPrince = jest.fn(() => ({
    config: {
      binary: "/opt/prince/bin/prince",
      prefix: "/opt/prince",
    },
  }));
  return mockPrince;
});

jest.mock("node:child_process", () => ({
  spawn: jest.fn(),
}));

jest.mock("node:fs", () => ({
  writeFileSync: jest.fn(),
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
const mockSpawn = spawn as jest.Mock;
let writtenStdin = "";

const createMockPrinceProcess = ({
  stdout = Buffer.from("%PDF-1.7"),
  stderr = Buffer.alloc(0),
  code = 0,
}: {
  stdout?: Buffer | string;
  stderr?: Buffer | string;
  code?: number | null;
} = {}) => {
  const child = new EventEmitter() as any;
  child.stdout = new EventEmitter();
  child.stderr = new EventEmitter();
  child.stdin = new EventEmitter() as any;
  child.stdin.end = jest.fn((data: string) => {
    writtenStdin = data;
    process.nextTick(() => {
      const stdoutBuffer = Buffer.from(stdout);
      const stderrBuffer = Buffer.from(stderr);
      if (stdoutBuffer.length > 0) {
        child.stdout.emit("data", stdoutBuffer);
      }
      if (stderrBuffer.length > 0) {
        child.stderr.emit("data", stderrBuffer);
      }
      child.emit("close", code, null);
    });
  });
  return child;
};

const buildEvent = (body: string | null): APIGatewayProxyEvent => ({
  ...testEvent,
  body,
  headers: {
    origin: "https://carts.example.com",
  },
});

describe("Test Print PDF handler", () => {
  beforeEach(() => {
    const fs = require("node:fs");
    process.env.princeLicense = "mock-license-content";
    writtenStdin = "";
    mockSpawn.mockImplementation(() => createMockPrinceProcess());
    (fs.writeFileSync as jest.Mock).mockImplementation(() => undefined);
    (fs.unlinkSync as jest.Mock).mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should use Prince XML and return PDF data", async () => {
    const event = buildEvent(base64EncodedDangerousHtml);

    const res = await print(event, null);

    expect(Prince).toHaveBeenCalled();
    expect(mockSpawn).toHaveBeenCalledWith(
      "/opt/prince/bin/prince",
      [
        "--prefix",
        "/opt/prince",
        "--license-file",
        expect.stringMatching(/prince-license-.+\.dat$/),
        "--input",
        "html",
        "--pdf-profile",
        "PDF/UA-1",
        "-",
        "--output",
        "-",
      ],
      { stdio: ["pipe", "pipe", "pipe"] }
    );

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body)).toEqual({
      data: "JVBERi0xLjc=",
    });

    const fs = require("node:fs");
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      expect.stringMatching(/prince-license-.+\.dat$/),
      "mock-license-content",
      "utf8"
    );
    expect(writtenStdin).toBe(
      sanitizedHtml.replace(
        "<head>",
        '<head><base href="https://carts.example.com/" />'
      )
    );
  });

  test("should throw an error if event body is empty", async () => {
    const event = buildEvent(null);

    const res = await print(event, null);
    expect(res.statusCode).toBe(500);
  });

  test("should throw an error if license is missing", async () => {
    delete process.env.princeLicense;
    const event = buildEvent(base64EncodedDangerousHtml);

    const res = await print(event, null);
    expect(res.statusCode).toBe(500);
  });

  test("should handle errors from Prince XML", async () => {
    const event = buildEvent(base64EncodedDangerousHtml);
    mockSpawn.mockImplementationOnce(() =>
      createMockPrinceProcess({
        stderr: "prince: error: Prince conversion failed",
        code: 1,
      })
    );

    const res = await print(event, null);

    expect(res.statusCode).toBe(500);
    expect(res.body).toContain("PDF generation failed");
    expect(res.body).not.toContain("Prince conversion failed");
    expect(console.error).toHaveBeenCalled();
  });

  test("should preserve html, head, and body tags", async () => {
    const inputHtml = `<html lang="en"><head><title>My Page</title><meta name="author" content="CMS" /></head><body>Hello, world</body></html>`;
    const event = buildEvent(Buffer.from(gzipSync(inputHtml)).toString("base64"));

    await print(event, null);

    expect(writtenStdin).toBe(
      inputHtml.replace(
        "<head>",
        '<head><base href="https://carts.example.com/" />'
      )
    );
  });

  test("should replace document base tags with a safe origin base href", async () => {
    const inputHtml = `<html><head><base href="file:///etc/" /></head><body><img src="/logo.svg" /></body></html>`;
    const event = buildEvent(Buffer.from(gzipSync(inputHtml)).toString("base64"));

    await print(event, null);

    expect(writtenStdin).toContain(
      '<head><base href="https://carts.example.com/" />'
    );
    expect(writtenStdin).not.toContain("file:///etc/");
  });

  test("should reject non-https origins for PDF base href", async () => {
    const event = buildEvent(base64EncodedDangerousHtml);
    event.headers = {
      origin: "http://carts.example.com",
    };

    const res = await print(event, null);

    expect(res.statusCode).toBe(500);
    expect(res.body).toContain("PDF request origin must be an HTTPS URL");
  });

  test("should not write temporary html or pdf files", async () => {
    const event = buildEvent(base64EncodedDangerousHtml);

    await print(event, null);

    const fs = require("node:fs");
    expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
    expect((fs.writeFileSync as jest.Mock).mock.calls[0][0]).toMatch(
      /prince-license-.+\.dat$/
    );
    expect(mockSpawn.mock.calls[0][1]).toContain("-");
  });

  test("should return the PDF written to stdout", async () => {
    const event = buildEvent(base64EncodedDangerousHtml);
    mockSpawn.mockImplementationOnce(() =>
      createMockPrinceProcess({ stdout: Buffer.from("mock-pdf") })
    );

    const res = await print(event, null);

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body)).toEqual({
      data: Buffer.from("mock-pdf").toString("base64"),
    });
  });

  test("should clean up the temporary license file", async () => {
    const fs = require("node:fs");
    const event = buildEvent(base64EncodedDangerousHtml);
    (fs.unlinkSync as jest.Mock)
      .mockImplementationOnce(() => {
        throw new Error("cleanup failed");
      })
      .mockImplementation(() => undefined);

    await print(event, null);

    expect(fs.unlinkSync).toHaveBeenCalledTimes(1);
  });
});
