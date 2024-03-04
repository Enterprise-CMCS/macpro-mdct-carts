import handler from "../../libs/handler-lib";
import * as logger from "../../libs/debug-lib";
import createDOMPurify from "dompurify";
import { JSDOM } from "jsdom";
import { fetch } from "cross-fetch"; // TODO delete this line and uninstall this package, once CARTS is running on Nodejs 18+

const windowEmulator: any = new JSDOM("").window;
const DOMPurify = createDOMPurify(windowEmulator);

/**
 * Generates 508 compliant PDF using an external Prince-based service for a given HTML block.
 */
export const print = handler(async (event, _context) => {
  const body = event.body ? JSON.parse(event.body) : {};
  const { encodedHtml } = body;
  if (!encodedHtml) {
    throw new Error("Missing required html string");
  }
  const rawHtml = Buffer.from(encodedHtml, "base64").toString("utf-8");

  let sanitizedHtml;
  if (DOMPurify.isSupported) {
    sanitizedHtml = DOMPurify.sanitize(rawHtml);
  }
  if (!sanitizedHtml) {
    throw new Error("Could not process request");
  }

  const { docraptorApiKey, stage } = process.env;
  if (!docraptorApiKey) {
    throw new Error("No config found to make request to PDF API");
  }

  const requestBody = {
    user_credentials: docraptorApiKey,
    doc: {
      document_content: sanitizedHtml,
      type: "pdf" as const,
      // This tag differentiates QMR and CARTS requests in DocRaptor's logs.
      tag: "CARTS",
      test: stage !== "production",
      prince_options: {
        profile: "PDF/UA-1" as const,
      },
    },
  };

  const arrayBuffer = await sendDocRaptorRequest(requestBody);
  const base64PdfData = Buffer.from(arrayBuffer).toString("base64");
  return { data: base64PdfData };
});

async function sendDocRaptorRequest(request: DocRaptorRequestBody) {
  const response = await fetch("https://docraptor.com/docs", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(request),
  });

  await handlePdfStatusCode(response);

  const pdfPageCount = response.headers.get("X-DocRaptor-Num-Pages");
  logger.debug(`Successfully generated a ${pdfPageCount}-page PDF.`);

  return response.arrayBuffer();
}

/**
 * If PDF generation was not successful, log the reason and throw an error.
 *
 * For more details see https://docraptor.com/documentation/api/status_codes
 */
async function handlePdfStatusCode(response: Response) {
  if (response.status === 200) {
    return;
  }

  const xmlErrorMessage = await response.text();
  logger.warn("DocRaptor Error Message:\n" + xmlErrorMessage);

  switch (response.status) {
    case 400: // Bad Request
    case 422: // Unprocessable Entity
      throw new Error("PDF generation failed - possibly an HTML issue");
    case 401: // Unauthorized
    case 403: // Forbidden
      throw new Error(
        "PDF generation failed - possibly a configuration or throttle issue"
      );
    default:
      throw new Error(
        `Received status code ${response.status} from PDF generation service`
      );
  }
}

type DocRaptorRequestBody = {
  /** Your DocRaptor API key */
  user_credentials: string;
  doc: DocRaptorParameters;
};

/**
 * Here is some in-band documentation for the more common DocRaptor options.
 * There also options for JS handling, asset handling, PDF metadata, and more.
 * Note that we do not use DocRaptor's hosting; we return the PDF directly.
 * For more details see https://docraptor.com/documentation/api
 */
type DocRaptorParameters = {
  /** Test documents are watermarked, but don't count against API limits. */
  test?: boolean;
  /** We only use `pdf`. */
  type: "pdf" | "xls" | "xlsx";
  /** The HTML to render. Either this or `document_url` is required. */
  document_content?: string;
  /** The URL to fetch and render. Either this or `document_content` is required. */
  document_url?: string;
  /** Synchronous calls have a 60s limit. Callbacks are required for longer-running docs. */
  async?: false;
  /** This name will show up in the logs: https://docraptor.com/doc_logs */
  name?: string;
  /** This tag will also show up in DocRaptor's logs. */
  tag?: string;
  /** Should DocRaptor run JS embedded in your HTML? Default is `false`. */
  javascript?: boolean;
  prince_options: {
    /**
     * In theory we can choose a different PDF version, but UA-1 is the only accessible one.
     * https://docraptor.com/documentation/article/6637003-accessible-tagged-pdfs
     */
    profile: "PDF/UA-1";
    /** The default is `print`. */
    media?: "print" | "screen";
    /** May be needed to load relative urls. Alternatively, use the `<base>` tag. */
    baseurl?: string;
    /** The title of your PDF. By default this is the `<title>` of your HTML. */
    pdf_title?: string;
    /** This may be used to override the default DPI of `96`. */
    css_dpi?: number;
  };
};
