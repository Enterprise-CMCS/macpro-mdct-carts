import { mount, shallow } from "enzyme";
import React from "react";
import SaveMessage from "./SaveMessage";

describe("SaveMessage Component", () => {
  const stringProp = { lastSaved: "01/01/2002" };
  const saveMessageStringProp = <SaveMessage {...stringProp} />;

  const dateProp = { lastSaved: new Date() };
  const saveMessageDateProp = <SaveMessage {...dateProp} />;

  const nullProp = { lastSaved: null };
  const saveMessageNullProp = <SaveMessage {...nullProp} />;

  test("render component", () => {
    expect(shallow(saveMessageStringProp).exists()).toBe(true);
  });

  it("should accept date as prop", () => {
    expect(shallow(saveMessageDateProp).exists()).toBe(true);
  });

  it("should accept null as prop and return not saved", () => {
    const wrapper = mount(saveMessageNullProp);
    expect(wrapper.text().includes("Not yet saved")).toBe(true);
  });
});
