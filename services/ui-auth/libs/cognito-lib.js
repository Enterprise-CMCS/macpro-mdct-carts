/* eslint-disable no-unused-vars */
var aws = require("aws-sdk");
const COGNITO_CLIENT = new aws.CognitoIdentityServiceProvider({
  apiVersion: "2016-04-19",
  region: "us-east-1",
});

export async function createUser(params) {
  // eslint-disable-next-line no-console
  await COGNITO_CLIENT.adminCreateUser(params, function (err, data) {
    // eslint-disable-next-line no-console
    if (err) {
      // eslint-disable-next-line no-console
      console.log({ statusCode: 500, body: { message: "FAILED", error: err } });
      throw new Error("Cannot create user"); //if user already exists, we still continue and ignore
    }
  });
}

export async function setPassword(params) {
  await new Promise((resolve, reject) => {
    COGNITO_CLIENT.adminSetUserPassword(params, function (err, data) {
      if (err) {
        var response = {
          statusCode: 500,
          body: { message: "FAILED", error: err },
        };
        reject(response);
      } else {
        resolve();
      }
    });
  });
}

export async function updateUserAttributes(params) {
  await new Promise((resolve, reject) => {
    COGNITO_CLIENT.adminUpdateUserAttributes(params, function (err, data) {
      if (err) {
        var response = {
          statusCode: 500,
          body: { message: "FAILED", error: err },
        };
        reject(response);
      } else {
        resolve();
      }
    });
  });
}
