/* eslint-disable no-console */
jest.useFakeTimers();
import { getFiscalYearTemplateLink } from "../get";
import { APIGatewayProxyEvent } from "../../../types";
import { testEvent } from "../../../test-util/testEvents";

jest.mock("../../../libs/authorization", () => ({
  isAuthorized: jest.fn().mockReturnValue(true),
}));

jest.mock("../../../libs/s3-lib", () => ({
  getSignedDownloadUrl: jest.fn().mockReturnValue("mock url"),
}));

describe("Test Get Fiscal Year Template Handlers", () => {
  test("fetching fiscal year template should return a link", async () => {
    const event: APIGatewayProxyEvent = {
      ...testEvent,
    };

    event.pathParameters = { year: "2024" };

    const res = await getFiscalYearTemplateLink(event, null);
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body)).toEqual({
      psurl: "mock url",
    });
  });
});
