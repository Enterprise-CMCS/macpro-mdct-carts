import React from "react";
import Sidebar from "./Sidebar";
import { render, screen } from "@testing-library/react";

jest.mock("./StateHeader", () => () => {
  return <p>state-header</p>;
});
jest.mock("./TableOfContents", () => () => {
  return <p>table-of-contents</p>;
});
const sidebar = <Sidebar />;

describe("Sidebar Component", () => {
  it("should contain a header and table of contents", () => {
    render(sidebar);
    expect(screen.getByText("state-header")).toBeVisible();
    expect(screen.getByText("table-of-contents")).toBeVisible();
  });
});
