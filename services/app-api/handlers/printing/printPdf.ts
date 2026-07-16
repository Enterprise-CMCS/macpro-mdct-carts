import { gunzipSync } from "node:zlib";
import handler from "../../libs/handler-lib";
import { logger } from "../../libs/debug-lib";
import sanitizeHtml from "sanitize-html";
import Prince from "prince";
import { writeFileSync, unlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { spawn } from "node:child_process";

/**
 * Generates 508 compliant PDF using Prince XML for a given HTML block.
 */
export const print = handler(async (event, _context) => {
  const rawBody = event.body;
  if (!rawBody) {
    throw new Error("Missing request body");
  }

  const compressedBuffer = Buffer.from(rawBody, "base64");
  const decodedHtml = gunzipSync(compressedBuffer).toString();

  const sanitizedHtml = sanitizeHtml(decodedHtml, buildSanitizationConfig());
  const htmlWithBase = addSafeBaseHref(
    sanitizedHtml,
    getSafeBaseHref(event.headers)
  );

  const { princeLicense } = process.env;
  if (!princeLicense) {
    throw new Error("No config found for Prince XML license");
  }

  const pdfBuffer = await generatePdfWithPrince(htmlWithBase, princeLicense);
  const base64PdfData = pdfBuffer.toString("base64");
  return { data: base64PdfData };
});

async function generatePdfWithPrince(
  html: string,
  license: string
): Promise<Buffer> {
  const tmpDir = tmpdir();
  const invocationId = randomUUID();
  const licenseFile = join(tmpDir, `prince-license-${invocationId}.dat`);

  try {
    writeFileSync(licenseFile, license, "utf8");

    const prince = new Prince();
    const args = [
      ...(prince.config.prefix ? ["--prefix", prince.config.prefix] : []),
      "--license-file",
      licenseFile,
      "--input",
      "html",
      "--pdf-profile",
      "PDF/UA-1",
      "-",
      "--output",
      "-",
    ];
    const pdfBuffer = await executePrince(prince.config.binary, args, html);

    logger.debug(`Successfully generated PDF with Prince XML`);
    return pdfBuffer;
  } catch (error) {
    logger.error("Prince XML Error: %O", error);
    throw new Error("PDF generation failed");
  } finally {
    try {
      unlinkSync(licenseFile);
    } catch (error) {
      logger.warn(
        "Failed to clean up temporary file %s: %O",
        licenseFile,
        error
      );
    }
  }
}

async function executePrince(
  binary: string,
  args: string[],
  html: string
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const prince = spawn(binary, args, {
      stdio: ["pipe", "pipe", "pipe"],
    });
    const stdout: Buffer[] = [];
    const stderr: Buffer[] = [];
    let settled = false;

    const fail = (error: unknown) => {
      if (settled) {
        return;
      }
      settled = true;
      reject({
        error,
        stdout: Buffer.concat(stdout),
        stderr: Buffer.concat(stderr),
      });
    };

    prince.stdout.on("data", (chunk: Buffer) =>
      stdout.push(Buffer.from(chunk))
    );
    prince.stderr.on("data", (chunk: Buffer) =>
      stderr.push(Buffer.from(chunk))
    );
    prince.stdin.on("error", () => undefined);
    prince.on("error", fail);
    prince.on("close", (code: number | null, signal: string | null) => {
      if (settled) {
        return;
      }
      const output = Buffer.concat(stdout);
      const errorOutput = Buffer.concat(stderr);
      const princeError = errorOutput
        .toString()
        .match(/prince:\s+error:\s+([^\n]+)/)?.[1];

      if (princeError) {
        fail(princeError);
        return;
      }
      if (code !== 0) {
        const exit = signal ? `signal ${signal}` : `code ${code}`;
        fail(new Error(`Prince exited with ${exit}`));
        return;
      }
      settled = true;
      resolve(output);
    });

    prince.stdin.end(html, "utf8");
  });
}

function getSafeBaseHref(headers: Record<string, string | undefined>) {
  const origin = Object.entries(headers).find(
    ([key]) => key.toLowerCase() === "origin"
  )?.[1];
  let url: URL;
  try {
    url = new URL(origin ?? "");
  } catch {
    throw new Error("PDF request origin must be an HTTPS URL");
  }
  if (
    url.protocol !== "https:" ||
    url.pathname !== "/" ||
    url.search !== "" ||
    url.hash !== "" ||
    url.username !== "" ||
    url.password !== ""
  ) {
    throw new Error("PDF request origin must be an HTTPS URL");
  }
  return `${url.origin}/`;
}

function addSafeBaseHref(html: string, baseHref: string) {
  const headTag = html.match(/<head(?:\s[^>]*)?>/i)?.[0];
  if (!headTag) {
    throw new Error("PDF HTML must include a head tag");
  }
  return html.replace(headTag, `${headTag}<base href="${baseHref}" />`);
}

/*
 * These settings are a best-effort to prevent attacks when processing the document.
 * Since no one but the user making the request will see the resulting PDF,
 * these settings are more relaxed than how we sanitize other API requests.
 * Notably, we allow `style` (tags and attrs), which is normally forbidden.
 * Some sanitization parameters explained:
 *  - "head" - Add <head> to the tag allowlist. It's important.
 *  - "html" - We want the entire <html> document returned.
 *  - "link" - We use <link> tags to include some styles.
 *  - "title" and "meta" - Preserve document metadata used by PDF renderers.
 *  - "polyline" - This makes checkbox checkmarks visible.
 *  - "style" - The print document needs embedded styles for visual fidelity.
 */
const buildSanitizationConfig = (): sanitizeHtml.IOptions => {
  const defaults = sanitizeHtml.defaults;
  const extraAttributes = {
    a: [...defaults.allowedAttributes.a, "rel"],
    html: ["lang"],
    img: [...defaults.allowedAttributes.img, "class", "style"],
    link: ["rel", "href", "type", "media"],
    meta: ["name", "content", "charset"],
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
  const extraTags = [
    "html",
    "body",
    "head",
    "title",
    "meta",
    "style",
    "label",
    "form",
  ];
  return {
    // We must allowVulnerableTags in order to preserve `<style>` tags
    allowVulnerableTags: true,
    allowedAttributes: {
      ...defaults.allowedAttributes,
      ...extraAttributes,
      "*": ["class", "style", "id", "data-*"],
    },
    allowedTags: [
      ...defaults.allowedTags,
      ...Object.keys(extraAttributes),
      ...extraTags,
    ],
  };
};
