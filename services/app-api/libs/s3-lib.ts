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

const localConfig = {
  endpoint: process.env.S3_LOCAL_ENDPOINT,
  region: "localhost",
  forcePathStyle: true,
  credentials: {
    accessKeyId: "S3RVER", // pragma: allowlist secret
    secretAccessKey: "S3RVER", // pragma: allowlist secret
  },
};

const awsConfig = {
  region: "us-east-1",
};

export const getConfig = () => {
  return process.env.S3_LOCAL_ENDPOINT ? localConfig : awsConfig;
};
const client = new S3Client(getConfig());

export default {
  deleteObject: (params: DeleteObjectRequest) =>
    client.send(new DeleteObjectCommand(params)),

  createPresignedPost: (params: PutObjectRequest) =>
    getSignedUrl(client, new PutObjectCommand(params), { expiresIn: 600 }),

  getSignedDownloadUrl: (params: GetObjectRequest, forcedAws = false) => {
    let myClient = forcedAws ? new S3Client(awsConfig) : client;
    return getSignedUrl(myClient, new GetObjectCommand(params), {
      expiresIn: 3600,
    });
  },
};
