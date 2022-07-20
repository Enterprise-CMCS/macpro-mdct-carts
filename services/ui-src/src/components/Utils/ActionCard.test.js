import React from "react";

import ActionCard from "./ActionCard";
import techIcon from "../../assets/images/noun-technical-support-1873885-D5DEE4.png";
import { shallow } from "enzyme";
import { axe } from "jest-axe";

const defaultProps = { icon: techIcon, iconAlt: "example alt text" };
const wrapper = (
  <ActionCard {...defaultProps}>
    <p>
      Please Favorite, like, subscribe, ring the bell, drop a follow, thumbs up,
      rate, star, bookmark, and save this youtube video please.
    </p>
  </ActionCard>
);

describe("<ActionCard />", () => {
  it("should render correctly", () => {
    expect(shallow(wrapper).exists()).toBe(true);
  });

  it("should render when passed with image prop", () => {
    const card = shallow(wrapper);
    expect(card.find("img").prop("src")).toEqual(techIcon);
    expect(card.find("img").prop("alt")).toEqual("example alt text");
  });

  it("should not render icon when not passed with image prop", () => {
    const card = shallow(wrapper);
    expect(card.contains(<img />)).toEqual(false);
  });

  it("should render with children prop", () => {
    const card = shallow(wrapper);
    expect(card.find("p").text()).toBe(
      "Please Favorite, like, subscribe, ring the bell, drop a follow, thumbs up, rate, star, bookmark, and save this youtube video please."
    );
  });
});

describe("Test <ActionCard /> accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const card = shallow(wrapper);
    const results = await axe(card.html());
    expect(results).toHaveNoViolations();
  });
});
