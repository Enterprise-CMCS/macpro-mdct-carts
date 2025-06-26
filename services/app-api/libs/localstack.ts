export const isLocalStack = (): boolean => {
  return (process.env.AWS_ENDPOINT_URL &&
    process.env.AWS_ENDPOINT_URL.includes("localhost")) as boolean;
};

export const fixLocalstackUrl = (url: string): string => {
  if (isLocalStack()) {
    return url.replace(".localstack.cloud", "");
  }

  return url;
};
