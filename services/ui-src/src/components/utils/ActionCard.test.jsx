import React from "react";

import ActionCard from "./ActionCard";
import techIcon from "../../assets/images/noun-technical-support-1873885-D5DEE4.png";
import { axe } from "jest-axe";
import { render, screen } from "@testing-library/react";

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
  it("should render when passed with image prop", () => {
    render(wrapper);
    expect(screen.getByAltText("example alt text")).toBeVisible();
  });

  it("should not render icon when not passed with image prop", () => {
    render(<ActionCard />);
    expect(screen.queryByAltText("example alt text")).not.toBeInTheDocument();
  });

  it("should render with children prop", () => {
    render(wrapper);
    expect(
      screen.getByText(
        "Please Favorite, like, subscribe, ring the bell, drop a follow, thumbs up, rate, star, bookmark, and save this youtube video please."
      )
    ).toBeVisible();
  });
});

describe("Test <ActionCard /> accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(wrapper);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
