import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Button, TextField } from "@cmsgov/design-system";
import { API } from "aws-amplify";
import requestOptions from "../../hooks/authHooks/requestOptions";
import { setAnswerEntry } from "../../actions/initial";
import { REPORT_STATUS, AppRoles } from "../../types";

class UploadComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      blockFileSubmission: true,
      loadedFiles: [],
      uploadedFiles: [],
      displayUploadedFiles: false,
      uploadedFilesRetrieved: false,
    };
  }

  componentDidMount = async () => {
    this.validateFileByExtension = this.validateFileByExtension.bind(this);
    this.removeFile = this.removeFile.bind(this);
    this.submitUpload = this.submitUpload.bind(this);
    this.viewUploaded = this.viewUploaded.bind(this);
    this.isFileTypeAllowed = this.isFileTypeAllowed.bind(this);
    this.isFileNameValid = this.isFileNameValid.bind(this);
    this.deleteFile = this.deleteFile.bind(this);
    await this.viewUploaded();
  };

  isFileTypeAllowed = (extension) => {
    const allowedFileTypes = [
      "jpg",
      "jpeg",
      "png",
      "document",
      "sheet",
      "pdf",
      "docx",
      "doc",
      "xltx",
      "xlsx",
      "xls",
    ];
    return allowedFileTypes.indexOf(extension) > -1;
  };

  isFileNameValid = (fileName) => {
    let fileNameRegex = new RegExp("^[0-9a-zA-z-_.]*$");
    return fileNameRegex.test(fileName);
  };

  submitUpload = async () => {
    const { loadedFiles } = this.state;
    const { year, stateCode } = this.props;
    const questionId = this.props.question.id;

    for (const uploadedFile of loadedFiles) {
      // *** obtain signed URL
      const body = {
        uploadedFileName: uploadedFile.name,
        uploadedFileType: uploadedFile.type,
        questionId,
      };
      const opts = await requestOptions(body);
      const response = await API.post(
        "carts-api",
        `/psUrlUpload/${year}/${stateCode}`,
        opts
      );
      const presignedPostData = {
        url: response.psurl,
        fields: response.psdata,
      };

      await this.uploadFileToS3(presignedPostData, uploadedFile);

      const filteredStateFiles = loadedFiles.filter(
        (e) => e.name !== uploadedFile.name
      );

      this.setState({
        loadedFiles: filteredStateFiles,
        blockFileSubmission: true,
      });

      if (this.state.displayUploadedFiles === false) {
        return await this.viewUploaded();
      } else {
        return await this.retrieveUploadedFiles();
      }
    }
  };

  uploadFileToS3 = (presignedPostData, file) => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();

      Object.keys(presignedPostData.fields).forEach((key) => {
        formData.append(key, presignedPostData.fields[key]);
      });

      formData.append("file", file);

      const xhr = new XMLHttpRequest();
      xhr.open("POST", presignedPostData.url, true);
      xhr.send(formData);
      xhr.onload = function () {
        this.status === 204
          ? resolve(`Resolved: ${this.response}`)
          : reject(`Rejected: ${this.responseText}`);
      };
    });
  };

  viewUploaded = async () => {
    if (this.state.displayUploadedFiles === false) {
      this.setState({
        displayUploadedFiles: true,
      });
      await this.retrieveUploadedFiles();
    } else {
      // *** make sure container for files is NOT displayed
      this.setState({
        displayUploadedFiles: false,
      });
    }
  };

  removeFile = (evt) => {
    const { loadedFiles } = this.state;

    const filteredStateFiles = loadedFiles.filter(
      (e) => e.name !== evt.target.name
    );

    this.setState({
      loadedFiles: filteredStateFiles,
    });
  };

  downloadFile = async (fileId) => {
    const { year, stateCode } = this.props;
    const opts = await requestOptions({ fileId });
    const response = await API.post(
      "carts-api",
      `/psUrlDownload/${year}/${stateCode}`,
      opts
    );
    const { psurl } = response;
    window.location.href = psurl;
  };

  retrieveUploadedFiles = async () => {
    const questionId = this.props.question.id;
    const { year, stateCode } = this.props;

    this.setState({
      uploadedFilesRetrieved: false,
    });

    const body = {
      stateCode,
      questionId,
    };
    const opts = await requestOptions(body);
    const response = await API.post(
      "carts-api",
      `/uploads/${year}/${stateCode}`,
      opts
    ).catch((error) => {
      console.log("!!!Error downloading files: ", error); // eslint-disable-line no-console
    });
    const uploadedFiles = response ? response : [];
    // *** hide the loading preloader
    this.setState({
      uploadedFilesRetrieved: true,
      uploadedFiles: uploadedFiles,
    });
  };

  deleteFile = async (fileId) => {
    const { year, stateCode } = this.props;

    const opts = await requestOptions({ fileId });
    await API.del("carts-api", `/uploads/${year}/${stateCode}`, opts).catch(
      (error) => {
        console.log("!!!Error retrieving files: ", error); // eslint-disable-line no-console
      }
    );

    await this.retrieveUploadedFiles();
  };

  /*
   * TODO: when one file errors, the others are loaded but the error stays
   * to duplicate: try loading all 9
   */
  validateFileByExtension = (event) => {
    if (event.target.files.length > 0) {
      const filesArray = event.target.files; // All files selected by a user
      const filePayload = [];
      const maxFileSize = 25; // in MB

      let errorString = "";

      for (const file of filesArray) {
        const uploadName = file.name;
        const mediaSize = file.size / 1024 / 1024;
        const mediaExtension = uploadName.split(".").pop();
        const fileTypeAllowed = this.isFileTypeAllowed(mediaExtension);
        const fileNameInvalid = !this.isFileNameValid(uploadName);

        // eslint-disable-next-line
        console.log("INVALID FILENAME", fileNameValid);

        if (fileTypeAllowed === true) {
          if (mediaSize <= maxFileSize) {
            filePayload.push(file);
          } else {
            errorString = errorString.concat(
              `${uploadName} exceeds ${maxFileSize}MB file size maximum`
            );
          }
        } else if (fileNameValid === false) {
          // eslint-disable-next-line
          console.log("INVALID FILENAME");
          errorString = errorString.concat(
            `The file name (${uploadName}) contains invalid characters. Only the following characters are allowed: A-Z, a-z, 0-9, -, _, and .`
          );
        } else {
          errorString = errorString.concat(
            "Your file is not an approved file type. See below for a list of approved file types."
          );
        }
      }

      const { loadedFiles } = this.state;

      this.setState({
        inputErrors: errorString || null,
        loadedFiles: loadedFiles
          ? [...loadedFiles, ...filePayload]
          : [...filePayload],
        blockFileSubmission: false,
      });

      if (errorString === "") {
        const { setAnswer } = this.props;
        setAnswer(event.target.name, filePayload);
      }
    }
  };

  render() {
    let submissionsAllowed = false;
    const { year, stateCode, user, reportStatus } = this.props;
    if (year && stateCode) {
      const stateReportStatus = reportStatus[`${stateCode}${year}`];
      submissionsAllowed =
        stateReportStatus.status !== REPORT_STATUS.certified &&
        user.role === AppRoles.STATE_USER;
    }

    return (
      <div>
        <div>
          <TextField
            accept=".jpg, .png, .docx, .doc, .pdf, .xlsx, .xls, .xlsm"
            className="file_upload"
            disabled={!submissionsAllowed}
            errorMessage={this.state.inputErrors}
            hint="You can only upload PDF, Word, Excel, JPG or PNG files."
            label="Click Choose Files and make your selection(s) then click Upload to attach your files. Click View Uploaded to see a list of all files attached here."
            multiple
            name={this.props.question.id}
            onChange={this.validateFileByExtension}
            type="file"
          />
        </div>

        {this.state.loadedFiles
          ? this.state.loadedFiles.map((element) => (
              <div key={element.name}>
                <a href={element.name} download>
                  {" "}
                  {element.name}{" "}
                </a>
                <Button
                  name={element.name}
                  onClick={this.removeFile}
                  size="small"
                >
                  x
                </Button>
              </div>
            ))
          : null}

        <Button
          onClick={this.submitUpload}
          size="small"
          disabled={!submissionsAllowed}
          className=""
        >
          Upload
        </Button>

        <Button
          onClick={this.viewUploaded}
          size="small"
          className="margin-left-1em"
        >
          {this.state.displayUploadedFiles ? `Hide Uploaded` : `View Uploaded`}
        </Button>

        {this.state.displayUploadedFiles &&
        this.state.uploadedFiles?.length > 0 ? (
          <table
            key={"uploadedFilesContainer"}
            summary={
              this.props.question.label ||
              "This is a table for the CARTS Application"
            }
          >
            <tbody>
              {!this.state.uploadedFilesRetrieved ? (
                <tr>
                  <td>
                    <img
                      // eslint-disable-next-line
                      src={`${process.env.PUBLIC_URL}/img/bouncing_ball.gif`}
                      alt="Retrieving uploaded files... Please wait..."
                    />{" "}
                    <br />
                    <br />
                    Loading... Please wait...
                  </td>
                </tr>
              ) : (
                this.state.uploadedFiles.map((file) => {
                  return (
                    <tr key={file.aws_filename}>
                      <td>{file.filename}</td>
                      <td>
                        <Button
                          size="small"
                          onClick={() => this.downloadFile(file.fileId)}
                        >
                          Download
                        </Button>
                      </td>
                      <td>
                        <Button
                          size="small"
                          onClick={() => this.deleteFile(file.fileId)}
                          disabled={!submissionsAllowed}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        ) : null}
      </div>
    );
  }
}

UploadComponent.propTypes = {
  question: PropTypes.any,
  id: PropTypes.any,
};

const mapStateToProps = (state) => ({
  USState: state.stateUser.abbr, // Currently this is meaningless dummy data
  user: state.stateUser.currentUser,
  year: state.formData[0].contents.section.year,
  stateCode: state.formData[0].contents.section.state,
  reportStatus: state.reportStatus,
});

const mapDispatchToProps = {
  setAnswer: setAnswerEntry,
};

export default connect(mapStateToProps, mapDispatchToProps)(UploadComponent);

/*
 * associate with US State
 * meets file validation requirements ( #517 )
 * for audit purposes, save name of user who is saving the file.
 * save to server
 * provide user with status updates - at a minimum "uploading..." and "upload complete".
 * display spinner until file upload is complete (see below for design)
 * provide user with notice if there is an error.
 */
