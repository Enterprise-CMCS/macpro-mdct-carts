import { getPageTitle, selectFormRouteTitle } from "./pageTitles";

// Minimal formData mirroring the 2024 section JSON (only fields the
// resolver reads: section ordinal/title and subsection id/title).
const section = (ordinal, title, subsections = []) => ({
  contents: { section: { ordinal, title, subsections } },
});

const formData = [
  section(0, "Basic State Information", [{ id: "2024-00-a", title: null }]),
  section(1, "Program Fees and Policy Changes", [
    { id: "2024-01-a", title: null },
  ]),
  section(2, "Enrollment and Uninsured Data", [
    { id: "2024-02-a", title: null },
  ]),
  section(3, "Eligibility, Enrollment, and Operations", [
    { id: "2024-03-a", title: "Program Outreach" },
    { id: "2024-03-b", title: "Substitution of Coverage" },
    { id: "2024-03-c", title: "Renewal, Denials, and Retention" },
    { id: "2024-03-d", title: "Cost Sharing (Out-of-Pocket Costs)" },
    {
      id: "2024-03-e",
      title: "Employer Sponsored Insurance and Premium Assistance",
    },
    { id: "2024-03-f", title: "Program Integrity" },
    { id: "2024-03-g", title: "Dental Benefits" },
    { id: "2024-03-h", title: "CAHPS Survey Results" },
    { id: "2024-03-i", title: "Health Services Initiatives (HSI) Programs" },
  ]),
  section(4, "State Plan Strategic Objectives and Performance Goals", [
    { id: "2024-04-a", title: null },
  ]),
  section(5, "Program Financing", [{ id: "2024-05-a", title: null }]),
  section(6, "Challenges and Accomplishments", [
    { id: "2024-06-a", title: null },
  ]),
];

const titleFor = (pathname, overrides = {}) =>
  getPageTitle({
    pathname,
    hasUser: true,
    formData,
    stateName: "New York",
    formYear: 2024,
    ...overrides,
  });

describe("getPageTitle() - static routes", () => {
  test("logged-out home is the login title", () => {
    expect(getPageTitle({ pathname: "/", hasUser: false })).toBe(
      "Login – CARTS"
    );
  });

  test("logged-in home", () => {
    expect(titleFor("/")).toBe("CHIP Annual Reporting Template System (CARTS)");
  });

  test("user profile", () => {
    expect(titleFor("/user/profile")).toBe("User profile – CARTS");
  });

  test("get help", () => {
    expect(titleFor("/get-help")).toBe("How can we help you? – CARTS");
  });

  test("unknown route -> page not found", () => {
    expect(titleFor("/path-that-does-not-exist")).toBe(
      "Page not found – CARTS"
    );
  });

  test("templates", () => {
    expect(titleFor("/templates")).toBe("Generate form base templates – CARTS");
  });

  test("state reports", () => {
    expect(titleFor("/state-reports")).toBe("State reports – CARTS");
  });

  test("print view", () => {
    expect(
      getPageTitle({
        pathname: "/print",
        search: "?year=2024&state=NY",
        hasUser: true,
        stateName: "New York",
      })
    ).toBe("New York CARTS 2024 Report");
  });
});

describe("getPageTitle() - form section routes (driven by JSON)", () => {
  const expected = {
    "/sections/2024/00": "Basic State Information – New York 2024 – CARTS",
    "/sections/2024/01":
      "Program Fees and Policy Changes – New York 2024 – CARTS",
    "/sections/2024/02":
      "Enrollment and Uninsured Data – New York 2024 – CARTS",
    "/sections/2024/03/a": "Program Outreach – New York 2024 – CARTS",
    "/sections/2024/03/b": "Substitution of Coverage – New York 2024 – CARTS",
    "/sections/2024/03/c":
      "Renewal, Denials, and Retention – New York 2024 – CARTS",
    "/sections/2024/03/d":
      "Cost Sharing (Out-of-Pocket Costs) – New York 2024 – CARTS",
    "/sections/2024/03/e":
      "Employer Sponsored Insurance and Premium Assistance – New York 2024 – CARTS",
    "/sections/2024/03/f": "Program Integrity – New York 2024 – CARTS",
    "/sections/2024/03/g": "Dental Benefits – New York 2024 – CARTS",
    "/sections/2024/03/h": "CAHPS Survey Results – New York 2024 – CARTS",
    "/sections/2024/03/i":
      "Health Services Initiatives (HSI) Programs – New York 2024 – CARTS",
    "/sections/2024/04":
      "State Plan Strategic Objectives and Performance Goals – New York 2024 – CARTS",
    "/sections/2024/05": "Program Financing – New York 2024 – CARTS",
    "/sections/2024/06":
      "Challenges and Accomplishments – New York 2024 – CARTS",
    "/sections/2024/certify-and-submit":
      "Certify and Submit – New York 2024 – CARTS",
  };

  for (const [path, title] of Object.entries(expected)) {
    test(`${path}`, () => {
      expect(titleFor(path)).toBe(title);
    });
  }

  test("admin /views/sections route resolves the same section title", () => {
    expect(titleFor("/views/sections/NY/2024/03/a")).toBe(
      "Program Outreach – New York 2024 – CARTS"
    );
  });

  test("falls back to state + year while formData is still loading", () => {
    expect(
      getPageTitle({
        pathname: "/sections/2024/01",
        hasUser: true,
        formData: [],
        stateName: "New York",
      })
    ).toBe("New York 2024 – CARTS");
  });
});

describe("selectFormRouteTitle()", () => {
  test("returns null when formData is empty", () => {
    expect(selectFormRouteTitle([], 1)).toBeNull();
  });

  test("prefers subsection title when the subsection has one", () => {
    expect(selectFormRouteTitle(formData, 3, "c")).toBe(
      "Renewal, Denials, and Retention"
    );
  });

  test("falls back to section title for untitled subsections", () => {
    expect(selectFormRouteTitle(formData, 1, "a")).toBe(
      "Program Fees and Policy Changes"
    );
  });
});
