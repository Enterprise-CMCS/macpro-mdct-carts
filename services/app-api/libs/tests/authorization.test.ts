import { testEvent } from "../../test-util/testEvents";
import {
  attackerKey,
  callerProvider,
  CLIENT_ID,
  eventWithToken,
  idTokenClaims,
  now,
  PROVIDER,
  setUpTestVerifier,
  signToken,
  SUB,
  tamperedToken,
  unsignedAdminToken,
} from "../../test-util/cognitoTokens";
import {
  FetchError,
  JwkInvalidKtyError,
  JwkInvalidUseError,
  JwksValidationError,
  JwkValidationError,
  KidNotFoundInJwksError,
  WaitPeriodNotYetEndedJwkError,
} from "aws-jwt-verify/error";
import {
  authenticateUser,
  getVerifier,
  isAuthorized,
  mapIdmRoleToAppRole,
  UserCredentials,
} from "../authorization";
import { ServiceUnavailableError, UnauthenticatedError } from "../httpErrors";
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

describe("Authorization Lib", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setUpTestVerifier();
  });

  describe("authenticateUser", () => {
    test("accepts a valid Cognito-signed ID token", async () => {
      const user = await authenticateUser(
        eventWithToken(signToken(idTokenClaims()))
      );
      expect(user).toEqual(
        expect.objectContaining({ role: AppRoles.STATE_USER, state: "AL" })
      );
    });

    test("rejects a missing token, and logs it", async () => {
      await expect(authenticateUser(eventWithToken(undefined))).rejects.toThrow(
        UnauthenticatedError
      );
      expect(logger.warn).toHaveBeenCalledWith(
        "Rejected request: missing token"
      );
    });

    test("rejects the pen-test forgery: unsigned alg:none admin token", async () => {
      await expect(
        authenticateUser(eventWithToken(unsignedAdminToken()))
      ).rejects.toThrow(UnauthenticatedError);
    });

    test("rejects a token with modified claims (signature no longer matches)", async () => {
      const token = tamperedToken(
        idTokenClaims(),
        idTokenClaims({ "custom:cms_roles": IdmRoles.PROJECT_OFFICER })
      );
      await expect(authenticateUser(eventWithToken(token))).rejects.toThrow(
        UnauthenticatedError
      );
    });

    test("rejects a forged state user token for another state signed with a different key", async () => {
      const token = signToken(
        idTokenClaims({ "custom:cms_state": "CA" }),
        attackerKey
      );
      await expect(authenticateUser(eventWithToken(token))).rejects.toThrow(
        UnauthenticatedError
      );
    });

    test("rejects an expired token", async () => {
      const token = signToken(
        idTokenClaims({ iat: now() - 7200, exp: now() - 3600 })
      );
      await expect(authenticateUser(eventWithToken(token))).rejects.toThrow(
        UnauthenticatedError
      );
    });

    test("accepts a token that expired within the clock-skew grace period", async () => {
      const token = signToken(
        idTokenClaims({ iat: now() - 3600, exp: now() - 10 })
      );
      await expect(authenticateUser(eventWithToken(token))).resolves.toEqual(
        expect.objectContaining({ role: AppRoles.STATE_USER })
      );
    });

    test("rejects a token issued to a different app client", async () => {
      const token = signToken(idTokenClaims({ aud: "someotherclient" }));
      await expect(authenticateUser(eventWithToken(token))).rejects.toThrow(
        UnauthenticatedError
      );
    });

    test("rejects a token from a different user pool", async () => {
      const token = signToken(
        idTokenClaims({
          iss: "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_Other1",
        })
      );
      await expect(authenticateUser(eventWithToken(token))).rejects.toThrow(
        UnauthenticatedError
      );
    });

    test("rejects an access token in place of an ID token", async () => {
      const token = signToken(
        idTokenClaims({
          token_use: "access",
          aud: undefined,
          client_id: CLIENT_ID,
        })
      );
      await expect(authenticateUser(eventWithToken(token))).rejects.toThrow(
        UnauthenticatedError
      );
    });

    test("accepts a token whose sub matches the SigV4 caller", async () => {
      const event = eventWithToken(signToken(idTokenClaims()), {
        requestContext: {
          identity: { cognitoAuthenticationProvider: callerProvider(SUB) },
        },
      });
      await expect(authenticateUser(event)).resolves.toBeInstanceOf(
        UserCredentials
      );
    });

    test("rejects a valid token belonging to a different user than the SigV4 caller", async () => {
      const event = eventWithToken(signToken(idTokenClaims()), {
        requestContext: {
          identity: { cognitoAuthenticationProvider: callerProvider("other") },
        },
      });
      await expect(authenticateUser(event)).rejects.toThrow(
        UnauthenticatedError
      );
    });

    test("rejects when the SigV4 caller field is present but has no sub", async () => {
      for (const cognitoAuthenticationProvider of [
        PROVIDER,
        callerProvider(""),
        "unexpected-format",
      ]) {
        const event = eventWithToken(signToken(idTokenClaims()), {
          requestContext: { identity: { cognitoAuthenticationProvider } },
        });
        await expect(authenticateUser(event)).rejects.toThrow(
          UnauthenticatedError
        );
      }
    });

    test("does not echo an unrecognized role; the user simply has no role", async () => {
      const user = await authenticateUser(
        eventWithToken(
          signToken(idTokenClaims({ "custom:cms_roles": "mdctcarts-made-up" }))
        )
      );
      expect(user.role).toBeUndefined();
    });

    test.each([
      [
        "download failed",
        new FetchError("https://cognito-idp/jwks.json", "timeout"),
      ],
      ["key set malformed", new JwksValidationError("bad JWKS")],
      ["key malformed", new JwkValidationError("JWK empty")],
      ["key has wrong use", new JwkInvalidUseError("wrong use", "enc", "sig")],
      ["key has wrong type", new JwkInvalidKtyError("wrong kty", "EC", "RSA")],
    ])(
      "returns 503 and logs an error when Cognito's keys are unusable (%s)",
      async (_reason, error) => {
        jest.spyOn(getVerifier(), "verify").mockRejectedValueOnce(error);
        await expect(
          authenticateUser(eventWithToken(signToken(idTokenClaims())))
        ).rejects.toThrow(ServiceUnavailableError);
        expect(logger.error).toHaveBeenCalled();
      }
    );

    test("returns 503 (try again), logged as a warning, while key refresh is rate limited", async () => {
      jest
        .spyOn(getVerifier(), "verify")
        .mockRejectedValueOnce(new WaitPeriodNotYetEndedJwkError("wait"));
      await expect(
        authenticateUser(eventWithToken(signToken(idTokenClaims())))
      ).rejects.toThrow(ServiceUnavailableError);
      expect(logger.warn).toHaveBeenCalledWith(
        "Could not verify token: signing key refresh is rate limited"
      );
      expect(logger.error).not.toHaveBeenCalled();
    });

    test("rejects a token whose key ID isn't one of Cognito's keys", async () => {
      jest
        .spyOn(getVerifier(), "verify")
        .mockRejectedValueOnce(new KidNotFoundInJwksError("made-up-kid"));
      await expect(
        authenticateUser(eventWithToken(signToken(idTokenClaims())))
      ).rejects.toThrow(UnauthenticatedError);
      expect(logger.warn).toHaveBeenCalledWith(
        "Rejected token: unknown signing key"
      );
    });

    test("lets unexpected errors through as-is (500), not as a bad token", async () => {
      jest
        .spyOn(getVerifier(), "verify")
        .mockRejectedValueOnce(new TypeError("bug"));
      await expect(
        authenticateUser(eventWithToken(signToken(idTokenClaims())))
      ).rejects.toThrow(TypeError);
    });

    test("logs a fixed reason, never values from the token", async () => {
      const token = signToken(idTokenClaims({ aud: "<attacker-controlled>" }));
      await expect(authenticateUser(eventWithToken(token))).rejects.toThrow(
        UnauthenticatedError
      );
      expect(logger.warn).toHaveBeenCalledWith(
        "Rejected token: wrong issuer, client, or token type"
      );
      const logged = JSON.stringify((logger.warn as jest.Mock).mock.calls);
      expect(logged).not.toContain("attacker-controlled");
    });

    test.each([
      ["missing", undefined, "is not set"],
      ["malformed", "not a pool id", "not a pool id"],
    ])(
      "a %s user pool ID gives callers a generic 500; details go to the logs",
      async (_case, poolId, loggedDetail) => {
        if (poolId === undefined) delete process.env.COGNITO_USER_POOL_ID;
        else process.env.COGNITO_USER_POOL_ID = poolId;
        await jest.isolateModulesAsync(async () => {
          const isolated = await import("../authorization");
          const { logger: isolatedLogger } = await import("../debug-lib");
          await expect(
            isolated.authenticateUser(
              eventWithToken(signToken(idTokenClaims()))
            )
          ).rejects.toThrow(/^Server configuration error$/);
          expect(isolatedLogger.error).toHaveBeenCalledWith(
            expect.stringContaining(loggedDetail)
          );
        });
      }
    );
  });

  /** A new container (nothing cached) with Cognito's key download stubbed.
   *  Call inside jest.isolateModulesAsync. */
  const loadFreshContainer = async () => {
    const tokens = await import("../../test-util/cognitoTokens");
    const auth = await import("../authorization");
    const errors = await import("aws-jwt-verify/error");
    const { SimpleFetcher } = await import("aws-jwt-verify/https");
    const { logger: isolatedLogger } = await import("../debug-lib");
    process.env.COGNITO_USER_POOL_ID = tokens.USER_POOL_ID;
    process.env.COGNITO_USER_POOL_CLIENT_ID = tokens.CLIENT_ID;
    return {
      tokens,
      auth,
      errors,
      isolatedLogger,
      download: jest.spyOn(SimpleFetcher.prototype, "fetch"),
      jwksBody: () =>
        new TextEncoder().encode(JSON.stringify(tokens.testJwks())).buffer,
    };
  };

  describe("made-up key IDs can't lock real users out", () => {
    test("a made-up key ID refreshes the key cache, so real tokens keep working", async () => {
      await jest.isolateModulesAsync(async () => {
        const { tokens, auth, download, jwksBody } = await loadFreshContainer();
        download.mockResolvedValue(jwksBody());
        const madeUpKid = (kid: string) =>
          tokens.signToken(tokens.idTokenClaims(), undefined, {
            alg: "RS256",
            kid,
            typ: "JWT",
          });

        // The attacker goes first: rejected, and starts the 10s penalty
        await expect(
          auth.authenticateUser(tokens.eventWithToken(madeUpKid("fake-1")))
        ).rejects.toThrow("Invalid authentication token");

        // Real users right after: their key is in the set that request cached
        for (let i = 0; i < 3; i++) {
          await expect(
            auth.authenticateUser(
              tokens.eventWithToken(tokens.signToken(tokens.idTokenClaims()))
            )
          ).resolves.toEqual(expect.objectContaining({ state: "AL" }));
        }

        // More made-up key IDs during the penalty don't trigger downloads
        await expect(
          auth.authenticateUser(tokens.eventWithToken(madeUpKid("fake-2")))
        ).rejects.toThrow("Unable to verify credentials right now");
        expect(download).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("Cognito outage, through the real library", () => {
    test("a failed key download returns 503, then recovers once Cognito is back", async () => {
      await jest.isolateModulesAsync(async () => {
        const { tokens, auth, errors, isolatedLogger, download, jwksBody } =
          await loadFreshContainer();
        download
          .mockRejectedValueOnce(new errors.FetchError("jwks.json", "timeout"))
          .mockResolvedValue(jwksBody());
        const validToken = () =>
          tokens.eventWithToken(tokens.signToken(tokens.idTokenClaims()));

        await expect(auth.authenticateUser(validToken())).rejects.toThrow(
          "Unable to verify credentials right now"
        );
        expect(isolatedLogger.error).toHaveBeenCalled();

        // A failed download sets no penalty, so the next request just retries
        await expect(auth.authenticateUser(validToken())).resolves.toEqual(
          expect.objectContaining({ state: "AL" })
        );
        expect(download).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe("issuer format", () => {
    test("a global-format issuer is rejected (401) without downloading keys", async () => {
      await jest.isolateModulesAsync(async () => {
        // A stand-in for Cognito that behaves like ours: the regional key
        // URL works, the global-format one returns 403
        const { tokens, auth, errors, isolatedLogger, download, jwksBody } =
          await loadFreshContainer();
        download.mockImplementation(async (uri: string) => {
          if (uri.includes("issuer-cognito-idp")) {
            throw new errors.NonRetryableFetchError(uri, "403 Forbidden");
          }
          return jwksBody();
        });

        const globalIssuer = `https://issuer-cognito-idp.us-east-1.amazonaws.com/${tokens.USER_POOL_ID}`;
        for (let i = 0; i < 3; i++) {
          await expect(
            auth.authenticateUser(
              tokens.eventWithToken(
                tokens.signToken(tokens.idTokenClaims({ iss: globalIssuer }))
              )
            )
          ).rejects.toThrow("Invalid authentication token");
        }
        expect(download).not.toHaveBeenCalled();
        expect(isolatedLogger.error).not.toHaveBeenCalled();
        expect(isolatedLogger.warn).toHaveBeenCalledWith(
          "Rejected token: wrong issuer, client, or token type"
        );

        await expect(
          auth.authenticateUser(
            tokens.eventWithToken(tokens.signToken(tokens.idTokenClaims()))
          )
        ).resolves.toEqual(expect.objectContaining({ state: "AL" }));
      });
    });
  });

  describe("isAuthorized", () => {
    const stateUser = new UserCredentials({
      "custom:cms_roles": IdmRoles.STATE,
      "custom:cms_state": "AL",
    });
    const admin = new UserCredentials({
      "custom:cms_roles": IdmRoles.PROJECT_OFFICER,
    });
    const withState = (state?: string) =>
      ({
        ...testEvent,
        pathParameters: state ? { state } : null,
      }) as APIGatewayProxyEvent;

    test("state user may access their own state", () => {
      expect(isAuthorized(withState("AL"), stateUser)).toBe(true);
      expect(isAuthorized(withState("al"), stateUser)).toBe(true);
    });

    test("state user may not access another state", () => {
      expect(isAuthorized(withState("CA"), stateUser)).toBe(false);
    });

    test("state user may call routes without a state", () => {
      expect(isAuthorized(withState(), stateUser)).toBe(true);
    });

    test("state user with no assigned state is denied on state routes", () => {
      const noState = new UserCredentials({
        "custom:cms_roles": IdmRoles.STATE,
      });
      expect(isAuthorized(withState("AL"), noState)).toBe(false);
      expect(isAuthorized(withState("CA"), noState)).toBe(false);
    });

    test("state user with no assigned state may still call state-less routes", () => {
      const noState = new UserCredentials({
        "custom:cms_roles": IdmRoles.STATE,
      });
      expect(isAuthorized(withState(), noState)).toBe(true);
    });

    test("user with no CARTS role is denied", () => {
      const noRole = new UserCredentials({ "custom:cms_roles": "other-app" });
      expect(isAuthorized(withState("AL"), noRole)).toBe(false);
    });

    test("user with an unrecognized CARTS role is denied", () => {
      const unknown = new UserCredentials({
        "custom:cms_roles": "mdctcarts-made-up",
      });
      expect(isAuthorized(withState("AL"), unknown)).toBe(false);
    });

    test("CMS users may access any state", () => {
      expect(isAuthorized(withState("CA"), admin)).toBe(true);
    });
  });

  describe("mapIdmRoleToAppRole", () => {
    test("should return AppRole if IdmRole exists", () => {
      const result = mapIdmRoleToAppRole(IdmRoles.APPROVER);
      expect(result).toEqual(AppRoles.CMS_APPROVER);
    });

    test("should return undefined for an unknown role", () => {
      expect(mapIdmRoleToAppRole("mdctcarts-made-up" as IdmRoles)).toBe(
        undefined
      );
    });
  });
});
