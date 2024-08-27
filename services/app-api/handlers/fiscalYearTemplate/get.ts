import handler from "../../libs/handler-lib";
import s3 from "../../libs/s3-lib";
import { ReportPdfs } from "../../types";

export const getFiscalYearTemplateLink = handler(async (_context) => {
  const filename = ReportPdfs[2024];
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
