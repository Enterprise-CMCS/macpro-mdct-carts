import { apiLib } from "./apiLib";
import requestOptions from "../hooks/authHooks/requestOptions";

export const recordFileInDatabaseAndGetUploadUrl = async (
  year,
  stateCode,
  questionId,
  uploadedFile
) => {
  const body = {
    uploadedFileName: uploadedFile.name,
    uploadedFileType: uploadedFile.type,
    questionId,
  };
  const opts = await requestOptions(body);
  const { psurl } = await apiLib.post(
    "carts-api",
    `/psUrlUpload/${year}/${stateCode}`,
    opts
  );

  return { presignedUploadUrl: psurl };
};

export const uploadFileToS3 = async ({ presignedUploadUrl }, file) => {
  return await fetch(presignedUploadUrl, {
    method: "PUT",
    body: file,
  });
};

export const getFileDownloadUrl = async (year, stateCode, fileId) => {
  const opts = await requestOptions({ fileId });
  const response = await apiLib.post(
    "carts-api",
    `/psUrlDownload/${year}/${stateCode}`,
    opts
  );
  return response.psurl;
};

export const getUploadedFiles = async (year, stateCode, questionId) => {
  const body = {
    stateCode,
    questionId,
  };
  const opts = await requestOptions(body);
  const response = await apiLib
    .post("carts-api", `/uploads/${year}/${stateCode}`, opts)
    .catch((error) => {
      console.log("!!!Error downloading files: ", error); // eslint-disable-line no-console
    });
  return response ? response : [];
};

export const deleteUploadedFile = async (year, stateCode, fileId) => {
  const opts = await requestOptions();
  const encodedFileId = encodeURIComponent(fileId);
  await apiLib
    .del("carts-api", `/uploads/${year}/${stateCode}/${encodedFileId}`, opts)
    .catch((error) => {
      console.log("!!!Error retrieving files: ", error); // eslint-disable-line no-console
    });
};
