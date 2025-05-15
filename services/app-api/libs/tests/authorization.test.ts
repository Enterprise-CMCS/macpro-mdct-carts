import { testEvent } from "../../test-util/testEvents";
import {
  getUserCredentialsFromJwt,
  getUserNameFromJwt,
  isAuthorized,
  mapIdmRoleToAppRole,
  UserCredentials,
} from "../authorization";
import { AppRoles, IdmRoles, APIGatewayProxyEvent } from "../../types";

const mockedDecode = jest.fn();

jest.mock("jwt-decode", () => ({
  __esModule: true,
  jwtDecode: () => {
    return mockedDecode();
  },
}));

let verifyMock = jest.fn();
verifyMock.mockImplementation(() => {
  return true;
});
jest.mock("aws-jwt-verify", () => ({
  __esModule: true,
  CognitoJwtVerifier: {
    create: jest.fn().mockImplementation(() => ({
      verify: verifyMock,
    })),
  },
}));

describe("Authorization Lib", () => {
  describe("isAuthorized State User Tests", () => {
    const event = { ...testEvent };

    beforeEach(() => {
      process.env["COGNITO_USER_POOL_ID"] = "fakeId";
      process.env["COGNITO_USER_POOL_CLIENT_ID"] = "fakeClientId";
      process.env.STAGE = "test";
      event.httpMethod = "GET";
      event.headers = { "x-api-key": "test" };
      event.pathParameters = { state: "AL" };
      mockedDecode.mockReturnValue({
        "custom:cms_roles": IdmRoles.STATE,
        "custom:cms_state": "AL",
      });
    });

    test("authorization should fail from missing jwt key", async () => {
      event.headers = {};
      expect(await isAuthorized(event)).toBeFalsy();
    });

    test("authorization should pass", async () => {
      expect(await isAuthorized(event)).toBeTruthy();
    });

    test("authorization should fail from mismatched states", async () => {
      event.pathParameters = { state: "FL" };
      expect(await isAuthorized(event)).toBeFalsy();
    });

    test("authorization should pass for GET, but skip if check from missing requestState", async () => {
      event.pathParameters = null;
      expect(await isAuthorized(event)).toBeTruthy();
    });
  });

  describe("isAuthorized Non-State User Tests", () => {
    const event = { ...testEvent };

    beforeEach(() => {
      event.httpMethod = "GET";
      event.headers = { "x-api-key": "test" };
      event.pathParameters = { state: "AL" };
      process.env["COGNITO_USER_POOL_ID"] = "fakeId";
      process.env["COGNITO_USER_POOL_CLIENT_ID"] = "fakeClientId";
      mockedDecode.mockReturnValue({
        "custom:cms_roles": IdmRoles.BUSINESS_OWNER_REP,
        "custom:cms_state": "AL",
      });
    });

    test("authorization should pass", async () => {
      expect(await isAuthorized(event)).toBeTruthy();
    });

    test("authorization should succeed on non-GET methods", async () => {
      event.httpMethod = "POST";
      expect(await isAuthorized(event)).toBeTruthy();
    });

    test("authorization should catch given an invalid jwt", async () => {
      verifyMock.mockImplementationOnce(() => {
        throw Error("Bad token, bad!");
      });
      expect(await isAuthorized(event)).toBeFalsy();
    });
  });

  describe("getUserCredentialsFromJwt", () => {
    const event = { ...testEvent };
    const decodedUser = {
      "custom:cms_roles": IdmRoles.STATE,
      "custom:cms_state": "AL",
    };

    beforeEach(() => {
      event.httpMethod = "GET";
      event.headers = { "x-api-key": "test" };
      event.pathParameters = { state: "AL" };
      mockedDecode.mockReturnValue(decodedUser);
    });

    it("Should return empty user crentials when api key is missing", () => {
      event.headers = {};
      const result = getUserCredentialsFromJwt(event);
      expect(result).toEqual(new UserCredentials());
    });
    it("should return decoded and transformed credentials when an api key exists", () => {
      const result = getUserCredentialsFromJwt(event);
      expect(result).toEqual(
        expect.objectContaining({
          role: AppRoles.STATE_USER,
          state: "AL",
        })
      );
    });
  });

  describe("getUserNameFromJwt", () => {
    const event = { ...testEvent };
    const decodedUser = {
      "custom:cms_roles": IdmRoles.STATE,
      "custom:cms_state": "AL",
      given_name: "Amos",
      family_name: "Burton",
    };

    beforeEach(() => {
      event.httpMethod = "GET";
      event.headers = { "x-api-key": "test" };
      event.pathParameters = { state: "AL" };
      mockedDecode.mockReturnValue(decodedUser);
    });

    it("should not return the user's name if header or x-api-key is missing", () => {
      event.headers = {};
      const result = getUserNameFromJwt(event);
      expect(result).not.toEqual("Amos Burton");
      expect(result).toEqual("branchUser");

      const resultHeaderless = getUserNameFromJwt({} as APIGatewayProxyEvent);
      expect(resultHeaderless).toEqual("branchUser");
    });
    it("should compose a given and family name into a username", () => {
      const result = getUserNameFromJwt(event);
      expect(result).toEqual("Amos Burton");
    });
    it("should fallback to identities and userId if other info is missing", () => {
      mockedDecode.mockReturnValueOnce({
        "custom:cms_roles": IdmRoles.STATE,
        "custom:cms_state": "AL",
        identities: [{ userId: "amos@rocinante.io" }],
      });
      const result = getUserNameFromJwt(event);
      expect(result).toEqual("amos@rocinante.io");
    });
    it("should return default text if all else is missing", () => {
      mockedDecode.mockReturnValueOnce({
        "custom:cms_roles": IdmRoles.STATE,
        "custom:cms_state": "AL",
      });
      const result = getUserNameFromJwt(event);
      expect(result).toEqual("branchUser");
    });
  });

  describe("mapIdmRoleToAppRole", () => {
    it("should return AppRole if IdmRole exists", () => {
      const result = mapIdmRoleToAppRole(IdmRoles.APPROVER);
      expect(result).toEqual(AppRoles.CMS_APPROVER);
    });
  });
});
