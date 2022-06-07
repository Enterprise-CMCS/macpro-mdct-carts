import handler from "../../libs/handler-lib";
import { NotFoundError } from "../../libs/httpErrors";
import axios from "axios";
import AWS from "aws-sdk";

/**
 * Generates 508 compliant PDF using the external Prince service for a given HTML block.
 */
// eslint-disable-next-line no-unused-vars
export const print = handler(async (event, _context) => {
  const body = event.body ? JSON.parse(event.body) : null;
  if (!body || !body.encodedHtml) {
    throw new NotFoundError("Unable to find info");
  }

  // Build Request -> Prince
  const host = "macpro-platform-dev.cms.gov";
  const path = "/doc-conv/508html-to-508pdf";
  const region = "us-east-1";
  AWS.config.update({
    region,
    credentials: new AWS.Credentials(
      process.env.AWS_ACCESS_KEY_ID,
      process.env.AWS_SECRET_ACCESS_KEY,
      process.env.AWS_SESSION_TOKEN
    ),
  });
  const aws4 = require("aws4");

  var opts = {
    host,
    path,
    method: "POST",
    url: `https://${host}${path}`,
    region,
    service: "execute-api",
    data: body.encodedHtml, // aws4 looks for body; axios for data
    body: body.encodedHtml,
    headers: {
      "content-type": "application/json",
    },
  };

  // Sign auth, and massage the format for axios
  const credentials = AWS.config.credentials;
  var signedRequest = aws4.sign(opts, {
    secretAccessKey: credentials.secretAccessKey,
    accessKeyId: credentials.accessKeyId,
    sessionToken: credentials.sessionToken,
  });
  delete signedRequest.headers["Host"];
  delete signedRequest.headers["Content-Length"];

  // Execute
  let response = await axios(signedRequest);
  return response;
});
