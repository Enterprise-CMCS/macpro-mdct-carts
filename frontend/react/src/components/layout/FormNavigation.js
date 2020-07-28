import React, { Component } from "react";
import { Button } from "@cmsgov/design-system-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";

class FormNavigation extends Component {
  render() {
    return (
      <section className="nav-buttons">
        <div className="ds-l-row">
          <div className="ds-l-col auto-save">
            <Button
              className="ds-c-button--transparent"
              title="Last edited 3 minutes ago"
              disabled
            >
              All changes auto-saved
            </Button>
          </div>

          <div className="ds-l-col form-buttons">
            {this.props.previousUrl ? (
              <div className="form-button previous">
                <Button
                  type="submit"
                  className="ds-c-button"
                  href={this.props.previousUrl}
                >
                  <FontAwesomeIcon icon={faAngleLeft} /> Previous
                </Button>
              </div>
            ) : null}
            {this.props.nextUrl ? (
              <div className="form-button next">
                <Button
                  type="submit"
                  className="ds-c-button ds-c-button--primary"
                  href={this.props.nextUrl}
                >
                  Next <FontAwesomeIcon icon={faAngleRight} />
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    );
  }
}

export default FormNavigation;
