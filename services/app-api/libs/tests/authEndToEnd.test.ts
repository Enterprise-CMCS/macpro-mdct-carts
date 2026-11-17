// The CCIC pen-test scenarios through real handlers and real token
// verification. Only DynamoDB and logging are mocked.
import { getSections } from "../../handlers/section/get";
import { updateSections } from "../../handlers/section/update";
import dynamoDb from "../dynamodb-lib";
import { getVerifier } from "../authorization";
import { FetchError } from "aws-jwt-verify/error";
import {
  attackerKey,
  callerProvider,
  eventWithToken,
  idTokenClaims,
  ISSUER,
  setUpTestVerifier,
  signToken,
  SUB,
  tamperedToken,
  unsignedAdminToken,
} from "../../test-util/cognitoTokens";
import { IdmRoles } from "../../types";

jest.mock("../debug-lib", () => ({
  init: jest.fn(),
  debug: jest.fn(),
  error: jest.fn(),
  flush: jest.fn(),
  logger: {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock("../dynamodb-lib", () => ({
  __esModule: true,
  default: {
    query: jest.fn().mockResolvedValue({ Items: [{ sectionId: 0 }] }),
    update: jest.fn(),
  },
}));

const sectionsEvent = (
  token: string | undefined,
  state: string,
  callerSub: string = SUB
) =>
  eventWithToken(token, {
    pathParameters: { year: "2026", state },
    requestContext: {
      identity: { cognitoAuthenticationProvider: callerProvider(callerSub) },
    },
  });

const azToken = () => signToken(idTokenClaims({ "custom:cms_state": "AZ" }));

const tamperedAzToken = (overrides: object) =>
  tamperedToken(
    idTokenClaims({ "custom:cms_state": "AZ" }),
    idTokenClaims(overrides)
  );

describe("Auth end to end through handlers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setUpTestVerifier();
  });

  describe("GET /section/{year}/{state} (pen-test endpoint)", () => {
    test("valid state user can read their own state", async () => {
      const token = azToken();
      const res = await getSections(sectionsEvent(token, "AZ"), null);
      expect(res.statusCode).toBe(200);
      expect(dynamoDb.query).toHaveBeenCalled();
    });

    test("valid state user cannot read another state", async () => {
      const token = azToken();
      const res = await getSections(sectionsEvent(token, "CA"), null);
      expect(res.statusCode).toBe(403);
      expect(dynamoDb.query).not.toHaveBeenCalled();
    });

    test("valid CMS admin can read any state", async () => {
      const token = signToken(
        idTokenClaims({
          "custom:cms_roles": IdmRoles.PROJECT_OFFICER,
          "custom:cms_state": undefined,
        })
      );
      const res = await getSections(sectionsEvent(token, "CA"), null);
      expect(res.statusCode).toBe(200);
    });

    test("CCIC repro: unsigned alg:none project-officer token is rejected", async () => {
      // Real issuer and sub plus a junk signature, so only the signature
      // check can stop it
      const res = await getSections(
        sectionsEvent(
          `${unsignedAdminToken({ sub: SUB, iss: ISSUER })}junk-signature`,
          "CA"
        ),
        null
      );
      expect(res.statusCode).toBe(401);
      expect(dynamoDb.query).not.toHaveBeenCalled();
    });

    test("real token edited to claim project officer is rejected", async () => {
      const token = tamperedAzToken({
        "custom:cms_roles": IdmRoles.PROJECT_OFFICER,
      });
      const res = await getSections(sectionsEvent(token, "CA"), null);
      expect(res.statusCode).toBe(401);
      expect(dynamoDb.query).not.toHaveBeenCalled();
    });

    test("valid token sent with another user's SigV4 credentials is rejected", async () => {
      const token = azToken();
      const res = await getSections(
        sectionsEvent(token, "AZ", "someone-else"),
        null
      );
      expect(res.statusCode).toBe(401);
    });

    test("Cognito outage returns 503 so it isn't mistaken for a bad token", async () => {
      jest
        .spyOn(getVerifier(), "verify")
        .mockRejectedValueOnce(
          new FetchError("https://cognito-idp/jwks.json", "timeout")
        );
      const token = azToken();
      const res = await getSections(sectionsEvent(token, "AZ"), null);
      expect(res.statusCode).toBe(503);
      expect(dynamoDb.query).not.toHaveBeenCalled();
    });

    test("missing token is rejected with 401, not a crash", async () => {
      const res = await getSections(sectionsEvent(undefined, "AZ"), null);
      expect(res.statusCode).toBe(401);
    });
  });

  describe("PUT /save_report/{year}/{state} (write)", () => {
    const saveEvent = (token: string) => ({
      ...sectionsEvent(token, "CA"),
      httpMethod: "PUT",
      body: "[]",
    });

    test("state user token edited to another state cannot overwrite it", async () => {
      const res = await updateSections(
        saveEvent(tamperedAzToken({ "custom:cms_state": "CA" })),
        null
      );
      expect(res.statusCode).toBe(401);
      expect(dynamoDb.update).not.toHaveBeenCalled();
    });

    test("state user token for another state signed with a non-Cognito key is rejected", async () => {
      const forged = signToken(
        idTokenClaims({ "custom:cms_state": "CA" }),
        attackerKey
      );
      const res = await updateSections(saveEvent(forged), null);
      expect(res.statusCode).toBe(401);
      expect(dynamoDb.update).not.toHaveBeenCalled();
    });

    test("valid state user cannot write to another state", async () => {
      const token = azToken();
      const res = await updateSections(saveEvent(token), null);
      expect(res.statusCode).toBe(403);
      expect(dynamoDb.update).not.toHaveBeenCalled();
    });
  });
});
