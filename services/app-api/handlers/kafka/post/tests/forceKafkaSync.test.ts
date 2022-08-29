/* eslint-disable no-console */
import { APIGatewayProxyEvent } from "aws-lambda"; // eslint-disable-line no-unused-vars
import dynamodbLib from "../../../../libs/dynamodb-lib";
import { testEvent } from "../../../../test-util/testEvents";
import { AppRoles } from "../../../../types";
import { main } from "../forceKafkaSync";

const mockedRoleFn = jest.fn();
const originalError = console.error; //cache to restore, we're testing an error

jest.mock("../../../../libs/dynamodb-lib", () => ({
  batchWriteItem: jest.fn().mockReturnValue(Promise.resolve(true)),
  scan: jest
    .fn()
    .mockReturnValue({ Items: [], LastEvaluatedKey: "AL" })
    .mockReturnValueOnce({
      Items: [
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
      ],
      LastEvaluatedKey: "AL",
    })
    .mockReturnValueOnce({
      Items: [
        {
          stateId: "AK",
          status: "in_progress",
          year: 2022,
          programType: "combo",
          username: "al@test.com",
          lastChanged: "2022-01-04 18:28:18.524133+00",
        },
      ],
    })
    .mockReturnValueOnce({
      Items: [
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
      ],
    }),
}));

jest.mock("../../../../libs/authorization", () => ({
  __esModule: true,
  isAuthorized: jest.fn().mockReturnValue(true),
  getUserCredentialsFromJwt: () => {
    return mockedRoleFn();
  },
}));

describe("Test kafka manual sync", () => {
  beforeEach(() => {
    console.error = jest.fn();
    mockedRoleFn.mockReturnValue({
      role: AppRoles.CMS_ADMIN,
    });
  });
  afterEach(() => {
    console.error = originalError;
  });

  test("calls to scan and batch write", async () => {
    const event: APIGatewayProxyEvent = {
      ...testEvent,
      pathParameters: {},
      body: `{}`,
    };

    // Run
    await main(event, null);

    expect(dynamodbLib.scan).toHaveBeenCalledTimes(3);
    expect(dynamodbLib.batchWriteItem).toHaveBeenCalledTimes(3);
    const batchWriteMocked = dynamodbLib.batchWriteItem as jest.MockedFunction<
      typeof dynamodbLib.batchWriteItem
    >;
    expect(
      batchWriteMocked.mock.calls[0][0]["RequestItems"]["undefined"][0][
        "PutRequest"
      ]["Item"]
    ).toHaveProperty("lastSynced");
  });
});
