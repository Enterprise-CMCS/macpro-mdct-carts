import handler from "../../libs/handler-lib";
import s3 from "../../libs/s3-lib";

export const getFiscalYearTemplateLink = handler(async (_context) => {
  const url = s3.getSignedUrl(
    "getObject",
    {
      Bucket:
        process.env.fiscalYearTemplateS3BucketName ??
        "local-fiscal-year-template",
      Key: "FFY_2021_CARTS_Template.pdf",
      ResponseContentDisposition: `attachment; filename = FFY_2021_CARTS_Template.pdf`,
      Expires: 3600,
    },
    true
  );
  return {
    psurl: url,
  };
});
