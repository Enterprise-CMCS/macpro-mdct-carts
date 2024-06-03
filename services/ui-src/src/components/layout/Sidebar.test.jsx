import React from "react";
import { shallow, mount } from "enzyme";
import StateHeader from "./StateHeader";
import Sidebar from "./Sidebar";
import TableOfContents from "./TableOfContents";

jest.mock("./StateHeader", () => () => {
  const MockName = "default-header";
  return <MockName />;
});
jest.mock("./TableOfContents", () => () => {
  const MockName = "default-toc";
  return <MockName />;
});
const sidebar = <Sidebar />;

describe("Sidebar Component", () => {
  it("should render correctly", () => {
    expect(shallow(sidebar).exists()).toBe(true);
  });

  it("should contain a header and table of contents", () => {
    const wrapper = mount(sidebar);
    expect(wrapper.containsMatchingElement(<StateHeader />)).toEqual(true);
    expect(wrapper.containsMatchingElement(<TableOfContents />)).toEqual(true);
  });
});
