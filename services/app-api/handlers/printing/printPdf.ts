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

  // region,
  var opts = {
    method: "POST",
    url: "https://macpro-platform-dev.cms.gov/doc-conv/508html-to-508pdf/", // Note the trailing slash
    host: "macpro-platform-dev.cms.gov",
    path: "/doc-conv/508html-to-508pdf/",
    region: "us-east-1",
    service: "execute-api",
    data: body.encodedHtml, // aws4 looks for body; axios for data
    body: body.encodedHtml,
  };

  // Sign auth, and massage the format for axios
  const credentials = AWS.config.credentials;
  var signedRequest = aws4.sign(opts, {
    secretAccessKey: credentials.secretAccessKey,
    accessKeyId: credentials.accessKeyId,
    sessionToken: credentials.sessionToken,
  });
  // delete signedRequest.headers["Host"];

  // Execute
  let response = await axios(signedRequest);
  return response;
});
