import React from "react";
import { render } from "@testing-library/react";
import configureMockStore from "redux-mock-store";
import { Provider } from "react-redux";
import Section from "./Section";

const mockStore = configureMockStore();
const testSectionId = 2020;
const testSubSectionId = "1";
const store = mockStore({
  stateUser: {
    name: "Kentucky",
    imageURI: "kentucky.png",
  },
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
  <Provider store={store}>
    <Section sectionId={testSectionId} subsectionId={testSubSectionId} />
  </Provider>
);

describe("<Section />", () => {
  test("passes subsection info to the subsection component", () => {
    render(section);
    expect(mockChildComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        subsectionId: testSubSectionId,
      })
    );
  });
});
