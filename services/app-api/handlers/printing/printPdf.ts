import handler from "../../libs/handler-lib";
import { SignatureV4 } from "@smithy/signature-v4";
import { Sha256 } from "@aws-crypto/sha256-js";
import { fetch } from "cross-fetch"; // TODO delete this line and uninstall this package, once CARTS is running on Nodejs 18+

/**
 * Generates 508 compliant PDF using the external Prince service for a given HTML block.
 */
export const print = handler(async (event, _context) => {
  const body = event.body ? JSON.parse(event.body) : null;
  const encodedHtml = body?.encodedHtml;
  if (!encodedHtml) {
    throw new Error("Missing required encodedHtml");
  }

  const {
    princeApiHost: hostname, // JUST the host name, no protocol, ex: "my-site.cms.gov"
    princeApiPath: path, // Needs leading slash, ex: "/doc-conv/508html-to-508pdf"
    AWS_ACCESS_KEY_ID: accessKeyId,
    AWS_SECRET_ACCESS_KEY: secretAccessKey,
    AWS_SESSION_TOKEN: sessionToken,
  } = process.env;

  if (
    accessKeyId === undefined ||
    secretAccessKey === undefined ||
    sessionToken === undefined ||
    hostname === undefined ||
    path === undefined
  ) {
    throw new Error("No config found to make request to PDF API");
  }

  const request = {
    method: "POST",
    protocol: "https",
    hostname,
    path,
    headers: {
      host: hostname, // Prince requires this to be signed
    },
    body: encodedHtml,
  };

  const signer = new SignatureV4({
    service: "execute-api",
    region: "us-east-1",
    credentials: { accessKeyId, secretAccessKey, sessionToken },
    sha256: Sha256,
  });

  const signedRequest = await signer.sign(request);

  const response = await fetch(`https://${hostname}${path}`, signedRequest);

  const base64EncodedPdfData = await response.json();

  return { data: base64EncodedPdfData };
});
