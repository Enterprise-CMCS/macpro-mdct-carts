// Cognito-shaped ID tokens signed with a local test key, so tests need no
// network.
import { createSign, generateKeyPairSync, KeyObject } from "node:crypto";
import { getVerifier } from "../libs/authorization";
import { IdmRoles, APIGatewayProxyEvent } from "../types";
import { testEvent } from "./testEvents";

export const USER_POOL_ID = "us-east-1_TestPool1";
export const CLIENT_ID = "testclientid123";
export const ISSUER = `https://cognito-idp.us-east-1.amazonaws.com/${USER_POOL_ID}`;
const KID = "test-kid";
export const SUB = "11111111-2222-3333-4444-555555555555";

const { privateKey, publicKey } = generateKeyPairSync("rsa", {
  modulusLength: 2048,
});

/** A key Cognito never issued, for forging otherwise well-formed tokens */
export const { privateKey: attackerKey } = generateKeyPairSync("rsa", {
  modulusLength: 2048,
});

export const b64url = (obj: object) =>
  Buffer.from(JSON.stringify(obj)).toString("base64url");

export const signToken = (
  payload: object,
  key: KeyObject = privateKey,
  header?: object
) => {
  header ??= { alg: "RS256", kid: KID, typ: "JWT" };
  const data = `${b64url(header)}.${b64url(payload)}`;
  const signature = createSign("RSA-SHA256")
    .update(data)
    .sign(key)
    .toString("base64url");
  return `${data}.${signature}`;
};

/** The CCIC report's forged token: alg "none", no signature */
export const unsignedAdminToken = (extraClaims: object = {}) =>
  `${b64url({ alg: "none", typ: "JWT" })}.${b64url({
    "custom:cms_roles": IdmRoles.PROJECT_OFFICER,
    "custom:cms_state": "TX",
    email: "attacker@test.com",
    ...extraClaims,
  })}.`;

export const now = () => Math.floor(Date.now() / 1000);

export const idTokenClaims = (overrides: object = {}) => ({
  sub: SUB,
  iss: ISSUER,
  aud: CLIENT_ID,
  token_use: "id",
  iat: now(),
  exp: now() + 300,
  "custom:cms_roles": IdmRoles.STATE,
  "custom:cms_state": "AL",
  ...overrides,
});

export const eventWithToken = (
  token: string | undefined,
  extra: Partial<APIGatewayProxyEvent> = {}
): APIGatewayProxyEvent => ({
  ...testEvent,
  headers: token ? { "x-api-key": token } : {},
  requestContext: {},
  ...extra,
});

/** The issuer without its scheme, as API Gateway reports the SigV4 caller */
export const PROVIDER = ISSUER.slice("https://".length);

export const callerProvider = (sub: string) =>
  `${PROVIDER},${PROVIDER}:CognitoSignIn:${sub}`;

/** A real token for `signed` claims, with its payload swapped for `forged` */
export const tamperedToken = (signed: object, forged: object) => {
  const [header, , signature] = signToken(signed).split(".");
  return `${header}.${b64url(forged)}.${signature}`;
};

/** A JWKS containing the test public key */
export const testJwks = () => ({
  keys: [
    {
      ...(publicKey.export({ format: "jwk" }) as object),
      kid: KID,
      alg: "RS256",
      use: "sig",
      kty: "RSA",
    },
  ],
});

/** Points the real verifier at the test pool and key. Safe to repeat. */
export const setUpTestVerifier = () => {
  process.env.COGNITO_USER_POOL_ID = USER_POOL_ID;
  process.env.COGNITO_USER_POOL_CLIENT_ID = CLIENT_ID;
  getVerifier().cacheJwks(testJwks() as any);
};
