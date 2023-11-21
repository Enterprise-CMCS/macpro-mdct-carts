/* eslint-disable no-console */
jest.useFakeTimers();
import { getFiscalYearTemplateLink } from "../get";
import { APIGatewayProxyEvent } from "../../../types";
import { testEvent } from "../../../test-util/testEvents";

jest.mock("../../../libs/authorization", () => ({
  isAuthorized: jest.fn().mockReturnValue(true),
}));

describe("Test Get Fiscal Year Template Handlers", () => {
  test("fetching fiscal year template should return a link", async () => {
    const event: APIGatewayProxyEvent = {
      ...testEvent,
    };

    const res = await getFiscalYearTemplateLink(event, null);
    expect(res.statusCode).toBe(200);
    expect(res.body).toContain("s3.amazonaws.com");
  });
});
