// This function extracts just the unique ID
// from all objectives & goals, stopping at the underscore
import jsonpath from "jsonpath";

const sliceId = (id) => {
  let idString = id.toString();
  let num = idString.slice(idString.indexOf("_", idString.length - 1));
  return num;
};

const shouldDisplay = (context) => {
  if (!context) {
    return true;
  }

  // Wil return answer from associated question (String)
  let parentAnswer = jsonpath.query(context.conditional_display.hide_if.target);

  if (
    context.conditional_display.hide_if.values.interactive.includes(
      parentAnswer
    )
  ) {
    return false;
  } else {
    return true;
  }
};

export { sliceId, shouldDisplay };
