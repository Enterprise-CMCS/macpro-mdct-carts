import { apiLib } from "./apiLib";
import {
  recordFileInDatabaseAndGetUploadUrl,
  uploadFileToS3,
  getFileDownloadUrl,
  getUploadedFiles,
  deleteUploadedFile,
} from "./fileApi";

jest.mock("./apiLib", () => ({
  apiLib: {
    post: jest.fn(),
    put: jest.fn(),
    get: jest.fn(),
    del: jest.fn(),
  },
}));

const mockFile = new File(["0xMockDataLOL"], "test.jpg", { type: "image/jpg" });

describe("File API", () => {
  let originalFetch;
  beforeAll(() => {
    originalFetch = window.fetch;
    window.fetch = jest.fn().mockResolvedValue("200 or whatever");
  });
  afterAll(() => {
    window.fetch = originalFetch;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("recordFileInDatabaseAndGetUploadUrl should post to CARTS API and return a signed URL", async () => {
    await apiLib.post.mockReturnValue({ psurl: "https://mock.url" });

    const result = await recordFileInDatabaseAndGetUploadUrl(
      "2023",
      "AL",
      "mock-question-id",
      mockFile
    );

    expect(result).toEqual({ presignedUploadUrl: "https://mock.url" });

    expect(await apiLib.post).toBeCalledWith("/psUrlUpload/2023/AL", {
      body: {
        uploadedFileName: "test.jpg",
        uploadedFileType: "image/jpg",
        questionId: "mock-question-id",
      },
    });
  });

  test("uploadFileToS3 should submit a PUT request to the given URL", async () => {
    const mockPostData = { presignedUploadUrl: "mock.s3/url" };

    const result = await uploadFileToS3(mockPostData, mockFile);

    expect(result).toBe("200 or whatever");
    const [url, options] = window.fetch.mock.calls[0];
    expect(url).toBe("mock.s3/url");
    expect(options).toHaveProperty("method", "PUT");
    expect(options).toHaveProperty("body");
    expect(options.body).toHaveProperty("name", mockFile.name);
  });

  test("getFileDownloadUrl should post to the CARTS api and return a URL", async () => {
    await apiLib.post.mockReturnValue({ psurl: "mock.s3/url" });

    const result = await getFileDownloadUrl("2023", "AL", "mock-file-id");

    expect(result).toBe("mock.s3/url");
    expect(await apiLib.post).toBeCalledWith("/psUrlDownload/2023/AL", {
      body: { fileId: "mock-file-id" },
    });
  });

  test("getUploadedFiles should post to the CARTS API and return the list of files", async () => {
    await apiLib.post.mockReturnValue(Promise.resolve([mockFile]));

    const result = await getUploadedFiles("2023", "AL", "mock-question-id");

    expect(await apiLib.post).toBeCalledWith("/uploads/2023/AL", {
      body: { stateCode: "AL", questionId: "mock-question-id" },
    });
    expect(result.length).toBe(1);
    expect(result[0]).toBe(mockFile);
  });

  test("getUploadedFiles should post to the CARTS API and return an empty list of files if the result is falsey somehow", async () => {
    await apiLib.post.mockReturnValue(Promise.resolve(undefined));

    const result = await getUploadedFiles("2023", "AL", "mock-question-id");

    expect(await apiLib.post).toBeCalledWith("/uploads/2023/AL", {
      body: { stateCode: "AL", questionId: "mock-question-id" },
    });
    expect(result.length).toBe(0);
  });

  test("deleteUploadedFile should call the CARTS API", async () => {
    await apiLib.del.mockReturnValue(Promise.resolve());

    await deleteUploadedFile("2023", "AL", "mock-file-id");

    expect(await apiLib.del).toBeCalledWith("/uploads/2023/AL/mock-file-id");
  });
});
