// This function extracts just the unique ID
// from all objectives & goals, stopping at the underscore

const sliceId = (id) => {
  const idString = id.toString();
  return idString.slice(idString.indexOf("_", idString.length - 1));
};

// This helper function takes in a  file signature and returns the file type
const mimeTypes = (fileSignature) => {
  switch (fileSignature) {
    case "89504E47":
      return "image/png";
    case "25504446":
      return "application/pdf";
    case "FFD8FFDB":
    case "FFD8FFE0":
    case "FFD8FFE2":
    case "FFD8FFE3":
    case "FFD8FFE1":
      return "image/jpeg";
    case "D0CF11E0A1B11AE1":
    case "DBA52D00":
    case "504B0304":
    case "504B34":
      return "DOC/DOCX";
    default:
      return "Unknown filetype";
  }
};

export { sliceId, mimeTypes };

// Files must be in one of these formats:
// PDF, DONE
// Word,
// Excel,
// or a valid image (jpg or png)
