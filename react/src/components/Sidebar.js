import React, { Component } from "react";
import StateHeader from "./StateHeader";
import TOC from "./TOC";

class Sidebar extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="sidebar">
        <StateHeader />
        <TOC />
      </div>
    );
  }
}

export default Sidebar;
