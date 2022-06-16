import { SSM } from "aws-sdk";
import { APIGatewayProxyEvent } from "aws-lambda";
import jwt_decode from "jwt-decode";
import { UserRoles } from "../types";
import { CognitoJwtVerifier } from "aws-jwt-verify";

// prettier-ignore
interface DecodedToken {
  "custom:cms_roles": UserRoles;
  "custom:cms_state"?: string;
  given_name?: string;
  family_name?: string;
  identities?: [{ userId?: string }];
  email?: string
}

class UserCredentials {
  role?: string;
  state?: string;
  identities?: [{ userId?: string }];
  email?: string;

  constructor(decoded?: DecodedToken) {
    if (decoded === undefined) return;
    const role = decoded["custom:cms_roles"]
      .split(",")
      .find((r) => r.includes("mdctcarts"));
    this.role = role;
    this.state = decoded["custom:cms_state"];
    this.identities = decoded.identities;
    this.email = decoded.email;
  }
}

/*
 * Resolving a circular dependency in deployment order
 *   ui-auth requires API-Gateway to be defined from here
 *   app-api requires the Cognito resources to be created
 * Get the cognito info if it hasn't been defined
 */
const loadCognitoValues = async () => {
  if (
    process.env.COGNITO_USER_POOL_ID &&
    process.env.COGNITO_USER_POOL_CLIENT_ID
  ) {
    return {
      userPoolId: process.env.COGNITO_USER_POOL_ID,
      userPoolClientId: process.env.COGNITO_USER_POOL_CLIENT_ID,
    };
  } else {
    const ssm = new SSM();
    const stage = process.env.STAGE!;
    const userPoolIdParamName = "/" + stage + "/ui-auth/cognito_user_pool_id";
    const userPoolClientIdParamName =
      "/" + stage + "/ui-auth/cognito_user_pool_client_id";
    const userPoolIdParams = {
      Name: userPoolIdParamName,
    };
    const userPoolClientIdParams = {
      Name: userPoolClientIdParamName,
    };
    const userPoolId = await ssm.getParameter(userPoolIdParams).promise();
    const userPoolClientId = await ssm
      .getParameter(userPoolClientIdParams)
      .promise();
    if (userPoolId.Parameter?.Value && userPoolClientId.Parameter?.Value) {
      process.env["COGNITO_USER_POOL_ID"] = userPoolId.Parameter?.Value;
      process.env["COGNITO_USER_POOL_CLIENT_ID"] =
        userPoolClientId.Parameter?.Value;
      return {
        userPoolId: userPoolId.Parameter.Value,
        userPoolClientId: userPoolClientId.Parameter.Value,
      };
    } else {
      throw new Error("cannot load cognito values");
    }
  }
};

export const isAuthorized = async (event: APIGatewayProxyEvent) => {
  if (!event.headers["x-api-key"]) return false;

  // Verifier that expects valid access tokens:
  const verifier = CognitoJwtVerifier.create({
    userPoolId: process.env.COGNITO_USER_POOL_ID ?? "",
    tokenUse: "id",
    clientId: process.env.COGNITO_USER_POOL_CLIENT_ID ?? "",
  });
  try {
    await verifier.verify(event.headers["x-api-key"]);
  } catch {
    console.log("Token not valid!"); // eslint-disable-line
  }

  // get state and method from the event
  const requestState = event.pathParameters?.state;

  // decode the idToken
  const decoded = jwt_decode(event.headers["x-api-key"]) as DecodedToken;

  // get the role / state from the decoded token
  const userRole = decoded["custom:cms_roles"];
  const userState = decoded["custom:cms_state"];

  // if user is a state user - check they are requesting a resource from their state
  if (userRole === UserRoles.STATE && userState && requestState) {
    return userState.toLowerCase() === requestState.toLowerCase();
  }
  return true;
};

export const getUserNameFromJwt = (event: APIGatewayProxyEvent) => {
  let userName = "branchUser";
  if (!event?.headers || !event.headers?.["x-api-key"]) return userName;

  const decoded = jwt_decode(event.headers["x-api-key"]) as DecodedToken;

  if (decoded["given_name"] && decoded["family_name"]) {
    userName = `${decoded["given_name"]} ${decoded["family_name"]}`;
    return userName;
  }

  if (decoded.identities && decoded.identities[0]?.userId) {
    userName = decoded?.identities[0].userId;
    return userName;
  }

  return userName;
};

export const getUserCredentialsFromJwt = (event: APIGatewayProxyEvent) => {
  if (!event?.headers || !event.headers?.["x-api-key"])
    return new UserCredentials();
  const decoded = jwt_decode(event.headers["x-api-key"]) as DecodedToken;
  const credentials = new UserCredentials(decoded);
  return credentials;
};
