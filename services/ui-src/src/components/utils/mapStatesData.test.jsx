import mapStatesData from "./mapStatesData";

const input = [
  {
    lastChanged: "2024-01-04 18:28:18.524133+00",
    state: "Alabama",
    stateCode: "AL",
    status: "in_progress",
    username: "al@test.com",
    year: 2024,
  },
];

const outputWithUsername = [
  {
    entity: {
      ...input[0],
    },
    lastEdited: "2024-01-04 at 10:28:18 a.m. by al@test.com",
    stateName: "Alabama",
    statusText: "In Progress",
    year: 2024,
  },
];

const outputWithTimezone = [
  {
    entity: {
      ...input[0],
    },
    lastEdited: "2024-01-04 at 1:28:18 p.m.",
    stateName: "Alabama",
    statusText: "In Progress",
    year: 2024,
  },
];

describe("mapStatesData()", () => {
  test("returns correct output with username", () => {
    expect(mapStatesData(input, true, "America/Los_Angeles")).toEqual(
      outputWithUsername
    );
  });

  test("returns correct output with timezone", () => {
    expect(mapStatesData(input, false, "America/New_York")).toEqual(
      outputWithTimezone
    );
  });
});
