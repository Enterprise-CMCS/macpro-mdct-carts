import React, { useCallback } from "react";
import { Text } from "./Text";

// Eat the incoming onChange event because for file uploads, we need to
// handle them a little differently.
const FileUpload = ({ onChange, ...props }) => {
  const upload = useCallback((e) => {
    console.log(e.target.name);
    console.log(e.target.files);

    // Here's where we'd actually handle the upload.
  }, []);

  return <Text {...props} multiple onChange={upload} type="file" />;
};

export { FileUpload };
