import React from "react";
import { shallow } from "enzyme";
import { render } from "@testing-library/react";
import Section from "./Section";

const testSectionId = "2020-123";
const testSubSectionId = "1";

jest.mock("./Autosave", () => () => {
  const MockName = "default-autosave";
  return <MockName />;
});
jest.mock("./FormActions", () => () => {
  const MockName = "default-form-nav";
  return <MockName />;
});
jest.mock("./FormNavigation", () => () => {
  const MockName = "default-actions";
  return <MockName />;
});
jest.mock("./PageInfo", () => () => {
  const MockName = "default-page-info";
  return <MockName />;
});
const mockChildComponent = jest.fn();
jest.mock("./Subsection", () => (props) => {
  mockChildComponent(props);
  return <mock-childComponent />;
});
const section = (
  <Section sectionId={testSectionId} subsectionId={testSubSectionId} />
);

describe("Section Component", () => {
  it("should render correctly", () => {
    expect(shallow(section).exists()).toBe(true);
  });

  it("passes subsection info to the subsection component", () => {
    render(section);
    expect(mockChildComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        subsectionId: testSubSectionId,
      })
    );
  });
});
