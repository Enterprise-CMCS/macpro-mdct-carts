import React from "react";
import { render, screen } from "@testing-library/react";
import ActionCard from "./ActionCard";
import techIcon from "../../assets/images/noun-technical-support-1873885-D5DEE4.png";
import { testA11y } from "../../util/testing/testUtils";

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
  test("should render when passed with image prop", () => {
    render(wrapper);
    expect(screen.getByAltText("example alt text")).toBeVisible();
  });

  test("should not render icon when not passed with image prop", () => {
    render(<ActionCard />);
    expect(screen.queryByAltText("example alt text")).not.toBeInTheDocument();
  });

  test("should render with children prop", () => {
    render(wrapper);
    expect(
      screen.getByText(
        "Please Favorite, like, subscribe, ring the bell, drop a follow, thumbs up, rate, star, bookmark, and save this youtube video please."
      )
    ).toBeVisible();
  });

  testA11y(wrapper);
});
