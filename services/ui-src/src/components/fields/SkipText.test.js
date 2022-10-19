import React from "react";

import { shallow } from "enzyme";
import { axe } from "jest-axe";
import SkipText from "./SkipText";

const wrapper = <SkipText question={{ skip_text: "Render text" }} />;

describe("<SkipText />", () => {
  it("should render correctly", () => {
    expect(shallow(wrapper).exists()).toBe(true);
  });
});

describe("Test <SkipText /> accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const card = shallow(wrapper);
    const results = await axe(card.html());
    expect(results).toHaveNoViolations();
  });
});
