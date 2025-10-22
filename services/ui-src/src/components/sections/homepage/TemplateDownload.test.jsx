import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TemplateDownload from "./TemplateDownload";
import { testA11y } from "../../../util/testing/testUtils";

const myMock = jest.fn();
const defaultProps = { getTemplate: myMock };
const wrapper = <TemplateDownload {...defaultProps} />;

describe("<TemplateDownload />", () => {
  test("should have download template link", async () => {
    render(wrapper);

    const downloadTemplateButton = screen.getByRole("button");
    await userEvent.click(downloadTemplateButton);

    expect(defaultProps.getTemplate).toHaveBeenCalledWith("2024");
  });

  testA11y(wrapper);
});
