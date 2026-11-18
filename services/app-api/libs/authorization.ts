import { CognitoJwtVerifier } from "aws-jwt-verify";
import { SimpleJwksCache } from "aws-jwt-verify/jwk";
import { SimpleFetcher } from "aws-jwt-verify/https";
import { decomposeUnverifiedJwt } from "aws-jwt-verify/jwt";
import {
  FetchError,
  JwkInvalidKtyError,
  JwkInvalidUseError,
  JwksValidationError,
  JwkValidationError,
  JwtBaseError,
  JwtExpiredError,
  JwtInvalidClaimError,
  JwtInvalidIssuerError,
  JwtInvalidSignatureAlgorithmError,
  JwtInvalidSignatureError,
  JwtParseError,
  KidNotFoundInJwksError,
  WaitPeriodNotYetEndedJwkError,
} from "aws-jwt-verify/error";
import { IdmRoles, AppRoles, APIGatewayProxyEvent } from "../types";
import { logger } from "./debug-lib";
import { ServiceUnavailableError, UnauthenticatedError } from "./httpErrors";

interface DecodedToken {
  "custom:cms_roles"?: string;
  "custom:cms_state"?: string;
  given_name?: string;
  family_name?: string;
  email?: string;
  sub?: string;
}

export class UserCredentials {
  role?: AppRoles;
  state?: string;
  name?: string;
  email?: string;

  constructor(decoded: DecodedToken) {
    const idmRole = decoded["custom:cms_roles"]
      ?.split(",")
      .find((r) => r.includes("mdctcarts")) as IdmRoles | undefined;
    this.role = idmRole ? mapIdmRoleToAppRole(idmRole) : undefined;
    if (idmRole && !this.role) {
      logger.warn("Token has an unrecognized CARTS role");
    }
    this.state = decoded["custom:cms_state"];
    this.name =
      decoded.given_name && decoded.family_name
        ? `${decoded.given_name} ${decoded.family_name}`
        : decoded.email;
    this.email = decoded.email;
  }
}

/** Logs the details; callers only get a generic 500 */
const configurationError = (detail: string) => {
  logger.error(`Cognito verifier configuration error: ${detail}`);
  return new Error("Server configuration error");
};

const createVerifier = () => {
  const userPoolId = process.env.COGNITO_USER_POOL_ID;
  const clientId = process.env.COGNITO_USER_POOL_CLIENT_ID;
  if (!userPoolId || !clientId) {
    throw configurationError(
      "COGNITO_USER_POOL_ID or COGNITO_USER_POOL_CLIENT_ID is not set"
    );
  }
  try {
    return CognitoJwtVerifier.create(
      {
        userPoolId,
        clientId,
        tokenUse: "id",
        graceSeconds: 30,
      },
      {
        jwksCache: new SimpleJwksCache({
          fetcher: new SimpleFetcher({
            defaultRequestOptions: { responseTimeout: 1500 },
          }),
        }),
      }
    );
  } catch (error) {
    // Triggers on a malformed pool ID
    throw configurationError((error as Error).message);
  }
};

let verifier: ReturnType<typeof createVerifier> | undefined;

export const getVerifier = () => (verifier ??= createVerifier());

if (process.env.AWS_LAMBDA_FUNCTION_NAME) {
  try {
    getVerifier()
      .hydrate()
      .catch(() => logger.warn("Could not prefetch Cognito signing keys"));
  } catch {
    // Missing config: already logged by createVerifier
  }
}

/** Throw a 503 for these as its token related */
const cannotVerifyRightNow = (error: unknown) =>
  error instanceof FetchError ||
  error instanceof JwksValidationError ||
  error instanceof JwkValidationError ||
  error instanceof JwkInvalidUseError ||
  error instanceof JwkInvalidKtyError ||
  error instanceof WaitPeriodNotYetEndedJwkError;

/**
 * aws-jwt-verify also accepts a global issuer format, and picks the key URL
 * from the unverified `iss`. Our pool's global-format URL returns 403, so
 * without this anyone could force failing downloads, error logs and 503s.
 */
const assertRegionalIssuer = (token: string) => {
  const userPoolId = process.env.COGNITO_USER_POOL_ID!;
  const region = userPoolId.split("_")[0];
  const expected = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`;
  const { iss } = decomposeUnverifiedJwt(token).payload;
  if (iss !== expected) {
    throw new JwtInvalidIssuerError("Issuer not allowed", iss, expected);
  }
};

const describeRejection = (error: JwtBaseError) => {
  if (error instanceof JwtExpiredError) return "expired";
  if (
    error instanceof JwtInvalidSignatureError ||
    error instanceof JwtInvalidSignatureAlgorithmError
  ) {
    return "invalid signature";
  }
  if (error instanceof JwtInvalidClaimError) {
    return "wrong issuer, client, or token type";
  }
  if (error instanceof JwtParseError) return "malformed";
  if (error instanceof KidNotFoundInJwksError) return "unknown signing key";
  return "failed verification";
};

const getSigV4CallerSub = (event: APIGatewayProxyEvent) => {
  const provider: string | undefined =
    event.requestContext?.identity?.cognitoAuthenticationProvider;
  if (!provider) return undefined;
  const [, sub] = provider.split(":CognitoSignIn:");
  return sub ?? "";
};

/** Verifies the Cognito ID token in x-api-key and returns its user */
export const authenticateUser = async (event: APIGatewayProxyEvent) => {
  const token = event.headers?.["x-api-key"];
  if (!token) {
    logger.warn("Rejected request: missing token");
    throw new UnauthenticatedError("Missing authentication token");
  }

  const jwtVerifier = getVerifier();
  let payload: DecodedToken;
  try {
    assertRegionalIssuer(token);
    payload = (await jwtVerifier.verify(token)) as unknown as DecodedToken;
  } catch (error) {
    if (cannotVerifyRightNow(error)) {
      if (error instanceof WaitPeriodNotYetEndedJwkError) {
        logger.warn(
          "Could not verify token: signing key refresh is rate limited"
        );
      } else {
        logger.error(
          "Could not load Cognito signing keys: %s",
          (error as Error).message
        );
      }
      throw new ServiceUnavailableError(
        "Unable to verify credentials right now"
      );
    }
    if (error instanceof JwtBaseError) {
      logger.warn(`Rejected token: ${describeRejection(error)}`);
      throw new UnauthenticatedError("Invalid authentication token");
    }
    throw error; // Unexpected bug: let handler-lib return a 500
  }

  const callerSub = getSigV4CallerSub(event);
  if (callerSub !== undefined && callerSub !== payload.sub) {
    logger.warn("Token sub does not match SigV4 caller");
    throw new UnauthenticatedError("Invalid authentication token");
  }

  logger.debug(`Requesting user has sub '${payload.sub}'`);
  return new UserCredentials(payload);
};

export const isAuthorized = (
  event: APIGatewayProxyEvent,
  user: UserCredentials
) => {
  if (!user.role) return false;

  // State users may only use their own state's routes. State-less routes
  // (GET /state, GET /state_status) stay open, even without an assigned state.
  const requestState = event.pathParameters?.state;
  if (user.role === AppRoles.STATE_USER && requestState) {
    return user.state?.toLowerCase() === requestState.toLowerCase();
  }
  return true;
};

export const mapIdmRoleToAppRole = (idmRole: IdmRoles) => {
  switch (idmRole) {
    case IdmRoles.APPROVER:
      return AppRoles.CMS_APPROVER;
    case IdmRoles.INTERNAL:
      return AppRoles.INTERNAL_USER;
    case IdmRoles.HELP:
      return AppRoles.HELP_DESK;
    case IdmRoles.BUSINESS_OWNER_REP:
      return AppRoles.CMS_USER;
    case IdmRoles.STATE:
      return AppRoles.STATE_USER;
    case IdmRoles.PROJECT_OFFICER:
      return AppRoles.CMS_ADMIN;
    default:
      return undefined;
  }
};
