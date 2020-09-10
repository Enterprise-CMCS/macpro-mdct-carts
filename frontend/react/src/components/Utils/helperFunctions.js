// This function extracts just the unique ID
// from all objectives & goals, stopping at the underscore
import jsonpath from "jsonpath";

const sliceId = (id) => {
  let idString = id.toString();
  let num = idString.slice(idString.indexOf("_", idString.length - 1));
  return num;
};

export { sliceId };
