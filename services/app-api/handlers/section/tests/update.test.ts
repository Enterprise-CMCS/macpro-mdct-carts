import { updateSections } from "../update";
import dbLib from "../../../libs/dynamodb-lib";
import { APIGatewayProxyEvent } from "aws-lambda"; // eslint-disable-line no-unused-vars
import { testEvent } from "../../../test-util/testEvents";
import { convertToDynamoExpression } from "../../dynamoUtils/convertToDynamoExpressionVars";

jest.mock("../../../libs/dynamodb-lib", () => ({
  __esModule: true,
  default: {
    update: jest.fn(),
    scan: jest.fn().mockReturnValue({ Items: [{ status: "not_started" }] }),
  },
}));

jest.mock("../../../libs/authorization", () => ({
  __esModule: true,
  isAuthorized: jest.fn().mockReturnValue(true),
}));

jest.mock("../../dynamoUtils/convertToDynamoExpressionVars", () => ({
  __esModule: true,
  convertToDynamoExpression: jest.fn(),
}));

describe("Test Update Sections Handler", () => {
  test("sections should batch update and update state status if not started", async () => {
    const event: APIGatewayProxyEvent = {
      ...testEvent,
      body: `[{"pk": "AL-2022", "sectionId": 0, "contents": {"test": "test"}, "year": 2022, "stateId": "AL"}]`,
      pathParameters: { year: "2022", state: "AL" },
    };

    const res = await updateSections(event, null);

    expect(res.statusCode).toBe(200);
    expect(convertToDynamoExpression).toHaveBeenNthCalledWith(
      1,
      {
        contents: { test: "test" },
      },
      "post"
    );
    expect(dbLib.update).toHaveBeenCalledWith({
      Key: {
        pk: "AL-2022",
        sectionId: 0,
      },
    });
    expect(convertToDynamoExpression).toHaveBeenNthCalledWith(
      2,
      {
        stateId: "AL",
        year: 2022,
      },
      "list"
    );
    expect(convertToDynamoExpression).toHaveBeenNthCalledWith(
      3,
      {
        status: "in_progress",
        lastChanged: new Date().toString(),
      },
      "post"
    );
  });
});
