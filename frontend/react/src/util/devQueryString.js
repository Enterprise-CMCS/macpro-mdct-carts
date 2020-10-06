export const forwardedQueryString = () => {
  const qs = window.location.search.replace("?", "");
  const devQs = qs.split("&").find(i => i.startsWith("dev="));
  return devQs.length === 0 ? "" : `?${devQs}`;
};