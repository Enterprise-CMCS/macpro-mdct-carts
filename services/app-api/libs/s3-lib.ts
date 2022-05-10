import AWS from "aws-sdk";
import { DeleteObjectRequest } from "aws-sdk/clients/s3";
import { ServiceConfigurationOptions } from "aws-sdk/lib/service";

export function createS3Client() {
  const s3Config: ServiceConfigurationOptions = {};
  const endpoint = process.env.S3_LOCAL_ENDPOINT;
  if (endpoint) {
    s3Config.endpoint = new AWS.Endpoint(endpoint);
    s3Config.region = "localhost";
    s3Config.s3ForcePathStyle = true;
    s3Config.accessKeyId = "S3RVER"; // pragma: allowlist secret
    s3Config.secretAccessKey = "S3RVER"; // pragma: allowlist secret
  } else {
    s3Config.region = "us-east-1";
  }
  return new AWS.S3(s3Config);
}

const client = createS3Client();

export default {
  deleteObject: (params: DeleteObjectRequest) =>
    client.deleteObject(params).promise(),
  createPresignedPost: (params: any) => client.createPresignedPost(params),
  getSignedUrl: (operation: string, params: { [key: string]: any }) =>
    client.getSignedUrl(operation, params),
};
