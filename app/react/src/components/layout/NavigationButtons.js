import React, { Component, Fragment } from "react";
import { Button } from "@cmsgov/design-system-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";

class NavigationButton extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { direction, destination } = this.props;

    return (
      <Fragment>
        {direction.toLowerCase() === "next" ? (
          <Button
            type="submit"
            className="ds-c-button ds-c-button--primary"
            href={destination}
          >
            Next <FontAwesomeIcon icon={faAngleRight} />
          </Button>
        ) : (
          <Button type="submit" className="ds-c-button " href={destination}>
            <FontAwesomeIcon icon={faAngleLeft} /> Previous
          </Button>
        )}
      </Fragment>
    );
  }
}

export default NavigationButton;
