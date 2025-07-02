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
import { isLocalStack } from "./localstack";

const BASE_CONFIG = {
  region: "us-east-1",
  logger,
};

export const getConfig = () => {
  if (isLocalStack()) {
    return {
      endpoint: process.env.AWS_ENDPOINT_URL,
      forcePathStyle: !!process.env.AWS_ENDPOINT_URL,
      ...BASE_CONFIG,
    };
  }
  return BASE_CONFIG;
};

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
