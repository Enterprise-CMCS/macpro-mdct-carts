const sliceId = (id) => {
  let idString = id.toString();
  let num = idString.slice(idString.indexOf("_", idString.length - 1));
  return num;
};

export { sliceId };
