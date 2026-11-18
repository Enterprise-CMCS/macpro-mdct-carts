import { getSections } from "../../handlers/section/get";
import dynamoDb from "../dynamodb-lib";
import {
  callerProvider,
  eventWithToken,
  idTokenClaims,
  ISSUER,
  nonCognitoKey,
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
  },
}));

const readReport = (token: string, state: string, callerSub: string = SUB) =>
  getSections(
    eventWithToken(token, {
      pathParameters: { year: "2026", state },
      requestContext: {
        identity: { cognitoAuthenticationProvider: callerProvider(callerSub) },
      },
    }),
    null
  );

const arizonaUserToken = () =>
  signToken(idTokenClaims({ "custom:cms_state": "AZ" }));

describe("Reading a report with real token verification", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setUpTestVerifier();
  });

  test("a state user can read their own state's report", async () => {
    const res = await readReport(arizonaUserToken(), "AZ");
    expect(res.statusCode).toBe(200);
    expect(dynamoDb.query).toHaveBeenCalled();
  });

  test("a state user cannot read another state's report", async () => {
    const res = await readReport(arizonaUserToken(), "CA");
    expect(res.statusCode).toBe(403);
    expect(dynamoDb.query).not.toHaveBeenCalled();
  });

  test("a CMS admin can read any state's report", async () => {
    const adminToken = signToken(
      idTokenClaims({
        "custom:cms_roles": IdmRoles.PROJECT_OFFICER,
        "custom:cms_state": undefined,
      })
    );
    const res = await readReport(adminToken, "CA");
    expect(res.statusCode).toBe(200);
  });

  test("a token with no signature that claims to be an admin is rejected", async () => {
    const token = `${unsignedAdminToken({ sub: SUB, iss: ISSUER })}junk-signature`;
    const res = await readReport(token, "CA");
    expect(res.statusCode).toBe(401);
    expect(dynamoDb.query).not.toHaveBeenCalled();
  });

  test("a real token edited to claim the admin role is rejected", async () => {
    const token = tamperedToken({
      "custom:cms_roles": IdmRoles.PROJECT_OFFICER,
    });
    const res = await readReport(token, "CA");
    expect(res.statusCode).toBe(401);
    expect(dynamoDb.query).not.toHaveBeenCalled();
  });

  test("a token for another state signed with a key Cognito didn't issue is rejected", async () => {
    const token = signToken(
      idTokenClaims({ "custom:cms_state": "CA" }),
      nonCognitoKey
    );
    const res = await readReport(token, "CA");
    expect(res.statusCode).toBe(401);
    expect(dynamoDb.query).not.toHaveBeenCalled();
  });

  test("a valid token sent with another user's AWS credentials is rejected", async () => {
    const res = await readReport(arizonaUserToken(), "AZ", "someone-else");
    expect(res.statusCode).toBe(401);
    expect(dynamoDb.query).not.toHaveBeenCalled();
  });
});
