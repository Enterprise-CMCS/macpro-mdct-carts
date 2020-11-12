import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, TextField } from "@cmsgov/design-system-core";
import axios    from "../../authenticatedAxios";
import { withOktaAuth }      from "@okta/okta-react";
import { setAnswerEntry } from "../../actions/initial";

class UploadComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      blockFileSubmission: true,
      loadedFiles: [],
    };
  }

  componentDidMount() {
    this.validateFileByExtension = this.validateFileByExtension.bind(this);
    this.removeFile = this.removeFile.bind(this);
    this.submitUpload = this.submitUpload.bind(this);
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
  };

  async submitUpload() {
    const { loadedFiles } = this.state;
    const fileFormData = new FormData();

    // *** traverse loaded files and append to form data
    for (const file of loadedFiles) {
      fileFormData.append(file.name, file);
    }
    alert('getting ready to upload')

    // *** obtain signed URL
    const response = await axios.post(
      `${window.env.API_POSTGRES_URL}/api/v1/psurl_upload`,
      {
        "some_value": "hey hey"
      }
    );

    const signedURL = response.data.url;

    // eslint-disable-next-line no-console
    console.log(`!*********generated signed url ${signedURL}`);

    return signedURL;
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

      // !! The reason we're  not using file.type, the results are inconsistent and irregular.
      // slicing off the extension name is more succinct

      // Results from file.type
      // PDF: "application/pdf"
      // JPEG: "image/jpeg"
      // PNG: "image/png"
      // Microsoft word document: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      // Spreadsheet: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
    }
  }

  render() {
    return (
      <div>
        <div>
          <TextField
            accept=".jpg, .png, .docx, .doc, .pdf, .xlsx, .xls, .xlsm"
            className="file_upload"
            /* eslint-disable-next-line react/destructuring-assignment */
            errorMessage={this.state.inputErrors}
            hint=" Files must be in one of these formats: PDF, Word, Excel, or a valid image (jpg or png)"
            label=""
            multiple
            /* eslint-disable-next-line react/prop-types,react/destructuring-assignment */
            name={this.props.question.id}
            onChange={this.validateFileByExtension}
            type="file"
          />
        </div>

        {/* eslint-disable-next-line react/destructuring-assignment */}
        {this.state.loadedFiles // Display the files that have been uploaded
          ? // eslint-disable-next-line react/destructuring-assignment
            this.state.loadedFiles.map((element) => (
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
          /* eslint-disable-next-line react/destructuring-assignment */
          disabled={this.state.blockFileSubmission}
        >
          Upload
        </Button>
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

export default withOktaAuth(
  connect(mapStateToProps, mapDispatchToProps)(UploadComponent)
);

// associate with US State
// meets file validation requirements ( #517 )
// for audit purposes, save name of user who is saving the file.
// save to server
// provide user with status updates - at a minimum "uploading..." and "upload complete".
// display spinner until file upload is complete (see below for design)
// provide user with notice if there is an error.
