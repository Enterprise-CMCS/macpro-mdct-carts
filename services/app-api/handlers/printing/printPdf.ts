import handler from "../../libs/handler-lib";
import { NotFoundError } from "../../libs/httpErrors";
/**
 * Updates the State Status associated with a given year and state
 */
// eslint-disable-next-line no-unused-vars
export const print = handler(async (event, _context) => {
  const body = event.body ? JSON.parse(event.body) : null;
  if (!body || !body.encodedHtml) {
    throw new NotFoundError("Unable to find info");
  }
  const host = "macpro-platform-dev.cms.gov";
  const path = "/doc-conv/508html-to-508pdf";
  const region = "us-east-1";
  var aws4 = require("aws4");
  var https = require("https");

  function request(opts: any) {
    https
      .request(opts, function (res: any) {
        res.pipe(process.stdout);
      })
      .end(opts.body || "");
  }

  var opts = {
    host,
    path,
    region,
    body: body.encodedHtml,
  };
  aws4.sign(opts);

  const result = request(opts);
  return result;
});
