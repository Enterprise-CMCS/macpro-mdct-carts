import handler from "../../libs/handler-lib";
import s3 from "../../libs/s3-lib";
import { ReportPdfs } from "../../types";

export const getFiscalYearTemplateLink = handler(async (event, _context) => {
  if (!event.pathParameters) throw new Error("No Path Parameters Object");
  if (!event.pathParameters.year) {
    throw new Error("Be sure to include year in the path");
  }

  const { year } = event.pathParameters;

  const filename = ReportPdfs[year];
  const url = await s3.getSignedDownloadUrl(
    {
      Bucket:
        process.env.fiscalYearTemplateS3BucketName ??
        "local-fiscal-year-template",
      Key: filename,
      ResponseContentDisposition: `attachment; filename = ${filename}`,
    },
    true
  );
  return {
    psurl: url,
  };
});
