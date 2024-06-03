// TODO logging solution for backend services
/* eslint-disable no-console */

const {
  S3Client,
  DeleteObjectsCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");
const fs = require("fs");
const child_process = require("child_process");
const path = require("path");
const constants = require("./constants");
const utils = require("./utils");
const { pipeline } = require("stream/promises");

const S3 = new S3Client();

/**
 * Lists all the files from a bucket
 *
 * returns a list of keys
 */
async function listBucketFiles(bucketName) {
  const listObjects = new ListObjectsV2Command({
    Bucket: bucketName,
  });
  try {
    const listFilesResult = await S3.send(listObjects);

    const keys = listFilesResult?.Contents?.map((c) => c.Key) ?? [];
    return keys;
  } catch (err) {
    utils.generateSystemMessage(`Error listing files`);
    console.log(err);
    throw err;
  }
}

/**
 * Updates the definitions using freshclam.
 *
 * It will download the definitions to the current work dir.
 */
function updateAVDefinitonsWithFreshclam() {
  try {
    let executionResult = child_process.execSync(
      `${constants.PATH_TO_FRESHCLAM} --config-file=${constants.FRESHCLAM_CONFIG} --datadir=${constants.FRESHCLAM_WORK_DIR}`
    );

    utils.generateSystemMessage("Update message");
    console.log(executionResult.toString());

    console.log("Downloaded:", fs.readdirSync(constants.FRESHCLAM_WORK_DIR));

    if (executionResult.stderr) {
      utils.generateSystemMessage("stderr");
      console.log(executionResult.stderr.toString());
    }

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

/**
 * Download the Antivirus definition from S3.
 * The definitions are stored on the local disk, ensure there's enough space.
 */
async function downloadAVDefinitions() {
  // list all the files in that bucket
  utils.generateSystemMessage("Downloading Definitions");
  try {
    const allFileKeys = await listBucketFiles(constants.CLAMAV_BUCKET_NAME);

    const definitionFileKeys = allFileKeys
      .filter((key) => key.startsWith(constants.PATH_TO_AV_DEFINITIONS))
      .map((fullPath) => path.basename(fullPath));

    // download each file in the bucket.
    const downloadPromises = definitionFileKeys.map(
      async (filenameToDownload) => {
        const destinationFile = path.join("/tmp/", filenameToDownload);
        utils.generateSystemMessage(
          `Downloading ${filenameToDownload} from S3 to ${destinationFile}`
        );

        const options = {
          Bucket: constants.CLAMAV_BUCKET_NAME,
          Key: `${constants.PATH_TO_AV_DEFINITIONS}/${filenameToDownload}`,
        };
        const getObject = new GetObjectCommand(options);

        try {
          const response = await S3.send(getObject);
          const readStream = response.Body.transformToWebStream();
          const writeStream = fs.createWriteStream(destinationFile);
          await pipeline(readStream, writeStream);
          utils.generateSystemMessage(
            `Finished download ${filenameToDownload}`
          );
        } catch (err) {
          utils.generateSystemMessage(
            `Error downloading definition file ${filenameToDownload}`
          );
          console.log(err);
          throw err;
        }
      }
    );
    await Promise.all(downloadPromises);
  } catch (err) {
    console.error(`Error in downloadAVDefinitions: ${err.message}`);
  }
}

/**
 * Uploads the AV definitions to the S3 bucket.
 */
async function uploadAVDefinitions() {
  /*
   * delete all the definitions currently in the bucket.
   * first list them.
   */
  utils.generateSystemMessage("Uploading Definitions");
  const s3AllFullKeys = await listBucketFiles(constants.CLAMAV_BUCKET_NAME);

  const s3DefinitionFileFullKeys = s3AllFullKeys.filter((key) =>
    key.startsWith(constants.PATH_TO_AV_DEFINITIONS)
  );

  // If there are any s3 Definition files in the s3 bucket, delete them.
  if (s3DefinitionFileFullKeys.length != 0) {
    const deleteObject = new DeleteObjectsCommand({
      Bucket: constants.CLAMAV_BUCKET_NAME,
      Delete: {
        Objects: s3DefinitionFileFullKeys.map((k) => {
          return { Key: k };
        }),
      },
    });
    try {
      await S3.send(deleteObject);
      utils.generateSystemMessage(
        `Deleted extant definitions: ${s3DefinitionFileFullKeys}`
      );
    } catch (err) {
      utils.generateSystemMessage(
        `Error deleting current definition files: ${s3DefinitionFileFullKeys}`
      );
      console.log(err);
      throw err;
    }
  }

  // list all the files in the work dir for upload
  const definitionFiles = fs.readdirSync(constants.FRESHCLAM_WORK_DIR);

  const uploadPromises = definitionFiles.map((filenameToUpload) => {
    return new Promise((resolve, reject) => {
      utils.generateSystemMessage(
        `Uploading updated definitions for file ${filenameToUpload} ---`
      );

      let options = {
        Bucket: constants.CLAMAV_BUCKET_NAME,
        Key: `${constants.PATH_TO_AV_DEFINITIONS}/${filenameToUpload}`,
        Body: fs.createReadStream(
          path.join(constants.FRESHCLAM_WORK_DIR, filenameToUpload)
        ),
      };
      const putObject = new PutObjectCommand(options);

      S3.send(putObject, function (err, _data) {
        if (err) {
          utils.generateSystemMessage(
            `--- Error uploading ${filenameToUpload} ---`
          );
          console.log(err);
          reject();
          return;
        }
        resolve();
        utils.generateSystemMessage(
          `--- Finished uploading ${filenameToUpload} ---`
        );
      });
    });
  });

  await Promise.all(uploadPromises);
}

/**
 * Function to scan the given file. This function requires ClamAV and the definitions to be available.
 * This function does not download the file so the file should also be accessible.
 *
 * Three possible case can happen:
 * - The file is clean, the clamAV command returns 0 and the function return "CLEAN"
 * - The file is infected, the clamAV command returns 1 and this function will return "INFECTED"
 * - Any other error and the function will return null; (falsey)
 *
 * @param pathToFile Path in the filesystem where the file is stored.
 */
function scanLocalFile(pathToFile) {
  try {
    let avResult = child_process.spawnSync(constants.PATH_TO_CLAMAV, [
      "--stdout",
      "-v",
      "-a",
      "-d",
      "/tmp/",
      pathToFile,
    ]);

    // Error status 1 means that the file is infected.
    if (avResult.status === 1) {
      utils.generateSystemMessage("SUCCESSFUL SCAN, FILE INFECTED");
      return constants.STATUS_INFECTED_FILE;
    } else if (avResult.status !== 0) {
      utils.generateSystemMessage("SCAN FAILED WITH ERROR");
      console.error("stderror", avResult.stderr.toString());
      console.error("stdout", avResult.stdout.toString());
      console.error("err", avResult.error);
      return constants.STATUS_ERROR_PROCESSING_FILE;
    }

    utils.generateSystemMessage("SUCCESSFUL SCAN, FILE CLEAN");
    console.info(avResult.stdout.toString());

    return constants.STATUS_CLEAN_FILE;
  } catch (err) {
    utils.generateSystemMessage("-- SCAN FAILED ERR--");
    console.error(err);
    return constants.STATUS_ERROR_PROCESSING_FILE;
  }
}

module.exports = {
  updateAVDefinitonsWithFreshclam: updateAVDefinitonsWithFreshclam,
  downloadAVDefinitions: downloadAVDefinitions,
  uploadAVDefinitions: uploadAVDefinitions,
  scanLocalFile: scanLocalFile,
};
