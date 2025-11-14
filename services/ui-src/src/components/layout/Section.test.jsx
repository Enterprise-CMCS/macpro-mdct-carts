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

  test("by default should render with a main element", () => {
    const { container } = render(section);
    const mainElement = container.querySelector("main");

    expect(mainElement).toBeInTheDocument();
  });

  test("renders with a <main> if useMain is true", () => {
    const sectionWithUseMain = (
      <Provider store={store}>
        <Section
          useMain={true}
          sectionId={testSectionId}
          subsectionId={testSubSectionId}
        />
      </Provider>
    );
    const { container } = render(sectionWithUseMain);
    const mainElement = container.querySelector("main");

    expect(mainElement).toBeInTheDocument();
  });

  test("renders without a <main> if useMain is false", () => {
    const sectionNoUseMain = (
      <Provider store={store}>
        <Section
          useMain={false}
          sectionId={testSectionId}
          subsectionId={testSubSectionId}
        />
      </Provider>
    );
    const { container } = render(sectionNoUseMain);
    const mainElement = container.querySelector("main");

    expect(mainElement).not.toBeInTheDocument();
  });
});
