/*
 * jest-dom adds custom jest matchers for asserting on DOM nodes.
 * allows you to do things like:
 * expect(element).toHaveTextContent(/react/i)
 * learn more: https://github.com/testing-library/jest-dom
 */
import "@testing-library/jest-dom";
import "jest-axe/extend-expect";

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
jest.mock("aws-amplify/api", () => ({
  get: jest.fn().mockImplementation(() => ({
    response: Promise.resolve({
      body: {
        text: () => Promise.resolve(`{"json":"blob"}`),
      },
    }),
  })),
  post: jest.fn().mockImplementation(() => ({
    response: Promise.resolve({
      body: {
        text: () => Promise.resolve(`{"json":"blob"}`),
      },
    }),
  })),
  put: jest.fn().mockImplementation(() => ({
    response: Promise.resolve({
      body: {
        text: () => Promise.resolve(`{"json":"blob"}`),
      },
    }),
  })),
  del: jest.fn().mockImplementation(() => ({
    response: Promise.resolve({}),
  })),
}));

jest.mock("aws-amplify/auth", () => ({
  fetchAuthSession: jest.fn().mockReturnValue({
    idToken: () => ({
      payload: "eyJLongToken",
    }),
  }),
  configure: () => {},
  signOut: jest.fn().mockImplementation(() => Promise.resolve()),
  signInWithRedirect: jest.fn(),
}));

jest.mock("aws-amplify/utils", () => ({
  Hub: {
    listen: jest.fn(),
  },
}));
