import handler from "../../libs/handler-lib";
import s3 from "../../libs/s3-lib";
import { ReportPdfs } from "../../types";

export const getFiscalYearTemplateLink = handler(async (_context) => {
  const filename = ReportPdfs[2023];
  const url = s3.getSignedUrl(
    "getObject",
    {
      Bucket:
        process.env.fiscalYearTemplateS3BucketName ??
        "local-fiscal-year-template",
      Key: filename,
      ResponseContentDisposition: `attachment; filename = ${filename}`,
      Expires: 3600,
    },
    true
  );
  return {
    psurl: url,
  };
});
