import React from "react";
import { shallow } from "enzyme";
import BrowserIssue from "./BrowserIssue";

const issue = <BrowserIssue />;

describe("Browser Issue Component", () => {
  it("should render correctly", () => {
    expect(shallow(issue).exists()).toBe(true);
  });
});
