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

jest.mock("../hooks/authHooks/requestOptions", () => async (body) => ({
  body,
}));

const mockFile = new File(["0xMockDataLOL"], "test.jpg", { type: "image/jpg" });

describe("File API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("recordFileInDatabaseAndGetUploadUrl should post to CARTS API and return a signed URL", async () => {
    apiLib.post.mockReturnValue({
      psurl: "https://mock.url",
      psdata: { "X-Amz-Signature": "secret" },
    });

    const result = await recordFileInDatabaseAndGetUploadUrl(
      "2023",
      "AL",
      "mock-question-id",
      mockFile
    );

    expect(result).toEqual({
      url: "https://mock.url",
      fields: { "X-Amz-Signature": "secret" },
    });

    expect(apiLib.post).toBeCalledWith("carts-api", "/psUrlUpload/2023/AL", {
      body: {
        uploadedFileName: "test.jpg",
        uploadedFileType: "image/jpg",
        questionId: "mock-question-id",
      },
    });
  });

  test("uploadFileToS3 should submit a POST request to the given URL", async () => {
    const mockPostData = {
      url: "mock.s3/url",
      fields: {
        signature: "secret",
      },
    };
    const mockXhr = {
      open: jest.fn(),
      send: jest.fn(() => {
        mockXhr.status = 204;
        mockXhr.response = "yay";
        mockXhr.onload();
      }),
    };
    jest.spyOn(window, "XMLHttpRequest").mockImplementation(() => mockXhr);

    const result = await uploadFileToS3(mockPostData, mockFile);

    expect(result).toBe("Resolved: yay");
    expect(mockXhr.open).toBeCalledWith("POST", "mock.s3/url", true);
    expect(mockXhr.send).toBeCalled();

    const formData = mockXhr.send.mock.calls[0][0];
    expect(formData.get("signature")).toBe("secret");
    expect(formData.get("file").name).toBe(mockFile.name);
  });

  test("getFileDownloadUrl should post to the CARTS api and return a URL", async () => {
    apiLib.post.mockReturnValue({ psurl: "mock.s3/url" });

    const result = await getFileDownloadUrl("2023", "AL", "mock-file-id");

    expect(result).toBe("mock.s3/url");
    expect(apiLib.post).toBeCalledWith("carts-api", "/psUrlDownload/2023/AL", {
      body: { fileId: "mock-file-id" },
    });
  });

  test("getUploadedFiles should post to the CARTS API and return the list of files", async () => {
    apiLib.post.mockReturnValue(Promise.resolve([mockFile]));

    const result = await getUploadedFiles("2023", "AL", "mock-question-id");

    expect(apiLib.post).toBeCalledWith("carts-api", "/uploads/2023/AL", {
      body: { stateCode: "AL", questionId: "mock-question-id" },
    });
    expect(result.length).toBe(1);
    expect(result[0]).toBe(mockFile);
  });

  test("getUploadedFiles should post to the CARTS API and return an empty list of files if the result is falsey somehow", async () => {
    apiLib.post.mockReturnValue(Promise.resolve(undefined));

    const result = await getUploadedFiles("2023", "AL", "mock-question-id");

    expect(apiLib.post).toBeCalledWith("carts-api", "/uploads/2023/AL", {
      body: { stateCode: "AL", questionId: "mock-question-id" },
    });
    expect(result.length).toBe(0);
  });

  test("deleteUploadedFile should call the CARTS API", async () => {
    apiLib.del.mockReturnValue(Promise.resolve());

    await deleteUploadedFile("2023", "AL", "mock-file-id");

    expect(apiLib.del).toBeCalledWith("carts-api", "/uploads/2023/AL", {
      body: { fileId: "mock-file-id" },
    });
  });
});
