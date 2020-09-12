// This function extracts just the unique ID
// from all objectives & goals, stopping at the underscore

const sliceId = (id) => {
  let idString = id.toString();
  let num = idString.slice(idString.indexOf("_", idString.length - 1));
  return num;
};

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
    default:
      return "Unknown filetype";
  }
};

export { sliceId, mimeTypes };
