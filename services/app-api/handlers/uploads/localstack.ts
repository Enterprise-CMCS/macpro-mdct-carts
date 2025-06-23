export const fixLocalstackUrl = (url: string): string => {
  /*
   * const isLocalStack =
   *   process.env.AWS_ENDPOINT_URL &&
   *   process.env.AWS_ENDPOINT_URL.includes("localhost");
   */
  /*
   * if (isLocalStack) {
   * Replace internal Docker IP with localhost
   * return url.replace(".localstack.cloud", "");
   * }
   */

  return url;
};
