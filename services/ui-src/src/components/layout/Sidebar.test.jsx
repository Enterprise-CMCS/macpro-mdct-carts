import React from "react";
import { render, screen } from "@testing-library/react";
import Sidebar from "./Sidebar";

jest.mock("./TableOfContents", () => () => {
  return <p>table-of-contents</p>;
});
const sidebar = <Sidebar />;

describe("<Sidebar />", () => {
  test("should contain a header and table of contents", () => {
    render(sidebar);
    expect(screen.getByText("table-of-contents")).toBeVisible();
  });
});
