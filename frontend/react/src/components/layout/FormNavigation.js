import React, { Component } from "react";
import { Button } from "@cmsgov/design-system-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { selectSectionsForNav } from "../../store/selectors";

const idToUrl = (id) => `/sections/${id.replace(/-/g, "/")}`;

class FormNavigation extends Component {

  render() {
    const { history, location, sections } = this.props;

    const items = [];
    sections.forEach(section => {
      if (section.subsections.length < 2) {
        items.push(idToUrl(section.id))
      } else {
        section.subsections.forEach(subsection => {
          items.push(idToUrl(subsection.id));
        });
      }
    });

    // Get current url
    let currentUrl = window.location.pathname;

    // Get index of url in items array
    let currentIndex = items.indexOf(currentUrl);

    // Determine previous index
    const previousUrl = items[currentIndex - 1];

    // Determine next index
    const nextUrl = items[currentIndex + 1]


    return (
      <section className="nav-buttons">
        <div className="ds-l-row">
          <div className="ds-l-col form-buttons">

            {previousUrl ?
              <div className="form-button previous">
                <Button
                  type="submit"
                  className="ds-c-button"
                  onClick={() => { history.push(previousUrl); }}
                >
                  <FontAwesomeIcon icon={faAngleLeft} /> Previous
                </Button>
              </div> : null}

            {nextUrl ?
              <div className="form-button next">
                <Button
                  type="submit"
                  className="ds-c-button ds-c-button--primary"
                  onClick={() => { history.push(nextUrl); }}
                >
                  Next <FontAwesomeIcon icon={faAngleRight} />
                </Button>
              </div> : null}

          </div>
        </div>
      </section>
    );
  }
}

const mapStateToProps = (state) => ({ sections: selectSectionsForNav(state) });

export default connect(mapStateToProps)(withRouter(FormNavigation));

export { FormNavigation };
