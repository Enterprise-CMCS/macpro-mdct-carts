/* eslint-disable no-console */
jest.useFakeTimers();
import { getFiscalYearTemplateLink } from "../get";
import { APIGatewayProxyEvent } from "aws-lambda"; // eslint-disable-line no-unused-vars
import { testEvent } from "../../../test-util/testEvents";

jest.mock("../../../libs/authorization", () => ({
  isAuthorized: jest.fn().mockReturnValue(true),
}));

describe("Test Get Fiscal Year Template Handlers", () => {
  test("fetching fiscal year template should a signed link to the template", async () => {
    const event: APIGatewayProxyEvent = {
      ...testEvent,
    };

    const res = await getFiscalYearTemplateLink(event, null);
    expect(res.statusCode).toBe(200);
    expect(res.body).toContain("s3.amazonaws.com/FFY_2021_CARTS_Template.pdf?");
  });
});
