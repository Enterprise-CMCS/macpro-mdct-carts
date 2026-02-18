import { testEvent } from "../../../test-util/testEvents";
import { AppRoles, APIGatewayProxyEvent } from "../../../types";
import dynamodbLib from "../../../libs/dynamodb-lib";
import { post } from "../post";

const mockedRoleFn = jest.fn();
const originalError = console.error; // cache to restore, we're testing an error
jest.mock("../../../libs/dynamodb-lib", () => ({
  __esModule: true,
  default: {
    batchWriteItem: jest.fn(),
    scanAll: jest
      .fn()
      .mockResolvedValue([])
      .mockResolvedValueOnce([
        {
          programType: "combo",
          code: "AL",
          name: "Alabama",
          programNames: {},
        },
        {
          programType: "combo",
          code: "AK",
          name: "Alaska",
          programNames: {},
        },
      ])
      .mockResolvedValueOnce([
        {
          stateId: "AK",
          status: "in_progress",
          year: 2022,
          programType: "combo",
          username: "al@test.com",
          lastChanged: "2022-01-04 18:28:18.524133+00",
        },
      ])
      .mockResolvedValueOnce([
        {
          year: 2022,
          sectionId: 1,
          contents: {
            section: {
              id: "2022-01",
              type: "section",
              year: 2022,
              state: null,
              title: "Program Fees and Policy Changes",
              valid: null,
              ordinal: 1,
              subsections: [],
            },
          },
        },
      ]),
  },
}));

jest.mock("../../../libs/authorization", () => ({
  __esModule: true,
  isAuthorized: jest.fn().mockReturnValue(true),
  getUserCredentialsFromJwt: () => {
    return mockedRoleFn();
  },
}));

describe("Test Form Template Generation Handlers", () => {
  beforeEach(() => {
    console.error = jest.fn();
    mockedRoleFn.mockReturnValue({
      role: AppRoles.CMS_ADMIN,
    });
  });
  afterEach(() => {
    console.error = originalError;
  });

  test("Forms for uncreated states <=> years should be created", async () => {
    const event: APIGatewayProxyEvent = {
      ...testEvent,
      pathParameters: {},
      body: `{"year": 2022}`,
    };

    const res = await post(event, null);
    expect(res.statusCode).toBe(200);
    expect(dynamodbLib.batchWriteItem).toHaveBeenCalledTimes(2); // Save state status & forms
    expect(res.body).toContain("AL");
    expect(res.body).not.toContain("AK"); // AK already has existing template and should not generate
  });

  test("State users should throw an unauthorized error when calling the method", async () => {
    const event: APIGatewayProxyEvent = {
      ...testEvent,
      pathParameters: {},
      body: `{"year": 2022}`,
    };

    mockedRoleFn.mockReturnValue({
      role: AppRoles.STATE_USER,
    });
    const res = await post(event, null);

    expect(res.statusCode).toBe(403);
  });
});
