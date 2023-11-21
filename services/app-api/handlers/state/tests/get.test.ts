/* eslint-disable no-console */
import { getStates } from "../get";
import dbLib from "../../../libs/dynamodb-lib";
import { APIGatewayProxyEvent } from "../../../types";
import { testEvent } from "../../../test-util/testEvents";

jest.mock("../../../libs/dynamodb-lib", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    scan: jest.fn().mockReturnValue({
      Items: [
        {
          programType: "combo",
          code: "AL",
          name: "Alabama",
          programNames: {},
          fmapSet: [{}],
          acsSet: [{}],
        },
      ],
    }),
  },
}));

jest.mock("../../../libs/authorization", () => ({
  isAuthorized: jest.fn().mockReturnValue(true),
}));

jest.mock("../../dynamoUtils/convertToDynamoExpressionVars", () => ({
  __esModule: true,
  convertToDynamoExpression: jest.fn(),
}));

describe("Test Get States Handlers", () => {
  test("fetching states should return all state data", async () => {
    const event: APIGatewayProxyEvent = {
      ...testEvent,
    };

    const res = await getStates(event, null);

    expect(res.statusCode).toBe(200);
    expect(dbLib.scan).toHaveBeenCalledWith({
      TableName: undefined,
    });
  });
});
