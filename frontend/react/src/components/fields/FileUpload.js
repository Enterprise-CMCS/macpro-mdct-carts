import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { Text } from "./Text";

// Eat the incoming onChange event because for file uploads, we need to
// handle them a little differently.
const FileUpload = ({ onChange, ...props }) => {
  const upload = useCallback(() => {
    // Here's where we'd actually handle the upload.
  }, []);

  return <Text {...props} multiple onChange={upload} type="file" />;
};
FileUpload.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export { FileUpload };
export default FileUpload;
