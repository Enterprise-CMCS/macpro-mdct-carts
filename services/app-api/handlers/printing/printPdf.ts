import handler from "../../libs/handler-lib";
import * as logger from "../../libs/debug-lib";
import createDOMPurify from "dompurify";
import { Window } from "happy-dom";
import Prince from "prince";
import { writeFileSync, readFileSync, unlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

declare module "dompurify" {
  interface DOMPurify {
    (root: Window): DOMPurify;
  }
}

const DOMPurify = createDOMPurify(new Window());

/**
 * Generates 508 compliant PDF using Prince XML for a given HTML block.
 */
export const print = handler(async (event, _context) => {
  const body = event.body ? JSON.parse(event.body) : {};
  const { encodedHtml } = body;
  if (!encodedHtml) {
    throw new Error("Missing required html string");
  }
  const rawHtml = Buffer.from(encodedHtml, "base64").toString("utf8");

  let sanitizedHtml;
  if (DOMPurify.isSupported) {
    sanitizedHtml = DOMPurify.sanitize(rawHtml, {
      WHOLE_DOCUMENT: true,
      ADD_TAGS: ["head", "link", "base"],
    });
  }
  if (!sanitizedHtml) {
    throw new Error("Could not process request");
  }

  const { princeLicense } = process.env;
  if (!princeLicense) {
    throw new Error("No config found for PDF generation");
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
