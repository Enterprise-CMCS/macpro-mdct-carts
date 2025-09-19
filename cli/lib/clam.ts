import fs from "fs";
import { pipeline } from "stream";
import { promisify } from "util";

const streamPipeline = promisify(pipeline);

const downloadClamAvLayer = async () => {
  const url =
    "https://github.com/CMSgov/lambda-clamav-layer/releases/download/0.7/lambda_layer.zip";
  const outputPath = "services/uploads/lambda_layer.zip";
  if (fs.existsSync(outputPath)) return;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download, status: ${res.status}`);
  if (!res.body)
    throw new Error("Response body is null, cannot download file.");
  await streamPipeline(
    // eslint-disable-next-line no-undef
    res.body as unknown as NodeJS.ReadableStream,
    fs.createWriteStream(outputPath)
  );
};

export default downloadClamAvLayer;
