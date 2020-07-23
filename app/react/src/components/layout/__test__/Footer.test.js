import React from "react";
import Footer from "../Footer";

import renderer from "react-test-renderer";
import { shallow, mount } from "enzyme";

describe("Footer Component", () => {
  const component = shallow(<Footer />);

  it("renders", () => {
    expect(component.exists()).toBe(true);
  });

  it("has appropriate classnames", () => {
    expect(component.exists(".footer")).toBe(true);
  });

  it("includes federal website disclaimer", () => {
    expect(
      component.find('[href="mailto:cartshelp@cms.hhs.gov"]').hasClass("help")
    ).toBe(true);
  });
});

describe("Footer Component, snapshot testing", () => {
  const snapShot = renderer.create(<Footer />);

  it("should match the snapshot", () => {
    expect(snapShot.toJSON()).toMatchSnapshot();
  });
});
