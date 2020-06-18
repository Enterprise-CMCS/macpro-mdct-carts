import React, { Component, Fragment } from "react";
import { Button } from "@cmsgov/design-system-core";

class NavButton extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { direction, destination } = this.props;

    return (
      <Fragment>
        <Button type="submit" className="ds-c-button" href={destination}>
          {direction}
        </Button>
      </Fragment>
    );
  }
}

export default NavButton;
