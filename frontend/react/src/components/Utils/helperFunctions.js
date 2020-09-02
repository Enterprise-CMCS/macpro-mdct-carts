// This function extracts just the unique ID
// from all objectives & goals, stopping at the underscore
const sliceId = (id) => {
  let idString = id.toString();
  let num = idString.slice(idString.indexOf("_", idString.length - 1));
  return num;
};

const shouldDisplay = (parentValue, context) => {
  if(!context) {
    return true;
  }
  if (
    context.conditional_display.hide_if.values.interactive &&
    !context.conditional_display.hide_if.values.interactive.includes(
      parentValue
    )
  ) {
    return true;
  } else {
    return false;
  }
};


export { sliceId, shouldDisplay };
