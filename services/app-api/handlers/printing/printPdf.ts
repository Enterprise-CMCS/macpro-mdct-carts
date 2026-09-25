import { spawn } from "node:child_process";
import { chmodSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { gunzipSync } from "node:zlib";
import handler from "../../libs/handler-lib";
import sanitizeHtml from "sanitize-html";

const PRINCE_TIMEOUT_MS = 10_000;
// Default Prince/DocRaptor media is print so @media print rules hide app chrome.
const PRINCE_ARGS = ["-", "--output=-", "--pdf-profile=PDF/UA-1"] as const;

/**
 * Generates a 508-compliant PDF using the vendored Prince binary for a given HTML block.
 */
export const print = handler(async (event, _context) => {
  const rawBody = event.body; // will be base64-encoded gzipped HTML, like "H4sI..."
  if (!rawBody) {
    throw new Error("Missing request body");
  }
  if (rawBody.startsWith("{")) {
    throw new Error("Body must be base64-encoded HTML, not a JSON object");
  }

  const compressedBuffer = Buffer.from(rawBody, "base64");

  let decodedHtml;
  try {
    decodedHtml = gunzipSync(compressedBuffer).toString();
  } catch (error) {
    throw new Error("Failed to decompress gzipped HTML: " + error);
  }

  const sanitizedHtml = sanitizeHtml(decodedHtml, buildSanitizationConfig());

  const pdfBuffer = await renderPdfWithPrince(sanitizedHtml);
  return {
    data: pdfBuffer.toString("base64"),
  };
});

function describePrincePackageLayout(taskRoot: string): string {
  if (existsSync(join(taskRoot, "lib/prince/bin/prince"))) {
    return "macOS package";
  }
  if (
    existsSync(join(taskRoot, "prince-engine/bin/prince.x86_64")) ||
    existsSync(join(taskRoot, "prince-engine/bin/prince.aarch64"))
  ) {
    return "Linux AWS package";
  }
  return "unknown package layout";
}

/**
 * Ministack/LocalStack often extracts Lambda zips without preserving +x.
 * Restore execute bits when missing so spawn("./prince") does not fail with EACCES.
 */
function ensurePrinceExecutable(taskRoot: string) {
  const candidates = [
    join(taskRoot, "prince"),
    join(taskRoot, "prince-engine/bin/prince"),
    join(taskRoot, "prince-engine/bin/prince.x86_64"),
    join(taskRoot, "prince-engine/bin/prince.aarch64"),
    join(taskRoot, "lib/prince/bin/prince"),
  ];
  for (const filePath of candidates) {
    if (!existsSync(filePath)) continue;
    const mode = statSync(filePath).mode;
    if ((mode & 0o111) === 0) {
      try {
        chmodSync(filePath, 0o755);
      } catch {
        // /var/task is read-only on real AWS; ignore — zip should already have +x there.
      }
    }
  }
}

function isPdfBuffer(buffer: Buffer): boolean {
  return buffer.length > 0 && buffer.subarray(0, 4).toString() === "%PDF";
}

function buildPrinceFailureMessage(
  stderr: string,
  code: number | null,
  signal: NodeJS.Signals | null,
  taskRoot: string
): string {
  const princeError = stderr.match(/prince:\s+error:\s+([^\n]+)/i);
  const packageHint = describePrincePackageLayout(taskRoot);
  const detail = princeError
    ? princeError[1]
    : stderr.trim() ||
      `prince exited with code ${code ?? "unknown"}${
        signal ? ` signal ${signal}` : ""
      }`;
  return `PDF generation failed - ${detail} (${packageHint} in ${taskRoot})`;
}

function isIgnorableStdinError(error: NodeJS.ErrnoException): boolean {
  return error.code === "EPIPE" || error.code === "ERR_STREAM_DESTROYED";
}

function interpretPrinceClose({
  stdoutChunks,
  stderrChunks,
  code,
  signal,
  taskRoot,
}: {
  stdoutChunks: Buffer[];
  stderrChunks: Buffer[];
  code: number | null;
  signal: NodeJS.Signals | null;
  taskRoot: string;
}): { pdf: Buffer; error?: undefined } | { pdf?: undefined; error: Error } {
  const pdfBuffer = Buffer.concat(stdoutChunks);
  const stderr = Buffer.concat(stderrChunks).toString();

  // DocRaptor-like soft-fail: Prince often still emits a PDF while logging
  // PDF/UA-1 structure errors. Return the PDF and only fail when we got nothing usable.
  if (stderr) {
    console.warn(`Prince stderr (exit ${code ?? "unknown"}):\n${stderr}`);
  }

  if (isPdfBuffer(pdfBuffer)) {
    return { pdf: pdfBuffer };
  }

  return {
    error: new Error(buildPrinceFailureMessage(stderr, code, signal, taskRoot)),
  };
}

/**
 * Run the vendored Prince binary against HTML on stdin and return PDF bytes on stdout.
 * `--pdf-profile=PDF/UA-1` gives us accessible PDF output.
 * Media defaults to `print` so existing `@media print` CSS hides header/print UI.
 */
export function renderPdfWithPrince(html: string): Promise<Buffer> {
  const taskRoot = process.env.LAMBDA_TASK_ROOT ?? process.cwd();
  ensurePrinceExecutable(taskRoot);

  return new Promise((resolve, reject) => {
    const child = spawn("./prince", [...PRINCE_ARGS], {
      cwd: taskRoot,
      env: process.env,
    });

    const stdoutChunks: Buffer[] = [];
    const stderrChunks: Buffer[] = [];
    let settled = false;

    const fail = (error: Error) => {
      if (settled) return;
      settled = true;
      reject(error);
    };

    const timeout = setTimeout(() => {
      child.kill("SIGKILL");
      fail(new Error("Prince PDF generation timed out"));
    }, PRINCE_TIMEOUT_MS);

    child.stdout.on("data", (chunk: Buffer) => stdoutChunks.push(chunk));
    child.stderr.on("data", (chunk: Buffer) => stderrChunks.push(chunk));
    child.on("error", (error) => {
      clearTimeout(timeout);
      fail(
        new Error(`Failed to spawn Prince in ${taskRoot}: ${error.message}. `)
      );
    });
    child.on("close", (code, signal) => {
      clearTimeout(timeout);
      if (settled) return;

      const result = interpretPrinceClose({
        stdoutChunks,
        stderrChunks,
        code,
        signal,
        taskRoot,
      });
      if (result.pdf) {
        settled = true;
        resolve(result.pdf);
        return;
      }
      fail(result.error);
    });

    if (!child.stdin) {
      clearTimeout(timeout);
      fail(new Error("Failed to open Prince stdin"));
      return;
    }

    // If Prince dies immediately (wrong arch binary, missing +x, bad license),
    // stdin write emits EPIPE. Ignore it and let the 'close' handler report stderr.
    child.stdin.on("error", (error: NodeJS.ErrnoException) => {
      if (isIgnorableStdinError(error)) {
        return;
      }
      clearTimeout(timeout);
      fail(error);
    });

    child.stdin.end(html);
  });
}

// This sanitization config is borrowed from QMR--best effort to prevent attacks due to parsing malicious HTML.
const buildSanitizationConfig = (): sanitizeHtml.IOptions => {
  const defaults = sanitizeHtml.defaults;
  const extraAttributes = {
    a: [...defaults.allowedAttributes.a, "rel"],
    img: [...defaults.allowedAttributes.img, "class", "style"],
    link: ["rel", "href", "type", "media"],
    base: ["href", "target"],
    meta: ["name", "content", "charset"],
    // Keep <title> so sanitize-html does not unwrap it into visible <head> text.
    title: [],
    input: [
      "type",
      "value",
      "checked",
      "disabled",
      "placeholder",
      "name",
      "id",
      "class",
      "style",
    ],
    button: ["type", "name", "id", "class", "style"],
    svg: [
      "width",
      "height",
      "viewBox",
      "xmlns",
      "fill",
      "stroke",
      "class",
      "style",
    ],
    path: ["d", "fill", "stroke", "class", "style"],
    polyline: ["points"],
  };
  // title/meta must be allowlisted: otherwise <title> text is left in <head>
  // as a visible text node (e.g. "Alabama CARTS 2025 Report" above the report).
  const extraTags = [
    "html",
    "body",
    "head",
    "style",
    "label",
    "form",
    "title",
    "meta",
  ];
  return {
    // We must allowVulnerableTags in order to preserve `<style>` tags
    allowVulnerableTags: true,
    allowedAttributes: {
      ...defaults.allowedAttributes,
      ...extraAttributes,
      // Include `hidden` so collapsed USA banner guidance stays collapsed.
      "*": ["class", "style", "id", "data-*", "hidden", "aria-*"],
    },
    allowedTags: [
      ...defaults.allowedTags,
      ...Object.keys(extraAttributes),
      ...extraTags,
    ],
    // sanitize-html drops bare boolean `hidden`; normalize so collapsed panels stay hidden.
    transformTags: {
      "*": (tagName, attribs) => {
        if (Object.hasOwn(attribs, "hidden")) {
          attribs.hidden = "hidden";
          const style = attribs.style?.trim() ?? "";
          if (!/(^|;)\s*display\s*:\s*none\s*(;|$)/i.test(style)) {
            attribs.style = style
              ? `${style.replace(/;?\s*$/, "")};display:none`
              : "display:none";
          }
        }
        return { tagName, attribs };
      },
    },
  };
};
