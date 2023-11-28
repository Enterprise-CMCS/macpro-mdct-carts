import handler from "../../libs/handler-lib";
import axios from "axios";
import AWS from "aws-sdk";
import debug from "../../libs/debug-lib";

/**
 * Generates 508 compliant PDF using the external Prince service for a given HTML block.
 */
export const print = handler(async (event, _context) => {
  const body = event.body ? JSON.parse(event.body) : null;
  if (!body || !body.encodedHtml) {
    throw new Error("Missing required encodedHtml");
  }
  const host = process.env.princeApiHost; // JUST the host name, no protocol, ex: "my-site.cms.gov"
  const path = process.env.princeApiPath; // Needs leading and trailing slash, ex: "/doc-conv/508html-to-508pdf/"
  // Build Request -> Prince
  var opts = {
    method: "POST",
    url: `https://${host}${path}`, // Needs trailing slash from path
    host: host,
    path: path,
    region: "us-east-1",
    service: "execute-api",
    data: body.encodedHtml, // aws4 looks for body; axios for data
    body: body.encodedHtml,
  };

  // Sign auth, and massage the format for axios
  const aws4 = require("aws4");
  const credentials = AWS.config.credentials;

  debug(
    "accessKeyId: %O",
    credentials?.accessKeyId === process.env.AWS_ACCESS_KEY_ID
  );
  debug(
    "secretAccessKey: %O",
    credentials?.accessKeyId === process.env.AWS_SECRET_ACCESS_KEY
  );
  debug(
    "sessionToken: %O",
    credentials?.sessionToken === process.env.AWS_SESSION_TOKEN
  );

  if (!credentials) {
    throw new Error("No config found to make request to PDF API");
  }
  var signedRequest = aws4.sign(opts, {
    secretAccessKey: credentials.secretAccessKey,
    accessKeyId: credentials.accessKeyId,
    sessionToken: credentials.sessionToken,
  });

  delete signedRequest.body; // Remove body after signing, contained in data, don't need to duplicate it

  debug("%O", signedRequest);

  // Execute
  let response = await axios(signedRequest);

  debug("%O", response);

  return { data: response.data };
});
