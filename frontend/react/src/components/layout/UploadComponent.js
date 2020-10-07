import React, { Component } from "react";
import { connect } from "react-redux";
import { TextField, Button } from "@cmsgov/design-system-core";
import { mimeTypes, fileExtensions } from "../Utils/helperFunctions";
import { setAnswerEntry } from "../../actions/initial";

class UploadComponent extends Component {
  constructor(props) {
    super();
    this.state = {};
    this.validateFileByExtension = this.validateFileByExtension.bind(this);
    this.removeFile = this.removeFile.bind(this);
  }

  // Removes a file, but just from local state. Should include an HTTP request as well/ instead
  removeFile(evt) {
    // find it in state
    let filesInLocalState = this.state.loadedFiles;

    let filteredStateFiles = filesInLocalState.filter(
      (e) => e.name !== evt.target.name
    );

    this.setState({
      loadedFiles: filteredStateFiles,
    });

    // Will need some form of put/delete request to remove the deleted files
  }

  // TODO: when one file errors, the others are loaded but the error stays
  // to duplicate: try loading all 9

  validateFileByExtension(event) {
    if (event.target.files.length !== 0) {
      let filesArray = event.target.files; // All files selected by a user
      let filePayload = [];
      let errorString = "";

      for (let i = 0; i < filesArray.length; i++) {
        let singleFile = filesArray[i];
        let uploadName = singleFile.name;
        let mediaSize = singleFile.size / 1024 / 1024; // Converting bytes to MB, roughly

        let mediaExtension = uploadName.split(".").slice(-1)[0]; // Grab file type from extension name
        let included = fileExtensions(mediaExtension); // Check if it is included in the list of acceptable file extensions

        if (included && mediaSize < 25) {
          // Some HTTP Request or middleware

          filePayload.push({
            name: uploadName,
            rawMediaType: singleFile.type,
            type: included ? mediaExtension : "Unknown file type",
            size: mediaSize,
            UUID: "999", // this should be some unique identifier returned from S3
          });
        }

        if (!included) {
          errorString = errorString.concat(
            `${uploadName} is not an approved file type`
          );
        }

        if (mediaSize > 25) {
          errorString = errorString.concat(
            `${uploadName} exceeds 25MB file size maximum`
          );
        }
      }

      this.setState({
        inputErrors: errorString || null,
        loadedFiles: this.state.loadedFiles
          ? [...this.state.loadedFiles, ...filePayload]
          : [...filePayload],
      });

      console.log("Formatted payload:", filePayload);

      if (errorString === "") {
        this.props.setAnswer(event.target.name, filePayload);
      }

      // !! The reason we're  not using file.type, the results are inconsistent and irregular.
      // slicing off the extension name is more succinct

      // Results from file.type
      //PDF: "application/pdf"
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
            errorMessage={this.state.inputErrors}
            hint=" Files must be in one of these formats: PDF, Word, Excel, or a valid image (jpg or png)"
            label=""
            multiple
            name={this.props.question.id}
            onChange={this.validateFileByExtension}
            type="file"
          />
        </div>

        {this.state.loadedFiles // Display the files that have been uploaded
          ? this.state.loadedFiles.map((element) => (
              <div>
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
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  USState: state.stateUser.abbr, // Currently this is meaningless dummy data
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
