export const fixLocalstackUrl = (url: string): string => {
  if (!process.env.AWS_ENDPOINT_URL) return url;

  // Replace internal Docker IP with localhost
  return url.replace(
    /http:\/\/172\.17\.0\.\d+:4566/,
    process.env.AWS_ENDPOINT_URL
  );
};
