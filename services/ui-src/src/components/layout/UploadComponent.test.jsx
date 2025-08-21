import React from "react";
import { screen, render, within } from "@testing-library/react";
import userEventLib from "@testing-library/user-event";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import UploadComponent from "./UploadComponent";
import { AppRoles, REPORT_STATUS } from "../../types";
import fileApi from "../../util/fileApi";

/**
 * When applyAccept is true, `user-event` will refuse to upload files whose
 * extensions do not match the `accept` property of the file input.
 * We will be testing files both good and bad, so we need to override this.
 */
const userEvent = userEventLib.setup({ applyAccept: false });

jest.mock("../../util/fileApi", () => ({
  recordFileInDatabaseAndGetUploadUrl: jest.fn(),
  uploadFileToS3: jest.fn(),
  getFileDownloadUrl: jest.fn(),
  getUploadedFiles: jest.fn(),
  deleteUploadedFile: jest.fn(),
}));

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

describe.skip("<UploadComponent />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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

    expect(fileApi.recordFileInDatabaseAndGetUploadUrl).toBeCalled();
    expect(fileApi.uploadFileToS3).toBeCalled();
  });

  test("Should upload multiple files to the DB and S3", async () => {
    render(TestUploadComponent);

    const input = getUploadInput();
    await userEvent.upload(input, [mockJpg, mockPng, mockPdf]);

    const uploadButton = screen.getByText("Upload");
    await userEvent.click(uploadButton);

    expect(fileApi.recordFileInDatabaseAndGetUploadUrl).toBeCalledTimes(3);
    expect(fileApi.uploadFileToS3).toBeCalledTimes(3);
  });

  /**
   * This test fails completely.
   * The UploadComponent error handling is not great.
   */
  test.skip("Should fail gracefully when S3 returns an error", async () => {
    render(TestUploadComponent);
    fileApi.uploadFileToS3.mockImplementationOnce(() => {
      throw new Error("Upload failed");
    });

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
    fileApi.getUploadedFiles.mockReturnValue([
      {
        filename: "previousUpload.xls",
      },
    ]);

    render(TestUploadComponent);

    expect(await screen.findByText("previousUpload.xls")).toBeInTheDocument();
  });

  test("Should display files after uploading them", async () => {
    fileApi.recordFileInDatabaseAndGetUploadUrl.mockImplementation(
      (_year, _stateCode, _questionId, file) => {
        fileApi.getUploadedFiles.mockImplementation(() => {
          return [
            {
              filename: file.name,
            },
          ];
        });
      }
    );

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
    fileApi.getUploadedFiles.mockReturnValue([
      {
        filename: "previousUpload.xls",
      },
    ]);

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
    expect(fileApi.recordFileInDatabaseAndGetUploadUrl).toBeCalledTimes(2);
    expect(fileApi.recordFileInDatabaseAndGetUploadUrl).toBeCalledWith(
      "2023",
      "AL",
      "mock-question-1",
      mockJpg
    );
    expect(fileApi.recordFileInDatabaseAndGetUploadUrl).toBeCalledWith(
      "2023",
      "AL",
      "mock-question-1",
      mockPdf
    );
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

    fileApi.getUploadedFiles.mockReturnValue([
      {
        filename: "previousUpload.xls",
      },
    ]);
    fileApi.getFileDownloadUrl.mockReturnValue("my/s3/path/1");

    render(TestUploadComponent);

    const downloadButton = await screen.findByText("Download");
    await userEvent.click(downloadButton);

    expect(window.location.href).toBe("my/s3/path/1");

    window.location = originalLocation;
  });

  test("Should allow users to delete previously-uploaded files", async () => {
    fileApi.getUploadedFiles.mockReturnValue([
      {
        filename: "previousUpload.xls",
      },
    ]);

    render(TestUploadComponent);

    const deleteButton = await screen.findByText("Delete");
    await userEvent.click(deleteButton);

    expect(fileApi.deleteUploadedFile).toBeCalled();
  });

  test.skip("Should not allow admin users to upload files", () => {
    throw new Error("Someone should probably write this test.");
  });

  test.skip("Should not allow uploads to certified reports", () => {
    throw new Error("Someone should probably write this test.");
  });
});
