const forwardedQueryString = () => {
  const qs = window.location.search.replace("?", "");
  const devQs = qs.split("&").find((i) => i.startsWith("dev="));
  if (devQs) {
    return devQs.length === 0 ? "" : `?${devQs}`;
  }
  return "";
};

export default forwardedQueryString;
