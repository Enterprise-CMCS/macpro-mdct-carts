import { testEvent } from "../../test-util/testEvents";
import { isAuthorized } from "../authorization";
import { IdmRoles } from "../../types";

const mockedDecode = jest.fn();

jest.mock("jwt-decode", () => ({
  __esModule: true,
  default: () => {
    return mockedDecode();
  },
}));

describe("Authorization Lib Function", () => {
  describe("State User Tests", () => {
    const event = { ...testEvent };

    beforeEach(() => {
      event.httpMethod = "GET";
      event.headers = { "x-api-key": "test" };
      event.pathParameters = { state: "AL" };
      mockedDecode.mockReturnValue({
        "custom:cms_roles": IdmRoles.STATE,
        "custom:cms_state": "AL",
      });
    });

    test("authorization should fail from missing jwt key", () => {
      event.headers = {};
      expect(isAuthorized(event)).toBeFalsy();
    });

    test("authorization should pass", () => {
      expect(isAuthorized(event)).toBeTruthy();
    });

    test("authorization should fail from mismatched states", () => {
      event.pathParameters = { state: "FL" };
      expect(isAuthorized(event)).toBeFalsy();
    });

    test("authorization should pass for GET, but skip if check from missing requestState", () => {
      event.pathParameters = null;
      expect(isAuthorized(event)).toBeTruthy();
    });
  });

  describe("Non-State User Tests", () => {
    const event = { ...testEvent };

    beforeEach(() => {
      event.httpMethod = "GET";
      event.headers = { "x-api-key": "test" };
      event.pathParameters = { state: "AL" };
      mockedDecode.mockReturnValue({
        "custom:cms_roles": IdmRoles.BUSINESS_OWNER_REP,
        "custom:cms_state": "AL",
      });
    });

    test("authorization should pass", () => {
      expect(isAuthorized(event)).toBeTruthy();
    });

    test("authorization should succeed on non-GET methods", () => {
      event.httpMethod = "POST";
      expect(isAuthorized(event)).toBeTruthy();
    });
  });
});
