const {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  AdminSetUserPasswordCommand,
  AdminUpdateUserAttributesCommand,
} = require("@aws-sdk/client-cognito-identity-provider");

const COGNITO_CLIENT = new CognitoIdentityProviderClient({
  apiVersion: "2016-04-19",
  region: "us-east-1",
});

export async function createUser(params) {
  await COGNITO_CLIENT.send(new AdminCreateUserCommand(params));
}

export async function setPassword(params) {
  await COGNITO_CLIENT.send(new AdminSetUserPasswordCommand(params));
}

export async function updateUserAttributes(params) {
  await COGNITO_CLIENT.send(new AdminUpdateUserAttributesCommand(params));
}
