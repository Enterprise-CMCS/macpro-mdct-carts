import { testEvent } from "../../test-util/testEvents";
import {
  callerProvider,
  CLIENT_ID,
  eventWithToken,
  idTokenClaims,
  now,
  setUpTestVerifier,
  signToken,
  testJwks,
  unsignedAdminToken,
  USER_POOL_ID,
} from "../../test-util/cognitoTokens";
import {
  authenticateUser,
  getVerifier,
  isAuthorized,
  mapIdmRoleToAppRole,
  UserCredentials,
} from "../authorization";
import { UnauthenticatedError } from "../httpErrors";
import { logger } from "../debug-lib";
import { AppRoles, IdmRoles, APIGatewayProxyEvent } from "../../types";

jest.mock("../debug-lib", () => ({
  logger: {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

const validTokenEvent = () => eventWithToken(signToken(idTokenClaims()));

describe("Authorization Lib", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setUpTestVerifier();
  });

  afterEach(() => {
    delete process.env.AWS_LAMBDA_FUNCTION_NAME;
  });

  describe("authenticateUser", () => {
    test("accepts a valid ID token when no Cognito user signed the request", async () => {
      const user = await authenticateUser(validTokenEvent());
      expect(user).toEqual(
        expect.objectContaining({ role: AppRoles.STATE_USER, state: "AL" })
      );
    });

    test("rejects a request with no token, and logs why", async () => {
      await expect(authenticateUser(eventWithToken(undefined))).rejects.toThrow(
        UnauthenticatedError
      );
      expect(logger.warn).toHaveBeenCalledWith(
        "Rejected request: missing token"
      );
    });

    test.each([
      ["has no signature", () => unsignedAdminToken()],
      [
        "has expired",
        () =>
          signToken(idTokenClaims({ iat: now() - 7200, exp: now() - 3600 })),
      ],
      [
        "is an access token instead of an ID token",
        () =>
          signToken(
            idTokenClaims({
              token_use: "access",
              aud: undefined,
              client_id: CLIENT_ID,
            })
          ),
      ],
    ])("rejects a token that %s", async (_reason, makeToken) => {
      await expect(
        authenticateUser(eventWithToken(makeToken()))
      ).rejects.toThrow(UnauthenticatedError);
    });

    test("accepts a token that expired within the 30-second clock-skew allowance", async () => {
      const token = signToken(
        idTokenClaims({ iat: now() - 3600, exp: now() - 10 })
      );
      await expect(authenticateUser(eventWithToken(token))).resolves.toEqual(
        expect.objectContaining({ role: AppRoles.STATE_USER })
      );
    });

    test.each([
      [
        "another user pool",
        "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_Other1",
      ],
      // Cognito answers 403 for our pool's keys at this URL, so checking the
      // signature would mean a failed download, an error log and a 503
      [
        "our pool, in Cognito's global URL format",
        `https://issuer-cognito-idp.us-east-1.amazonaws.com/${USER_POOL_ID}`,
      ],
    ])(
      "rejects a token issued by %s without checking its signature",
      async (_issuer, iss) => {
        const verify = jest.spyOn(getVerifier(), "verify");
        await expect(
          authenticateUser(eventWithToken(signToken(idTokenClaims({ iss }))))
        ).rejects.toThrow(UnauthenticatedError);
        expect(verify).not.toHaveBeenCalled();
      }
    );

    test.each([
      ["belong to a different user", callerProvider("someone-else")],
      ["have an empty user ID", callerProvider("")],
      ["are in an unrecognized format", "unrecognized-format"],
    ])(
      "rejects a valid token when the AWS credentials that signed the request %s",
      async (_case, cognitoAuthenticationProvider) => {
        const event = eventWithToken(signToken(idTokenClaims()), {
          requestContext: { identity: { cognitoAuthenticationProvider } },
        });
        await expect(authenticateUser(event)).rejects.toThrow(
          UnauthenticatedError
        );
      }
    );

    test("returns 503 and logs an error when the key download fails", async () => {
      await jest.isolateModulesAsync(async () => {
        const { SimpleFetcher } = await import("aws-jwt-verify/https");
        const { FetchError } = await import("aws-jwt-verify/error");
        jest
          .spyOn(SimpleFetcher.prototype, "fetch")
          .mockRejectedValue(new FetchError("https://cognito-idp", "timeout"));
        const fresh = await import("../authorization");
        const { logger: freshLogger } = await import("../debug-lib");

        await expect(fresh.authenticateUser(validTokenEvent())).rejects.toThrow(
          "Unable to verify credentials right now"
        );
        expect(freshLogger.error).toHaveBeenCalledTimes(1);
        expect(freshLogger.warn).not.toHaveBeenCalled();
      });
    });

    test("passes unexpected errors through (500) instead of blaming the token", async () => {
      jest
        .spyOn(getVerifier(), "verify")
        .mockRejectedValueOnce(new TypeError("bug"));
      await expect(authenticateUser(validTokenEvent())).rejects.toThrow(
        TypeError
      );
    });

    test("rejects a token for another app client, logging a fixed reason and nothing from the token", async () => {
      const token = signToken(idTokenClaims({ aud: "<value-from-token>" }));
      await expect(authenticateUser(eventWithToken(token))).rejects.toThrow(
        UnauthenticatedError
      );
      expect(logger.warn).toHaveBeenCalledWith(
        "Rejected token: CognitoJwtInvalidClientIdError"
      );
      const everythingLogged = JSON.stringify(
        Object.values(logger).map((log) => (log as jest.Mock).mock.calls)
      );
      expect(everythingLogged).not.toContain("value-from-token");
    });

    test.each([
      ["missing", undefined, "is not set"],
      ["malformed", "not a pool id", "not a pool id"],
    ])(
      "a %s user pool ID returns a generic 500 and logs the details",
      async (_case, poolId, loggedDetail) => {
        if (poolId === undefined) delete process.env.COGNITO_USER_POOL_ID;
        else process.env.COGNITO_USER_POOL_ID = poolId;
        await jest.isolateModulesAsync(async () => {
          const isolated = await import("../authorization");
          const { logger: isolatedLogger } = await import("../debug-lib");
          await expect(
            isolated.authenticateUser(validTokenEvent())
          ).rejects.toThrow(/^Server configuration error$/);
          expect(isolatedLogger.error).toHaveBeenCalledWith(
            expect.stringContaining(loggedDetail)
          );
        });
      }
    );

    test("rejects an unknown key ID, downloads Cognito's keys once, and keeps letting real users in", async () => {
      await jest.isolateModulesAsync(async () => {
        // A new Lambda container: nothing cached, and the key download stubbed
        const { SimpleFetcher } = await import("aws-jwt-verify/https");
        const download = jest
          .spyOn(SimpleFetcher.prototype, "fetch")
          .mockResolvedValue(
            new TextEncoder().encode(JSON.stringify(testJwks())).buffer
          );
        const fresh = await import("../authorization");
        const withKeyId = (kid: string) =>
          eventWithToken(
            signToken(idTokenClaims(), undefined, {
              alg: "RS256",
              kid,
              typ: "JWT",
            })
          );

        // Rejected, and the library pauses further key downloads for 10s
        await expect(
          fresh.authenticateUser(withKeyId("unknown-1"))
        ).rejects.toThrow("Invalid authentication token");
        // Real users still get in: their key came with that download
        await expect(
          fresh.authenticateUser(validTokenEvent())
        ).resolves.toEqual(expect.objectContaining({ state: "AL" }));
        // During the pause, another unknown key ID is rejected without a download
        await expect(
          fresh.authenticateUser(withKeyId("unknown-2"))
        ).rejects.toThrow("Invalid authentication token");
        expect(download).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("downloading Cognito's keys at startup", () => {
    const loadIsolated = async (hydrate: jest.Mock) => {
      let isolatedLogger: any;
      await jest.isolateModulesAsync(async () => {
        const { CognitoJwtVerifier } = await import("aws-jwt-verify");
        jest
          .spyOn(CognitoJwtVerifier.prototype, "hydrate")
          .mockImplementation(hydrate);
        ({ logger: isolatedLogger } = await import("../debug-lib"));
        await import("../authorization");
      });
      await new Promise(setImmediate); // let a rejected download settle
      return isolatedLogger;
    };

    test("starts the download when running in Lambda", async () => {
      process.env.AWS_LAMBDA_FUNCTION_NAME = "carts-getSections";
      const hydrate = jest.fn().mockResolvedValue(undefined);
      await loadIsolated(hydrate);
      expect(hydrate).toHaveBeenCalledTimes(1);
    });

    test("does nothing outside Lambda", async () => {
      const hydrate = jest.fn().mockResolvedValue(undefined);
      await loadIsolated(hydrate);
      expect(hydrate).not.toHaveBeenCalled();
    });

    test("logs a warning if the download fails, without crashing", async () => {
      process.env.AWS_LAMBDA_FUNCTION_NAME = "carts-getSections";
      const hydrate = jest.fn().mockRejectedValue(new Error("down"));
      const isolatedLogger = await loadIsolated(hydrate);
      expect(isolatedLogger.warn).toHaveBeenCalledWith(
        "Could not prefetch Cognito signing keys"
      );
    });

    test("skips the download without crashing when config is missing", async () => {
      process.env.AWS_LAMBDA_FUNCTION_NAME = "carts-getSections";
      delete process.env.COGNITO_USER_POOL_ID;
      const hydrate = jest.fn();
      await expect(loadIsolated(hydrate)).resolves.toBeDefined();
      expect(hydrate).not.toHaveBeenCalled();
    });
  });

  describe("isAuthorized", () => {
    const user = (role: string, state?: string) =>
      new UserCredentials({
        "custom:cms_roles": role,
        "custom:cms_state": state,
      });
    const alabamaUser = user(IdmRoles.STATE, "AL");
    const stateUserWithNoState = user(IdmRoles.STATE);
    const admin = user(IdmRoles.PROJECT_OFFICER);
    const request = (state?: string) =>
      ({
        ...testEvent,
        pathParameters: state ? { state } : null,
      }) as APIGatewayProxyEvent;

    test.each([
      ["a state user on their own state's routes", alabamaUser, "AL"],
      [
        "a state user whose state is in lower case in the URL",
        alabamaUser,
        "al",
      ],
      ["a state user on routes with no state", alabamaUser, undefined],
      [
        "a state user with no assigned state on routes with no state",
        stateUserWithNoState,
        undefined,
      ],
      ["a CMS admin on any state's routes", admin, "CA"],
    ])("allows %s", (_case, who, state) => {
      expect(isAuthorized(request(state), who)).toBe(true);
    });

    test.each([
      ["a state user on another state's routes", alabamaUser, "CA"],
      [
        "a state user with no assigned state on a state's routes",
        stateUserWithNoState,
        "AL",
      ],
      [
        "a user with only another app's role",
        user("mdctseds-state-user"),
        "AL",
      ],
      [
        "a user with an unrecognized CARTS role",
        user("mdctcarts-made-up"),
        "AL",
      ],
    ])("denies %s", (_case, who, state) => {
      expect(isAuthorized(request(state), who)).toBe(false);
    });
  });

  describe("UserCredentials name", () => {
    test("uses the first and last name from the token", () => {
      const user = new UserCredentials({
        given_name: "Ada",
        family_name: "Lovelace",
        email: "ada@example.com",
      });
      expect(user.name).toBe("Ada Lovelace");
    });

    test("falls back to email when either name is missing", () => {
      const user = new UserCredentials({
        given_name: "Ada",
        email: "ada@example.com",
      });
      expect(user.name).toBe("ada@example.com");
    });
  });

  describe("mapIdmRoleToAppRole", () => {
    test.each([
      [IdmRoles.APPROVER, AppRoles.CMS_APPROVER],
      [IdmRoles.INTERNAL, AppRoles.INTERNAL_USER],
      [IdmRoles.HELP, AppRoles.HELP_DESK],
      [IdmRoles.BUSINESS_OWNER_REP, AppRoles.CMS_USER],
      [IdmRoles.STATE, AppRoles.STATE_USER],
      [IdmRoles.PROJECT_OFFICER, AppRoles.CMS_ADMIN],
    ])("maps %s to %s", (idmRole, appRole) => {
      expect(mapIdmRoleToAppRole(idmRole)).toBe(appRole);
    });

    test("returns no role for an unrecognized role", () => {
      expect(mapIdmRoleToAppRole("mdctcarts-made-up" as IdmRoles)).toBe(
        undefined
      );
    });
  });
});
