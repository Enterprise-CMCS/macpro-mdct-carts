import React from "react";
import { shallow } from "enzyme";
import FormActions from "./FormActions";

const form = <FormActions />;

describe("Fill Form Component", () => {
  it("should render correctly", () => {
    expect(shallow(form).exists()).toBe(true);
  });
});
