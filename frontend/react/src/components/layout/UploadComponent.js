import React, { Component } from "react";
import { connect } from "react-redux";
import { TextField } from "@cmsgov/design-system-core";
import { mimeTypes } from "../Utils/helperFunctions";
import { setAnswerEntry } from "../../actions/initial";

class UploadComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //   inputErrors: "",
    };
    this.validateFile = this.validateFile.bind(this);
  }

  validateFile(event) {
    // console.log("Lets see inside", event.target.value);
    console.log("Files", event.target.files);
    let acceptableFileTypes = [
      "jpg,",
      "jpeg",
      "png",
      "docx",
      "doc",
      "pdf",
      "xltx",
      "xlsx",
      "xls",
    ];

    let filesArray = event.target.files;

    let justToConsole = [];

    // for (let i = 0; i < filesArray.length; i++) {
    let err;
    //   let singleFile = filesArray[i];
    let singleFile = event.target.files[0];
    let mediaType = singleFile.type;
    let mediaSize = singleFile.size / 1024 / 1024; // Converting bytes to MB, roughly
    let blob = singleFile.slice(0, 4);

    let filereader = new FileReader();

    filereader.onloadend = function (evt) {
      if (evt.target.readyState === FileReader.DONE) {
        const uint = new Uint8Array(evt.target.result);

        let bytes = [];

        uint.forEach((byte) => {
          bytes.push(byte.toString(16));
        });

        const hex = bytes.join("").toUpperCase();

        justToConsole.push({
          name: singleFile.name,
          type: mediaType ? mediaType : "Unknown file type",
          binaryFileType: mimeTypes(hex),
          hex: hex,
        });
      }
    };

    filereader.readAsArrayBuffer(blob);
    // filereader.readAsArrayBuffer(blob);
    console.log("show me formatted", justToConsole);

    // Using the FileReader to read the first four byes and determine the mime of the type of file
    // More secure than the browser File API which really only reads the file extension (Which can be wrong or missing)
    // Will use 'Magic numbers'/file signatures to identify a file format or protocol

    // this.setState({
    //   selectedFiles: event.target.files,
    // });

    // TODO:
    // See issue with microsoft docs, very similar numbers but the zeros are being parsed out
    // add more numbers to the list
    // fix that weird parsing bug

    //"application/pdf"
    // "image/jpeg"
    // "image/png"
    // "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    // application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
  }

  render() {
    return (
      <div>
        <TextField
          errorMessage={this.state.inputErrors}
          accept=".jpg, .png, .docx, .doc, .pdf, .xltx, .xlsx, .xls" // AC: which excel filetypes are OK?
          className="file_upload"
          label=""
          multiple
          name={this.props.question.id}
          onChange={this.validateFile}
          type="file"
          value={this.props.question.answer.entry || null}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  USState: state.stateUser.abbr,
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
