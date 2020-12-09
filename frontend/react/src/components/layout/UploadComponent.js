import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Button, TextField } from "@cmsgov/design-system-core";
import axios from "../../authenticatedAxios";

import { setAnswerEntry } from "../../actions/initial";

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

  componentDidMount = () => {
    this.validateFileByExtension = this.validateFileByExtension.bind(this);
    this.removeFile = this.removeFile.bind(this);
    this.submitUpload = this.submitUpload.bind(this);
    this.viewUploaded = this.viewUploaded.bind(this);
    this.isFileTypeAllowed = this.isFileTypeAllowed.bind(this);
    this.deleteFile = this.deleteFile.bind(this);
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

  submitUpload = async () => {
    const { loadedFiles } = this.state;
    const questionId = this.props.question.id;

    for (const uploadedFile of loadedFiles) {
      // *** obtain signed URL
      const response = await axios.post(
        `${window.env.API_POSTGRES_URL}/api/v1/psurl_upload`,
        {
          uploadedFileName: uploadedFile.name,
          uploadedFileType: uploadedFile.type,
          questionId,
        }
      );

      const { psurl, psdata } = response.data;

      const presignedPostData = {
        url: psurl,
        fields: psdata,
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

  downloadFile = async (filename, awsFilename) => {
    const response = await axios.post(
      `${window.env.API_POSTGRES_URL}/api/v1/psurl_download`,
      {
        filename,
        awsFilename,
      }
    );

    const { psurl } = response["data"];
    window.location.href = psurl;
  };

  retrieveUploadedFiles = async () => {
    const questionId = this.props.question.id;

    this.setState({
      uploadedFilesRetrieved: false,
    });

    const response = await axios
      .post(`${window.env.API_POSTGRES_URL}/api/v1/view_uploaded`, {
        questionId,
      })
      .catch((error) => {
        console.log("!!!Error downloading files: ", error);
      });

    // *** hide the loading preloader
    this.setState({
      uploadedFilesRetrieved: true,
      uploadedFiles: response.data["uploaded_files"],
    });
  };

  deleteFile = async (awsFilename) => {
    // *** retrieve files
    await axios
      .post(`${window.env.API_POSTGRES_URL}/api/v1/remove_uploaded`, {
        awsFilename,
      })
      .catch((error) => {
        console.log("!!!Error retrieving files: ", error);
      });

    await this.retrieveUploadedFiles();
  };

  // TODO: when one file errors, the others are loaded but the error stays
  // to duplicate: try loading all 9
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

        if (fileTypeAllowed === true) {
          if (mediaSize <= maxFileSize) {
            filePayload.push(file);
          } else {
            errorString = errorString.concat(
              `${uploadName} exceeds ${maxFileSize}MB file size maximum`
            );
          }
        } else {
          errorString = errorString.concat(
            `${uploadName} is not an approved file type`
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
        // eslint-disable-next-line react/prop-types
        const { setAnswer } = this.props;
        setAnswer(event.target.name, filePayload);
      }
    }
  };

  render() {
    return (
      <div>
        <div>
          <TextField
            accept=".jpg, .png, .docx, .doc, .pdf, .xlsx, .xls, .xlsm"
            className="file_upload"
            errorMessage={this.state.inputErrors}
            hint="Files must be in one of these formats: PDF, Word, Excel, or a valid image (jpg or png)"
            label=""
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
          disabled={this.state.blockFileSubmission}
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

        {this.state.displayUploadedFiles ? (
          <table key={"uploadedFilesContainer"}>
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
                  const fileObj = JSON.parse(file.replace(/'/gi, '"'));

                  return (
                    <tr key={fileObj.aws_filename}>
                      <td>{fileObj.filename}</td>
                      <td>
                        <Button
                          size="small"
                          onClick={() =>
                            this.downloadFile(
                              fileObj.filename,
                              fileObj.aws_filename
                            )
                          }
                        >
                          Download
                        </Button>
                      </td>
                      <td>
                        <Button
                          size="small"
                          onClick={() => this.deleteFile(fileObj.aws_filename)}
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
});

const mapDispatchToProps = {
  setAnswer: setAnswerEntry,
};

export default connect(mapStateToProps, mapDispatchToProps)(UploadComponent);

// associate with US State
// meets file validation requirements ( #517 )
// for audit purposes, save name of user who is saving the file.
// save to server
// provide user with status updates - at a minimum "uploading..." and "upload complete".
// display spinner until file upload is complete (see below for design)
// provide user with notice if there is an error.
