import React from "react";
import { shallow } from "enzyme";
import Unauthorized from "./Unauthorized";

const unauthorized = <Unauthorized />;

describe("Unauthorized Component", () => {
  it("should render correctly", () => {
    expect(shallow(unauthorized).exists()).toBe(true);
  });
});
