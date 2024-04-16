import s3Lib, { getConfig } from "../s3-lib";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { mockClient } from "aws-sdk-client-mock";

const s3ClientMock = mockClient(S3Client);

jest.mock("@aws-sdk/s3-request-presigner", () => ({
  getSignedUrl: jest.fn().mockResolvedValue("mock signed url"),
}));

describe("S3 Library", () => {
  let originalEndpoint: string | undefined;
  beforeAll(() => {
    originalEndpoint = process.env.S3_LOCAL_ENDPOINT;
  });
  afterAll(() => {
    process.env.S3_LOCAL_ENDPOINT = originalEndpoint;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    s3ClientMock.reset();
  });

  test("Can delete object", async () => {
    const mockDelete = jest.fn();
    s3ClientMock.on(DeleteObjectCommand).callsFake(mockDelete);

    await s3Lib.deleteObject({ Bucket: "b", Key: "k" });

    expect(mockDelete).toHaveBeenCalled();
  });

  test("Can create presigned upload URL", async () => {
    const url = await s3Lib.createPresignedPost({ Bucket: "b", Key: "k" });

    expect(url).toBe("mock signed url");
    // eslint-disable-next-line no-unused-vars
    const [_client, command, _options] = (getSignedUrl as jest.Mock).mock
      .calls[0];
    expect(command).toBeInstanceOf(PutObjectCommand);
  });

  test("Can create presigned download URL", async () => {
    process.env.S3_LOCAL_ENDPOINT = "mock endpoint";
    const url = await s3Lib.getSignedDownloadUrl({ Bucket: "b", Key: "k" });

    expect(url).toBe("mock signed url");
    // eslint-disable-next-line no-unused-vars
    const [_client, command, _options] = (getSignedUrl as jest.Mock).mock
      .calls[0];
    expect(command).toBeInstanceOf(GetObjectCommand);
  });

  test("Gives live AWS download URLs if requested", async () => {
    process.env.S3_LOCAL_ENDPOINT = "mock endpoint";
    expect(getConfig()).toHaveProperty("region", "localhost");

    const url = await s3Lib.getSignedDownloadUrl(
      { Bucket: "b", Key: "k" },
      true
    );

    expect(url).toBe("mock signed url");
    // eslint-disable-next-line no-unused-vars
    const [client, command, _options] = (getSignedUrl as jest.Mock).mock
      .calls[0];
    expect(await client.config.region()).toBe("us-east-1");
    expect(command).toBeInstanceOf(GetObjectCommand);
  });

  test("Uses local config when appropriate", () => {
    process.env.S3_LOCAL_ENDPOINT = "mock endpoint";
    const config = getConfig();
    expect(config).toHaveProperty("region", "localhost");
  });

  test("Uses AWS config when appropriate", () => {
    delete process.env.S3_LOCAL_ENDPOINT;
    const config = getConfig();
    expect(config).toHaveProperty("region", "us-east-1");
  });
});
