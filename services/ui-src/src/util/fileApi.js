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
  const response = await apiLib.post(
    "carts-api",
    `/psUrlUpload/${year}/${stateCode}`,
    opts
  );

  return {
    url: response.psurl,
    fields: response.psdata,
  };
};

export const uploadFileToS3 = async (presignedPostData, file) => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();

    Object.keys(presignedPostData.fields).forEach((key) => {
      formData.append(key, presignedPostData.fields[key]);
    });

    formData.append("file", file);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", presignedPostData.url, true);
    xhr.onload = function () {
      this.status === 204
        ? resolve(`Resolved: ${this.response}`)
        : reject(`Rejected: ${this.responseText}`);
    };
    xhr.send(formData);
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
  const opts = await requestOptions({ fileId });
  await apiLib
    .del("carts-api", `/uploads/${year}/${stateCode}`, opts)
    .catch((error) => {
      console.log("!!!Error retrieving files: ", error); // eslint-disable-line no-console
    });
};
