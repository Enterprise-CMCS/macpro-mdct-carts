import { expect, test } from "@playwright/test";
import {
  requestWithCustomToken,
  buildForgedJwt,
  authenticatedRawRequest,
} from "../../utils/requests";

test.describe("Authentic JWT should return a 200", () => {
  test("For a GET request from an AL State User for a AL resource", async () => {
    const response = await authenticatedRawRequest("GET", "/section/2024/AL");
    expect(response.status).toBe(200);
  });
});

test.describe("Forged JWT should return a 403", () => {
  test("For a GET request from an AL State User for a TX resource", async () => {
    const response = await requestWithCustomToken(
      "GET",
      "/section/2024/TX",
      buildForgedJwt()
    );
    expect(response.status).not.toBe(200);
  });

  /*
      ToDo: Add tests for other HTTP methods and endpoints with forged JWT
      - POST requests to /state_status with forged JWTs
      - PUT requests to /save_report with forged JWTs
      - POST requests to /formTemplates with forged JWTs
      */
});
