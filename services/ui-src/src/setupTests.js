/*
 * jest-dom adds custom jest matchers for asserting on DOM nodes.
 * allows you to do things like:
 * expect(element).toHaveTextContent(/react/i)
 * learn more: https://github.com/testing-library/jest-dom
 */
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import "jest-axe/extend-expect";

import { configure } from "enzyme";

import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

global.window.env = {
  API_POSTGRES_URL: "fakeurl",
};

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

Object.defineProperty(window, "crypto", { value: require("node:crypto") });

jest.mock("./util/metaEnv", () => ({
  MODE: "production",
  BASE_URL: "mdctcartsdev.cms.gov",
}));

/* Mock Amplify */
jest.mock("aws-amplify", () => ({
  Hub: {
    listen: jest.fn(),
  },
}));
