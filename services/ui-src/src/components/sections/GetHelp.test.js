import React from "react";

import { shallow } from "enzyme";
import { axe } from "jest-axe";
import GetHelp from "./GetHelp";

const wrapper = <GetHelp />;

describe("<GetHelp />", () => {
  it("should render correctly", () => {
    expect(shallow(wrapper).exists()).toBe(true);
  });
});

describe("Test <GetHelp /> accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const card = shallow(wrapper);
    const results = await axe(card.html());
    expect(results).toHaveNoViolations();
  });
});
