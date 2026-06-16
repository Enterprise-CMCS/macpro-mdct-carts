import { gunzipSync } from "node:zlib";
import handler from "../../libs/handler-lib";
import { logger } from "../../libs/debug-lib";
import sanitizeHtml from "sanitize-html";
import Prince from "prince";
import { writeFileSync, readFileSync, unlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

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

  const { princeLicense } = process.env;
  if (!princeLicense) {
    throw new Error("No config found for Prince XML license");
  }

  const pdfBuffer = await generatePdfWithPrince(sanitizedHtml, princeLicense);
  const base64PdfData = pdfBuffer.toString("base64");
  return { data: base64PdfData };
});

async function generatePdfWithPrince(
  html: string,
  license: string
): Promise<Buffer> {
  const tmpDir = tmpdir();
  const inputFile = join(tmpDir, `prince-input-${Date.now()}.html`);
  const outputFile = join(tmpDir, `prince-output-${Date.now()}.pdf`);
  const licenseFile = join(tmpDir, `prince-license-${Date.now()}.dat`);

  try {
    writeFileSync(inputFile, html, "utf8");
    writeFileSync(licenseFile, license, "utf8");

    const prince = new Prince()
      .license(licenseFile)
      .inputs(inputFile)
      .output(outputFile)
      .option("pdf-profile", "PDF/UA-1");

    await prince.execute();

    const pdfBuffer = readFileSync(outputFile);
    logger.debug(`Successfully generated PDF with Prince XML`);
    return pdfBuffer;
  } catch (error) {
    logger.warn("Prince XML Error:", error);
    throw new Error(
      `PDF generation failed: ${error instanceof Error ? error.message : String(error)}`
    );
  } finally {
    try {
      unlinkSync(inputFile);
      unlinkSync(outputFile);
      unlinkSync(licenseFile);
    } catch (error) {
      logger.warn("Failed to clean up temporary files:", error);
    }
  }
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
 *  - "base" - The <base> tag tells the renderer to treat relative
 *    URLs (such as <img src="/bar.jpg"/>) as absolute ones (such as
 *    <img src="https://foo.com/bar.jpg"/>). Without this, Prince XML would
 *    reject our documents; when processing the document, relative
 *    URLs would appear as filesystem access attempts, which it disallows.
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
    base: ["href", "target"],
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
