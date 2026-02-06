import { apiLib } from "./apiLib";

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
  const opts = {
    body,
  };
  const { psurl } = await apiLib.post(
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
  const opts = {
    body: { fileId },
  };
  const response = await apiLib.post(
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
  const opts = {
    body,
  };
  const response = await apiLib
    .post(`/uploads/${year}/${stateCode}`, opts)
    .catch((error) => {
      console.log("!!!Error downloading files: ", error);
    });
  return response ? response : [];
};

export const deleteUploadedFile = async (year, stateCode, fileId) => {
  const encodedFileId = encodeURIComponent(fileId);
  await apiLib
    .del(`/uploads/${year}/${stateCode}/${encodedFileId}`)
    .catch((error) => {
      console.log("!!!Error retrieving files: ", error);
    });
};
