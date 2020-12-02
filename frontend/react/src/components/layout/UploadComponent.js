import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, TextField } from "@cmsgov/design-system-core";
import axios from "../../authenticatedAxios";
import rawAxios from "axios";

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

  componentDidMount() {
    this.validateFileByExtension = this.validateFileByExtension.bind(this);
    this.removeFile = this.removeFile.bind(this);
    this.submitUpload = this.submitUpload.bind(this);
    this.viewUploaded = this.viewUploaded.bind(this);
  }

  isFileTypeAllowed(extension) {
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
  }

  async submitUpload() {
    const { loadedFiles } = this.state;
    const questionId = this.props.question.id;

    for (const uploadedFile of loadedFiles) {
      console.log("########", uploadedFile);

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

      // eslint-disable-next-line no-console
      console.log(`!*********generated: ${psurl}`);
      console.log(psdata);
      // *** dynamically generate headers
      let generatedHeaders = {};

      const formData = new FormData();
      formData.append("file", uploadedFile);

      for (const headerKey in psdata) {
        if (psdata.hasOwnProperty(headerKey)) {
          generatedHeaders[headerKey] = psdata[headerKey];
        }
      }

      console.log("parsed: ");
      console.log(generatedHeaders);

      const result = rawAxios.post(psurl, formData, {
        headers: generatedHeaders,
      });

      // eslint-disable-next-line no-console
      console.log("@@@@upload result: ", result);
    }
  }

  async viewUploaded() {
    // *** re-initialize state
    this.setState({
      uploadedFilesRetrieved: false,
    });

    if (this.state.displayUploadedFiles === false) {
      const questionId = this.props.question.id;

      // *** make sure container for files is displayed
      this.setState({
        displayUploadedFiles: true,
      });

      // *** retrieve files
      const response = await axios
        .post(`${window.env.API_POSTGRES_URL}/api/v1/view_uploaded`, {
          questionId,
        })
        .catch((error) => {
          console.log("!!!Error retrieving files: ", error);
        });

      // *** hide the loading preloader
      this.setState({
        uploadedFilesRetrieved: true,
      });

      this.setState({
        uploadedFiles: response.data["uploaded_files"],
      });
    } else {
      // *** make sure container for files is displayed
      this.setState({
        displayUploadedFiles: false,
      });
    }
  }

  removeFile(evt) {
    const { loadedFiles } = this.state;

    const filteredStateFiles = loadedFiles.filter(
      (e) => e.name !== evt.target.name
    );

    this.setState({
      loadedFiles: filteredStateFiles,
    });
  }

  // TODO: when one file errors, the others are loaded but the error stays
  // to duplicate: try loading all 9
  validateFileByExtension(event) {
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
  }

  render() {
    return (
      <div>
        <div>
          <TextField
            accept=".jpg, .png, .docx, .doc, .pdf, .xlsx, .xls, .xlsm"
            className="file_upload"
            errorMessage={this.state.inputErrors}
            hint=" Files must be in one of these formats: PDF, Word, Excel, or a valid image (jpg or png)"
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
            {!this.state.uploadedFilesRetrieved ? (
              <tr>
                <td>
                  <img
                    src={`${process.env.PUBLIC_URL}/img/bouncing_ball.gif`}
                    alt="Retrieving uploaded files... Please wait..."
                  />{" "}
                  <br />
                  <br />
                  Loading... Please wait...
                </td>
              </tr>
            ) : (
              this.state.uploadedFiles.map((filename) => {
                return (
                  <tr key={filename}>
                    <td>{filename}</td>
                    <td>
                      <Button size="small">Download</Button>
                    </td>
                    <td>
                      <Button size="small">Delete</Button>
                    </td>
                  </tr>
                );
              })
            )}
          </table>
        ) : null}
      </div>
    );
  }
}

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
