import handler from "../../libs/handler-lib";
import s3 from "../../libs/s3-lib";

export const getFiscalYearTemplateLink = handler(async (_context) => {
  const url = s3.getSignedUrl("getObject", {
    Bucket: process.env.S3_ATTACHMENTS_BUCKET_NAME ?? "local-uploads",
    Key: "FFY_2021_CARTS_Template.pdf",
    Expires: 3600,
  });
  return {
    psurl: url,
  };
});
