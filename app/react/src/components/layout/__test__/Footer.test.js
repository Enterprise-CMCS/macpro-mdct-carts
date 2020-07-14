import React from "react";
import Footer from "../Footer";

import { shallow } from "enzyme";

describe("Footer Component", () => {
  test("renders", () => {
    const component = shallow(<Footer />);
    expect(component.exists()).toBe(true);
  });
});
