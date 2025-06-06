import React from "react";
import { render, screen } from "@testing-library/react";
import userEventLib from "@testing-library/user-event";
import TemplateDownload from "./TemplateDownload";
import { testA11y } from "../../../util/testing/testUtils";

const userEvent = userEventLib.setup({ applyAccept: false });
const myMock = jest.fn();
const defaultProps = { getTemplate: myMock };
const wrapper = <TemplateDownload {...defaultProps} />;

describe("<TemplateDownload />", () => {
  test("should have download template link", async () => {
    render(wrapper);

    const downloadTemplateButton = screen.getByRole("button");
    await userEvent.click(downloadTemplateButton);

    expect(defaultProps.getTemplate).toBeCalledWith("2024");
  });

  testA11y(wrapper);
});
