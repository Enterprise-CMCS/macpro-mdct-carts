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

export const awsConfig = {
  region: "us-east-1",
  logger,
  endpoint: process.env.AWS_ENDPOINT_URL,
  forcePathStyle: true,
};

const client = new S3Client(awsConfig);

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
