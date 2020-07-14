import React from "react";
// import { render } from "@testing-library/react";
import App from "./App";

import { shallow } from "enzyme";

describe("App component", () => {
  test("renders correctly", () => {
    const component = shallow(<App />);
    expect(component).toMatchSnapshot();
  });
});
