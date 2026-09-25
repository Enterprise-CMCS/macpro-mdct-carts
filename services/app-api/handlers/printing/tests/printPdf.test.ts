import { EventEmitter } from "node:events";
import { chmodSync, existsSync, statSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { Readable, Writable } from "node:stream";
import { testEvent } from "../../../test-util/testEvents";
import { APIGatewayProxyEvent } from "../../../types";

jest.spyOn(console, "warn").mockImplementation();

const mockSpawn = jest.fn();

jest.mock("node:child_process", () => ({
  spawn: (...args: unknown[]) => mockSpawn(...args),
}));

jest.mock("node:fs", () => {
  const actual = jest.requireActual<typeof import("node:fs")>("node:fs");
  return {
    ...actual,
    existsSync: jest.fn(() => false),
    statSync: jest.fn(() => ({ mode: 0o100755 })),
    chmodSync: jest.fn(),
  };
});

jest.mock("../../../libs/authorization", () => ({
  isAuthorized: jest.fn().mockReturnValue(true),
}));

import { print } from "../printPdf";

const mockedExistsSync = jest.mocked(existsSync);
const mockedStatSync = jest.mocked(statSync);
const mockedChmodSync = jest.mocked(chmodSync);

const dangerousHtml =
  '<html><head></head><body><p>abc<iframe src="javascript:alert(3)"></iframe>def</p></body></html>';
const compressedHtml = gzipSync(dangerousHtml);
const sanitizedHtml = "<html><head></head><body><p>abcdef</p></body></html>";
const base64EncodedDangerousHtml =
  Buffer.from(compressedHtml).toString("base64");
const mockPdfBytes = Buffer.from("%PDF-1.7");

type MockChild = EventEmitter & {
  stdout: Readable;
  stderr: Readable;
  stdin: Writable;
  kill: jest.Mock;
};

function createPrinceChild({
  stdout,
  stderr = "",
  code = 0,
  epipeOnWrite = false,
}: {
  stdout?: Buffer;
  stderr?: string;
  code?: number;
  epipeOnWrite?: boolean;
}): { child: MockChild; getStdin: () => string } {
  const chunks: Buffer[] = [];
  // oxlint-disable-next-line unicorn/prefer-event-target -- Node child_process mock
  const child = new EventEmitter() as MockChild;
  child.stdout = new Readable({ read() {} });
  child.stderr = new Readable({ read() {} });
  child.kill = jest.fn();
  child.stdin = new Writable({
    write(chunk, _encoding, callback) {
      if (epipeOnWrite) {
        const error = new Error("write EPIPE") as NodeJS.ErrnoException;
        error.code = "EPIPE";
        callback(error);
        process.nextTick(() => {
          if (stderr) {
            child.stderr.push(Buffer.from(stderr));
          }
          child.stderr.push(null);
          child.stdout.push(null);
          child.emit("close", code);
        });
        return;
      }
      chunks.push(Buffer.from(chunk));
      callback();
    },
    final(callback) {
      // Defer close so stdout/stderr data listeners run first
      if (stdout) {
        child.stdout.push(stdout);
      }
      child.stdout.push(null);
      if (stderr) {
        child.stderr.push(Buffer.from(stderr));
      }
      child.stderr.push(null);
      process.nextTick(() => {
        child.emit("close", code);
        callback();
      });
    },
  });

  return {
    child,
    getStdin: () => Buffer.concat(chunks).toString(),
  };
}

describe("Test Print PDF handler", () => {
  beforeEach(() => {
    process.env = {
      LAMBDA_TASK_ROOT: "/var/task",
      STAGE: "dev",
    };
    mockSpawn.mockReset();
    mockedExistsSync.mockReset().mockReturnValue(false);
    mockedStatSync
      .mockReset()
      .mockReturnValue({ mode: 0o100755 } as ReturnType<typeof statSync>);
    mockedChmodSync.mockReset();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should throw error when no body provided", async () => {
    const event: APIGatewayProxyEvent = {
      ...testEvent,
      body: null,
    };
    const res = await print(event, null);

    expect(res.statusCode).toBe(500);
    expect(res.body).toContain("Missing request body");
  });

  test("should throw error when body is a JSON object", async () => {
    const event: APIGatewayProxyEvent = {
      ...testEvent,
      body: "{}",
    };
    const res = await print(event, null);

    expect(res.statusCode).toBe(500);
    expect(res.body).toContain("must be base64-encoded HTML");
  });

  test("should throw error when body is not valid gzipped HTML", async () => {
    const event: APIGatewayProxyEvent = {
      ...testEvent,
      body: Buffer.from("not-gzipped-html").toString("base64"),
    };
    const res = await print(event, null);

    expect(res.statusCode).toBe(500);
    expect(res.body).toContain("Failed to decompress gzipped HTML");
  });

  test("should call Prince with sanitized html and PDF/UA-1 profile", async () => {
    const { child, getStdin } = createPrinceChild({ stdout: mockPdfBytes });
    mockSpawn.mockReturnValue(child);
    const event: APIGatewayProxyEvent = {
      ...testEvent,
      body: base64EncodedDangerousHtml,
    };

    const res = await print(event, null);

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body)).toEqual({
      data: mockPdfBytes.toString("base64"),
    });
    expect(getStdin()).toBe(sanitizedHtml);
    expect(mockSpawn).toHaveBeenCalledWith(
      "./prince",
      ["-", "--output=-", "--pdf-profile=PDF/UA-1"],
      expect.objectContaining({ cwd: "/var/task" })
    );
  });

  test("should keep title in head and keep hidden banner guidance collapsed", async () => {
    const htmlWithTitleAndBanner = [
      "<html><head><title>Alabama CARTS 2025 Report</title></head><body>",
      '<div class="ds-c-usa-banner__guidance-container" hidden>',
      "<p>Official websites use .gov</p></div>",
      "<h1>Alabama CARTS FY2025 Report</h1></body></html>",
    ].join("");
    const { child, getStdin } = createPrinceChild({ stdout: mockPdfBytes });
    mockSpawn.mockReturnValue(child);
    const event: APIGatewayProxyEvent = {
      ...testEvent,
      body: Buffer.from(gzipSync(htmlWithTitleAndBanner)).toString("base64"),
    };

    const res = await print(event, null);
    const stdin = getStdin();

    expect(res.statusCode).toBe(200);
    expect(stdin).toContain("<title>Alabama CARTS 2025 Report</title>");
    // Title text must not leak as a bare head text node (would render on page 1).
    expect(stdin).not.toMatch(/<head>[^<]*Alabama CARTS 2025 Report/);
    expect(stdin).toMatch(
      /ds-c-usa-banner__guidance-container[^>]*hidden="hidden"/
    );
    expect(stdin).toMatch(
      /ds-c-usa-banner__guidance-container[^>]*display:\s*none/
    );
  });

  test("should return PDF when Prince logs UA-1 errors but still emits PDF bytes", async () => {
    const { child } = createPrinceChild({
      stdout: mockPdfBytes,
      stderr:
        "prince: error: not identifying as PDF/UA-1 due to problems in structure tree\n",
      code: 0,
    });
    mockSpawn.mockReturnValue(child);
    const event: APIGatewayProxyEvent = {
      ...testEvent,
      body: base64EncodedDangerousHtml,
    };

    const res = await print(event, null);

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body)).toEqual({
      data: mockPdfBytes.toString("base64"),
    });
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining("not identifying as PDF/UA-1")
    );
  });

  test("should fail when Prince produces no PDF", async () => {
    const { child } = createPrinceChild({
      stderr: "prince: error: invalid document",
      code: 1,
    });
    mockSpawn.mockReturnValue(child);
    const event: APIGatewayProxyEvent = {
      ...testEvent,
      body: base64EncodedDangerousHtml,
    };

    const res = await print(event, null);

    expect(res.statusCode).toBe(500);
    expect(res.body).toContain("PDF generation failed - invalid document");
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining("invalid document")
    );
  });

  test("should not crash with uncaught EPIPE when Prince closes stdin early", async () => {
    const { child } = createPrinceChild({
      stderr: "exec format error",
      code: 126,
      epipeOnWrite: true,
    });
    mockSpawn.mockReturnValue(child);
    const event: APIGatewayProxyEvent = {
      ...testEvent,
      body: base64EncodedDangerousHtml,
    };

    const res = await print(event, null);

    expect(res.statusCode).toBe(500);
    expect(res.body).toContain("PDF generation failed");
    expect(res.body).not.toContain("EPIPE");
  });

  test("should restore execute bits when Prince binary is not executable", async () => {
    const princePath = "/var/task/prince";
    mockedExistsSync.mockImplementation(
      (filePath) => String(filePath) === princePath
    );
    mockedStatSync.mockReturnValue({ mode: 0o100644 } as ReturnType<
      typeof statSync
    >);
    const { child } = createPrinceChild({ stdout: mockPdfBytes });
    mockSpawn.mockReturnValue(child);
    const event: APIGatewayProxyEvent = {
      ...testEvent,
      body: base64EncodedDangerousHtml,
    };

    const res = await print(event, null);

    expect(res.statusCode).toBe(200);
    expect(mockedChmodSync).toHaveBeenCalledWith(princePath, 0o755);
  });

  test("should include macOS package hint when Prince fails", async () => {
    mockedExistsSync.mockImplementation((filePath) =>
      String(filePath).endsWith("lib/prince/bin/prince")
    );
    const { child } = createPrinceChild({
      stderr: "prince: error: invalid document",
      code: 1,
    });
    mockSpawn.mockReturnValue(child);
    const event: APIGatewayProxyEvent = {
      ...testEvent,
      body: base64EncodedDangerousHtml,
    };

    const res = await print(event, null);

    expect(res.statusCode).toBe(500);
    expect(res.body).toContain("macOS package");
  });

  test("should include Linux AWS package hint when Prince fails", async () => {
    mockedExistsSync.mockImplementation((filePath) =>
      String(filePath).endsWith("prince-engine/bin/prince.x86_64")
    );
    const { child } = createPrinceChild({
      stderr: "prince: error: invalid document",
      code: 1,
    });
    mockSpawn.mockReturnValue(child);
    const event: APIGatewayProxyEvent = {
      ...testEvent,
      body: base64EncodedDangerousHtml,
    };

    const res = await print(event, null);

    expect(res.statusCode).toBe(500);
    expect(res.body).toContain("Linux AWS package");
  });
});
