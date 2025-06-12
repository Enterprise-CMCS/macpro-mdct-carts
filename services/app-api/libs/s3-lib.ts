import {
  S3Client,
  DeleteObjectRequest,
  DeleteObjectCommand,
  PutObjectRequest,
  PutObjectCommand,
  GetObjectRequest,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { logger } from "./debug-lib";

export const getConfig = () => {
  return {
    // THIS CONFIG MUST KNOW DEV CREDENTIALS TO BE ABLE TO HIT REAL S3 we think...
    region: "us-east-1",
    logger,
  };
};

// have addtional config if needed for localstack? with isLocalStack

const client = new S3Client(getConfig());

export default {
  deleteObject: (params: DeleteObjectRequest) =>
    client.send(new DeleteObjectCommand(params)),

  createPresignedPost: (params: PutObjectRequest) =>
    getSignedUrl(client, new PutObjectCommand(params), { expiresIn: 600 }),

  getSignedDownloadUrl: (params: GetObjectRequest) => {
    return getSignedUrl(client, new GetObjectCommand(params), {
      expiresIn: 3600,
    });
  },
};
