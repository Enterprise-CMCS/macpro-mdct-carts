/* eslint-disable no-console */
import { APIGatewayProxyEvent } from "aws-lambda"; // eslint-disable-line no-unused-vars
import { testEvent } from "../../../test-util/testEvents";
import { UserRoles } from "../../../types";
import { print } from "../printPdf";
import axios from "axios";
import AWS from "aws-sdk";

const originalError = console.error; // cache to restore, we're testing an error
jest.mock("axios", () => jest.fn());
jest.mock("../../../libs/authorization", () => ({
  isAuthorized: jest.fn().mockReturnValue(true),
  getUserCredentialsFromJwt: jest.fn().mockReturnValue({
    role: UserRoles.STATE,
    state: "AL",
  }),
}));
jest.mock("aws-sdk", () => ({
  __esModule: true,
  default: {
    config: {
      credentials: {
        secretAccessKey: "super", // pragma: allowlist secret
        accessKeyId: "secret", // pragma: allowlist secret
      },
    },
  },
}));

describe("Test Print PDF handler", () => {
  beforeEach(() => {
    console.error = jest.fn();
  });
  afterEach(() => {
    console.error = originalError;
  });

  test("should make a request to prince and return data", async () => {
    const event: APIGatewayProxyEvent = {
      ...testEvent,
      pathParameters: {},
      body: `{"encodedHtml": "HtMl"}`,
    };

    (axios as any).mockResolvedValue({
      data: "transformed!",
    });
    const res = await print(event, null);

    expect(axios).toHaveBeenCalledWith(
      expect.objectContaining({ body: "HtMl", method: "POST" })
    );
    expect(res.statusCode).toBe(200);
    expect(res.body).toContain("transformed!");
  });

  test("missing encoded Html should throw an error", async () => {
    const event: APIGatewayProxyEvent = {
      ...testEvent,
      pathParameters: {},
      body: `{}`,
    };

    const res = await print(event, null);
    expect(res.statusCode).toBe(500);
  });

  test("missing AWS credentials should throw an error", async () => {
    const event: APIGatewayProxyEvent = {
      ...testEvent,
      pathParameters: {},
      body: `{"encodedHtml": "HtMl"}`,
    };
    AWS.config.credentials = null;

    const res = await print(event, null);
    expect(res.statusCode).toBe(500);
  });
});
