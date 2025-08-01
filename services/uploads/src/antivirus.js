/**
 * Lambda function that will be perform the scan and tag the file accordingly.
 */

// TODO logging solution for backend services
/* eslint-disable no-console */

const {
  S3Client,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectTaggingCommand,
} = require("@aws-sdk/client-s3");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const clamav = require("./clamav");
const s3 = new S3Client();
const utils = require("./utils");
const constants = require("./constants");
const { pipeline } = require("stream/promises");

/**
 * Retrieve the file size of S3 object without downloading.
 * @param {string} key    Key of S3 object
 * @param {string} bucket Bucket of S3 Object
 * @return {int} Length of S3 object in bytes.
 */
async function sizeOf(key, bucket) {
  console.log("key: " + key);
  console.log("bucket: " + bucket);

  const getObjectHead = new HeadObjectCommand({ Key: key, Bucket: bucket });
  const res = await s3.send(getObjectHead);
  return res.ContentLength;
}

/**
 * Check if S3 object is larger then the MAX_FILE_SIZE set.
 * @param {string} s3ObjectKey       Key of S3 Object
 * @param {string} s3ObjectBucket   Bucket of S3 object
 * @return {boolean} True if S3 object is larger then MAX_FILE_SIZE
 */
async function isS3FileTooBig(s3ObjectKey, s3ObjectBucket) {
  let fileSize = await sizeOf(s3ObjectKey, s3ObjectBucket);
  return fileSize > constants.MAX_FILE_SIZE;
}

/**
 * Download a file from S3 to a local temp directory.
 * @param {string} s3ObjectKey       Key of S3 Object
 * @param {string} s3ObjectBucket    Bucket of S3 object
 * @return {Promise<string>}         Path to downloaded file
 */
async function downloadFileFromS3(s3ObjectKey, s3ObjectBucket) {
  if (!fs.existsSync(constants.TMP_DOWNLOAD_PATH)) {
    fs.mkdirSync(constants.TMP_DOWNLOAD_PATH);
  }

  const tmpFileName = `${crypto.randomUUID()}.tmp`;
  let localPath = `${constants.TMP_DOWNLOAD_PATH}${tmpFileName}`;
  let writeStream = fs.createWriteStream(localPath);

  utils.generateSystemMessage(
    `Downloading file s3://${s3ObjectBucket}/${s3ObjectKey}`
  );

  let options = {
    Bucket: s3ObjectBucket,
    Key: s3ObjectKey,
  };
  const getObject = new GetObjectCommand(options);

  try {
    const response = await s3.send(getObject);
    const readStream = response.Body.transformToWebStream();
    await pipeline(readStream, writeStream);
    utils.generateSystemMessage(
      `Finished downloading new object ${s3ObjectKey}`
    );
    return localPath;
  } catch (err) {
    utils.generateSystemMessage(`Error downloading new object ${s3ObjectKey}`);
    throw err;
  }
}

async function lambdaHandleEvent(event, _context) {
  const isLocalStack =
    process.env.AWS_ENDPOINT_URL &&
    process.env.AWS_ENDPOINT_URL.includes("localhost");
  utils.generateSystemMessage("Start Antivirus Lambda function");

  let s3ObjectKey = utils.extractKeyFromS3Event(event);
  let s3ObjectBucket = utils.extractBucketFromS3Event(event);

  utils.generateSystemMessage(
    `S3 Bucket and Key\n ${s3ObjectBucket}\n${s3ObjectKey}`
  );

  let virusScanStatus;

  /*
   * You need to verify that you are not getting too large a file
   * currently lambdas max out at 500MB storage.
   */
  if (isLocalStack) {
    virusScanStatus = constants.STATUS_CLEAN_FILE;
  } else if (await isS3FileTooBig(s3ObjectKey, s3ObjectBucket)) {
    virusScanStatus = constants.STATUS_SKIPPED_FILE;
    utils.generateSystemMessage(
      `S3 File is too big. virusScanStatus=${virusScanStatus}`
    );
  } else {
    //No need to act on file unless you are able to.
    utils.generateSystemMessage("Download AV Definitions");
    await clamav.downloadAVDefinitions(
      constants.CLAMAV_BUCKET_NAME,
      constants.PATH_TO_AV_DEFINITIONS
    );
    utils.generateSystemMessage("Download File from S3");
    const filePath = await downloadFileFromS3(s3ObjectKey, s3ObjectBucket);
    utils.generateSystemMessage("Set virusScanStatus");
    virusScanStatus = clamav.scanLocalFile(filePath);
    utils.generateSystemMessage(`virusScanStatus=${virusScanStatus}`);
  }

  var taggingParams = {
    Bucket: s3ObjectBucket,
    Key: s3ObjectKey,
    Tagging: utils.generateTagSet(virusScanStatus),
  };
  const tagObject = new PutObjectTaggingCommand(taggingParams);

  try {
    await s3.send(tagObject);
    utils.generateSystemMessage("Tagging successful");
  } catch (err) {
    console.log(err);
  } finally {
    return virusScanStatus; // eslint-disable-line no-unsafe-finally
  }
}

async function scanS3Object(s3ObjectKey, s3ObjectBucket) {
  await clamav.downloadAVDefinitions(
    constants.CLAMAV_BUCKET_NAME,
    constants.PATH_TO_AV_DEFINITIONS
  );

  await downloadFileFromS3(s3ObjectKey, s3ObjectBucket);

  let virusScanStatus = clamav.scanLocalFile(path.basename(s3ObjectKey));

  var taggingParams = {
    Bucket: s3ObjectBucket,
    Key: s3ObjectKey,
    Tagging: utils.generateTagSet(virusScanStatus),
  };
  const tagObject = new PutObjectTaggingCommand(taggingParams);

  try {
    await s3.send(tagObject);
    utils.generateSystemMessage("Tagging successful");
  } catch (err) {
    console.log(err);
  } finally {
    return virusScanStatus; // eslint-disable-line no-unsafe-finally
  }
}

module.exports = {
  lambdaHandleEvent: lambdaHandleEvent,
  scanS3Object: scanS3Object,
  isS3FileTooBig: isS3FileTooBig,
  sizeOf: sizeOf,
};
