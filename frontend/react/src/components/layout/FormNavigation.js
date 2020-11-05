import React from "react";
import PropTypes from "prop-types";
import { Button } from "@cmsgov/design-system-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { selectSectionsForNav } from "../../store/selectors";

const idToUrl = (id) => `/sections/${id.replace(/-/g, "/")}`;

const FormNavigation = (props) => {
  const { history, location, sections } = props;

  const items = [];
  sections.forEach((section) => {
    if (section.subsections.length < 2) {
      items.push(idToUrl(section.id));
    } else {
      section.subsections.forEach((subsection) => {
        items.push(idToUrl(subsection.id));
      });
    }
  });

  // Pull year from current location
  const year = location.pathname.split("/")[2];

  // Add certify and submit page to items array
  items.push(`/sections/${year}/certify-and-submit`);

  // Get current url
  const currentUrl = window.location.pathname;

  // Get index of url in items array
  const currentIndex = items.indexOf(currentUrl);

  // Determine previous index
  const previousUrl = items[currentIndex - 1];

  // Determine next index
  const nextUrl = items[currentIndex + 1];

  return (
    <section className="nav-buttons">
      <div className="ds-l-row">
        <div className="ds-l-col form-buttons">
          {previousUrl ? (
            <div className="form-button previous">
              <Button
                type="submit"
                className="ds-c-button"
                onClick={() => {
                  history.push(previousUrl);
                }}
              >
                <FontAwesomeIcon icon={faAngleLeft} /> Previous
              </Button>
            </div>
          ) : null}

          {nextUrl ? (
            <div className="form-button next">
              <Button
                type="submit"
                className="ds-c-button ds-c-button--primary"
                onClick={() => {
                  history.push(nextUrl);
                }}
              >
                Next <FontAwesomeIcon icon={faAngleRight} />
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};

FormNavigation.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  sections: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({ sections: selectSectionsForNav(state) });

export default connect(mapStateToProps)(withRouter(FormNavigation));
