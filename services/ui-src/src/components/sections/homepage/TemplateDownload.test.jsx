import React from "react";
import TemplateDownload from "./TemplateDownload";

import { shallow } from "enzyme";
import { axe } from "jest-axe";
import { render } from "@testing-library/react";

const myMock = jest.fn();
const defaultProps = { getTemplate: myMock };
const wrapper = <TemplateDownload {...defaultProps} />;

describe("<TemplateDownload />", () => {
  it("should render correctly", () => {
    expect(shallow(wrapper).exists()).toBe(true);
  });
});

describe("Test <TemplateDownload /> accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(wrapper);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
