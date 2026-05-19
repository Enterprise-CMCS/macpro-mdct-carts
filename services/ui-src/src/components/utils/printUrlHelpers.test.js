import { AppRoles } from "../../types";
import {
  getPrintRouteContext,
  isSectionId,
  isYear,
  parseStateId,
  parseSubsectionMarker,
  parseYear,
  printFormUrl,
} from "./printUrlHelpers";

describe("predicates", () => {
  test("isYear accepts four-digit strings only", () => {
    expect(isYear("2021")).toBe(true);
    expect(isYear("21")).toBe(false);
    expect(isYear(2021)).toBe(false);
  });

  test("isSectionId requires the year-ordinal shape", () => {
    expect(isSectionId("2021-03")).toBe(true);
    expect(isSectionId("2021-3")).toBe(false);
    expect(isSectionId("2021-03-a")).toBe(false);
  });
});

describe("parsers", () => {
  test("parseStateId uppercases valid two-letter codes", () => {
    expect(parseStateId("al")).toBe("AL");
    expect(parseStateId("AL")).toBe("AL");
  });

  test("parseStateId rejects anything else", () => {
    expect(parseStateId("A<script>")).toBeNull();
    expect(parseStateId(undefined)).toBeNull();
  });

  test("parseSubsectionMarker lowercases valid markers", () => {
    expect(parseSubsectionMarker("B")).toBe("b");
    expect(parseSubsectionMarker("bb")).toBeNull();
  });

  test("parseYear accepts numbers and strings", () => {
    expect(parseYear(2021)).toBe("2021");
    expect(parseYear("2021")).toBe("2021");
    expect(parseYear("nope")).toBeNull();
  });
});

describe("getPrintRouteContext()", () => {
  test("parses state-user section routes", () => {
    expect(
      getPrintRouteContext(AppRoles.STATE_USER, "/sections/2021/03/B")
    ).toEqual({
      routeYear: "2021",
      routeSectionOrdinal: "03",
      routeSubsectionMarker: "b",
    });
  });

  test("parses admin section routes", () => {
    expect(
      getPrintRouteContext(AppRoles.CMS_ADMIN, "/views/sections/al/2021/00/a")
    ).toEqual({
      routeStateId: "AL",
      routeYear: "2021",
      routeSectionOrdinal: "00",
      routeSubsectionMarker: "a",
    });
  });

  test("drops invalid route segments", () => {
    expect(
      getPrintRouteContext(AppRoles.CMS_ADMIN, "/views/sections/AL/2021/0%26/a")
    ).toEqual({
      routeStateId: "AL",
      routeYear: "2021",
      routeSectionOrdinal: null,
      routeSubsectionMarker: "a",
    });
  });

  test("returns an empty object for unrelated paths", () => {
    expect(getPrintRouteContext(AppRoles.STATE_USER, "/get-help")).toEqual({});
    expect(getPrintRouteContext(AppRoles.CMS_ADMIN, "/state-reports")).toEqual(
      {}
    );
  });
});

describe("printFormUrl()", () => {
  test("builds a print url for valid input", () => {
    expect(printFormUrl("2021", "al", "2021-03", "2021-03-b")).toBe(
      "/print?year=2021&state=AL&sectionId=2021-03&subsectionId=2021-03-b"
    );
  });

  test("drops invalid optional params", () => {
    expect(printFormUrl("2021", "AL", "2021-&03", "2021-03-<")).toBe(
      "/print?year=2021&state=AL"
    );
  });

  test("falls back to the print root when required params are invalid", () => {
    expect(printFormUrl("20<script>", "AL")).toBe("/print");
  });
});
