import React from "react";
import { screen, render } from "@testing-library/react";
import userEventLib from "@testing-library/user-event";
import { within } from "@testing-library/dom";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import { updateTimeout } from "../../hooks/authHooks";
import UploadComponent from "./UploadComponent";
import { AppRoles, REPORT_STATUS } from "../../types";

// TODO remove direct dependency on @testing-library/dom ?

/**
 * When applyAccept is true, `user-event` will refuse to upload files whose
 * extensions do not match the `accept` property of the file input.
 * We will be testing files both good and bad, so we need to override this.
 */
const userEvent = userEventLib.setup({ applyAccept: false });

const mockApi = {
  reset() {
    this.uploadedFileList = [];
    this.currentFileId = 0;
  },
  uploadedFileList: [],
  currentFileId: 0,
  generateId() {
    this.currentFileId += 1;
    return this.currentFileId;
  },
  getUploadUrl: jest.fn().mockImplementation((requestBody) => {
    const { uploadedFileName, uploadedFileType, questionId } = requestBody;
    expect(uploadedFileType).toBeTruthy();
    mockApi.uploadedFileList.push({
      aws_filename: `${questionId}-${uploadedFileName}`,
      filename: uploadedFileName,
      fileId: mockApi.generateId(),
    });
    return Promise.resolve({
      psurl: `my/s3/path/${questionId}-${uploadedFileName}`,
      psdata: { "X-Amz-Signature": "secret" },
    });
  }),
  getDownloadUrl: jest.fn().mockImplementation((requestBody) => {
    const { fileId } = requestBody;
    return Promise.resolve({
      psurl: `my/s3/path/${fileId}`,
    });
  }),
  getUploadedFiles: jest.fn().mockImplementation((requestBody) => {
    const { stateCode, questionId } = requestBody;
    expect(stateCode).toBe("AL");
    expect(questionId).toBe("mock-question-1");
    return Promise.resolve([...mockApi.uploadedFileList]);
  }),
  deleteFile: jest.fn().mockImplementation((requestBody) => {
    const { fileId } = requestBody;
    mockApi.uploadedFileList = mockApi.uploadedFileList.filter(
      (file) => file.fileId !== fileId
    );
    return Promise.resolve();
  }),
};

jest.mock("aws-amplify", () => ({
  Auth: {
    currentSession: jest.fn().mockReturnValue({
      getIdToken: () => ({
        getJwtToken: () => {
          return "eyJhdXRoIjoidHJ1c3QgbWUgYnJvIn0="; // pragma: allowlist secret
        },
      }),
    }),
  },
  API: {
    post: jest.fn((api, url, request) => {
      expect(api).toBe("carts-api");
      const token = JSON.parse(
        Buffer.from(request.headers["x-api-key"], "base64")
      );
      expect(token.auth).toBe("trust me bro");

      switch (url) {
        case "/psUrlUpload/2023/AL":
          return mockApi.getUploadUrl(request.body);
        case "/psUrlDownload/2023/AL":
          return mockApi.getDownloadUrl(request.body);
        case "/uploads/2023/AL":
          return mockApi.getUploadedFiles(request.body);
        default:
          throw new Error(`POST URL not mocked: ${url}`);
      }
    }),
    del: jest.fn((api, url, request) => {
      expect(api).toBe("carts-api");
      const token = JSON.parse(
        Buffer.from(request.headers["x-api-key"], "base64")
      );
      expect(token.auth).toBe("trust me bro");

      switch (url) {
        case "/uploads/2023/AL":
          return mockApi.deleteFile(request.body);
        default:
          throw new Error(`DELETE URL not mocked: ${url}`);
      }
    }),
  },
}));

jest.mock("../../hooks/authHooks", () => ({
  updateTimeout: jest.fn(),
}));

const s3PostRequestMock = {
  reset() {
    this.shouldSucceed = true;
    this.status = undefined;
    this.response = undefined;
    this.responseText = undefined;
    this.onload = undefined;
  },
  open: jest.fn().mockImplementation((verb, url, isAsync) => {
    expect(verb).toBe("POST");
    expect(url).toMatch(/my\/s3\/path\/mock-question-1-.+/);
    expect(isAsync).toBe(true);
  }),
  send: jest.fn().mockImplementation((data) => {
    expect(data instanceof FormData).toBe(true);
    expect(data.get("X-Amz-Signature")).toBe("secret");
    expect(data.get("file")).not.toBeUndefined();
    expect(data.get("file").size).toBeGreaterThan(0);
    expect(data.get("file").name).toBeTruthy();
    if (s3PostRequestMock.shouldSucceed) {
      s3PostRequestMock.status = 204;
      s3PostRequestMock.response = "All good, yo";
    } else {
      s3PostRequestMock.status = 500;
      s3PostRequestMock.responseText = "That's bad, yo";
    }
    s3PostRequestMock.onload();
  }),
};

const mockStore = configureMockStore();
const store = mockStore({
  stateUser: {
    currentUser: {
      role: AppRoles.STATE_USER,
    },
    abbr: "AL",
  },
  formData: [
    {
      contents: {
        section: {
          year: "2023",
          state: "AL",
        },
      },
    },
  ],
  reportStatus: {
    AL2023: {
      status: REPORT_STATUS.in_progress,
    },
  },
});

const mockProps = {
  question: {
    id: "mock-question-1",
    label: "Attach any additional documents here",
  },
};

const mockJpg = new File(["0xMockJpgData"], "foo.jpg", { type: "image/jpg" });
const mockPng = new File(["0xMockPngData"], "bar.png", { type: "image/png" });
const mockPdf = new File(["0xPdf"], "baz.pdf", { type: "application/pdf" });
const mockBadFile = new File(["0xJpg"], "Fîlé.jpg", { type: "image/jpg" });
const mockGif = new File(["0xGif"], "bad.gif", { type: "image/gif" });
const mockBigFile = new File(["0xlol"], "big.pdf", { type: "image/jpg" });
Object.defineProperty(mockBigFile, "size", { value: 30 * 1024 * 1024 }); // 30 megabytes

const TestUploadComponent = (
  <Provider store={store}>
    <UploadComponent {...mockProps} />
  </Provider>
);

describe("UploadComponent", () => {
  jest
    .spyOn(window, "XMLHttpRequest")
    .mockImplementation(() => s3PostRequestMock);
  beforeEach(() => {
    jest.clearAllMocks();
    mockApi.reset();
    s3PostRequestMock.reset();
  });

  const seedPreviouslyUploadedFile = async () => {
    await mockApi.getUploadUrl({
      uploadedFileName: "previousUpload.xls",
      uploadedFileType: "application/vnd.ms-excel",
      questionId: "mock-question-1",
    });
  };

  const getUploadInput = () =>
    screen.getByLabelText("Click Choose Files and make your selection(s)", {
      exact: false,
    });

  test("Should render", () => {
    render(TestUploadComponent);
    const uploadField = getUploadInput();
    const uploadButtonText = screen.getByText("Upload");
    expect(uploadField).toBeInTheDocument();
    expect(uploadButtonText).toBeInTheDocument();
  });

  test("Should upload a single file to the DB and S3, resetting the session timeout", async () => {
    render(TestUploadComponent);

    // Choose a file
    const input = getUploadInput();
    await userEvent.upload(input, mockJpg);

    // Upload that file
    const uploadButton = screen.getByText("Upload");
    await userEvent.click(uploadButton);

    // The file made it to the database
    expect(mockApi.uploadedFileList.length).toBe(1);

    // The file made it to S3
    expect(s3PostRequestMock.open).toBeCalled();
    expect(s3PostRequestMock.send).toBeCalled();

    // The session timeout was updated
    expect(updateTimeout).toBeCalled();
  });

  test("Should upload multiple files to the DB and S3", async () => {
    render(TestUploadComponent);

    const input = getUploadInput();
    await userEvent.upload(input, [mockJpg, mockPng, mockPdf]);

    const uploadButton = screen.getByText("Upload");
    await userEvent.click(uploadButton);

    // The files made it to the database
    expect(mockApi.uploadedFileList.length).toBe(3);

    // The files made it to S3
    expect(s3PostRequestMock.send).toBeCalledTimes(3);
  });

  /**
   * This test fails completely.
   * The UploadComponent error handling is not great.
   */
  test.skip("Should fail gracefully when S3 returns an error", async () => {
    render(TestUploadComponent);
    s3PostRequestMock.shouldSucceed = false;

    const input = getUploadInput();
    await userEvent.upload(input, mockJpg);

    const uploadButton = screen.getByText("Upload");
    await userEvent.click(uploadButton);
  });

  test("Should display the names of selected files", async () => {
    render(TestUploadComponent);

    const input = getUploadInput();
    const files = [mockJpg, mockPng, mockPdf];
    await userEvent.upload(input, files);

    for (let file of files) {
      expect(screen.getByText(file.name)).toBeInTheDocument();
    }
  });

  test("Should show an error for a file with an invalid name", async () => {
    render(TestUploadComponent);

    const input = getUploadInput();
    await userEvent.upload(input, mockBadFile);

    expect(
      screen.queryByText(/The file name \(.*\) contains invalid characters\./)
    ).toBeInTheDocument();
    expect(screen.queryByText(mockBadFile.name)).not.toBeInTheDocument();
  });

  test("Should show an error for a file of an invalid type", async () => {
    render(TestUploadComponent);

    const input = getUploadInput();
    await userEvent.upload(input, mockGif);

    expect(
      screen.queryByText(/Your file is not an approved file type/)
    ).toBeInTheDocument();
    expect(screen.queryByText(mockGif.name)).not.toBeInTheDocument();
  });

  test("Should show an error for a file that is too large", async () => {
    render(TestUploadComponent);

    const input = getUploadInput();
    await userEvent.upload(input, mockBigFile);

    screen.debug(undefined, 1000000);

    expect(
      screen.queryByText(/exceeds .* file size maximum/)
    ).toBeInTheDocument();
    expect(screen.queryByText(mockBigFile.name)).not.toBeInTheDocument();
  });

  test("Should stage valid files and display all errors when multiple files are selected", async () => {
    render(TestUploadComponent);

    const input = getUploadInput();
    await userEvent.upload(input, [
      mockBadFile,
      mockJpg,
      mockBigFile,
      mockPng,
      mockGif,
      mockPdf,
    ]);

    expect(
      screen.queryByText(/The file name \(.*\) contains invalid characters\./)
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/exceeds .* file size maximum/)
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/Your file is not an approved file type/)
    ).toBeInTheDocument();

    for (let file of [mockJpg, mockPng, mockPdf]) {
      expect(screen.getByText(file.name)).toBeInTheDocument();
    }
  });

  test("Should display previously-uploaded files", async () => {
    await seedPreviouslyUploadedFile();

    render(TestUploadComponent);

    expect(await screen.findByText("previousUpload.xls")).toBeInTheDocument();
  });

  test("Should display files after uploading them", async () => {
    render(TestUploadComponent);

    const input = getUploadInput();
    await userEvent.upload(input, mockJpg);

    const uploadButton = screen.getByText("Upload");
    await userEvent.click(uploadButton);

    /*
     * We need to be picky here to make sure we're looking at the list of
     * uploaded files, and not just the files staged for upload.
     * The "Download" button only appears _after_ the upload completes.
     */
    await screen.findByText("Download");
    const previouslyUploadedTable = screen.getByTestId(
      "uploadedFilesContainer"
    );
    const uploadedFileName = within(previouslyUploadedTable).getByText(
      mockJpg.name
    );
    expect(uploadedFileName).toBeInTheDocument();
  });

  test("Should not display uploaded files if told not to", async () => {
    await seedPreviouslyUploadedFile();

    render(TestUploadComponent);

    const hideButton = screen.getByText("Hide Uploaded");
    await userEvent.click(hideButton);

    expect(screen.queryByText("previousUpload.xls")).not.toBeInTheDocument();
  });

  test("Should allow users to unstage selected files", async () => {
    render(TestUploadComponent);

    // Choose three files
    const input = getUploadInput();
    await userEvent.upload(input, [mockJpg, mockPng, mockPdf]);

    // Click [x] next to the second file
    const unstageButton = await screen.findByTestId("unstage-1");
    await userEvent.click(unstageButton);

    // Upload the remaining files
    const uploadButton = screen.getByText("Upload");
    await userEvent.click(uploadButton);

    // Only those files made it to the database
    const uploadedFileNames = mockApi.uploadedFileList.map((file) => file.name);
    expect(uploadedFileNames.length).toBe(2);
    expect(uploadedFileNames).not.toContain(mockPng.name);
  });

  test("Should allow users to download uploaded files", async () => {
    /*
     * Some funny business in here to test assignment to `window.location`.
     * Without this, window.location stays at "http://localhost",
     * probably due to jest dom tomfoolery.
     */
    const originalLocation = window.location;
    delete window.location;
    window.location = { href: "" };

    await seedPreviouslyUploadedFile();

    render(TestUploadComponent);

    const downloadButton = await screen.findByText("Download");
    await userEvent.click(downloadButton);

    expect(window.location.href).toBe("my/s3/path/1");

    window.location = originalLocation;
  });

  test("Should allow users to delete previously-uploaded files", async () => {
    await seedPreviouslyUploadedFile();

    render(TestUploadComponent);

    const deleteButton = await screen.findByText("Delete");
    await userEvent.click(deleteButton);

    expect(mockApi.uploadedFileList.length).toBe(0);
  });

  test.skip("Should not allow admin users to upload files", () => {
    throw new Error("Someone should probably write this test.");
  });

  test.skip("Should not allow uploads to certified reports", () => {
    throw new Error("Someone should probably write this test.");
  });
});
