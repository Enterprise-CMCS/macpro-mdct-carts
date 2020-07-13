import React from "react";
// import { render } from "@testing-library/react";
import App from "./App";

// import { configure } from 'enzyme';
// import Adapter from 'enzyme-adapter-react-16';

// configure({ adapter: new Adapter() });

import { shallow, mount, render } from "enzyme";

const wrapper = shallow(<App />);

// test('renders learn react link', () => {
//   const { getByText } = render(<App />);
//   const linkElement = getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });
