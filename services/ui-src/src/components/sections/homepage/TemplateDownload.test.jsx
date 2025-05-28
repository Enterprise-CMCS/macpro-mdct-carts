import React from "react";
import TemplateDownload from "./TemplateDownload";

import { axe } from "jest-axe";
import { render, screen } from "@testing-library/react";
import userEventLib from "@testing-library/user-event";

const userEvent = userEventLib.setup({ applyAccept: false });
const myMock = jest.fn();
const defaultProps = { getTemplate: myMock };
const wrapper = <TemplateDownload {...defaultProps} />;

describe("<TemplateDownload />", () => {
  it("should have download template link", async () => {
    render(wrapper);

    const downloadTemplateButton = screen.getByRole("button");
    await userEvent.click(downloadTemplateButton);

    expect(defaultProps.getTemplate).toBeCalledWith("2023");
  });
});

describe("Test <TemplateDownload /> accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(wrapper);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
