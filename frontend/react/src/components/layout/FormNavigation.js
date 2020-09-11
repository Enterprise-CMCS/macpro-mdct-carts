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
    const { location, sections } = this.props;

    // Get all section data
    const parentItems = sections
      .map(({ id, ordinal, subsections, title }) => ({
        id,
        items:
          subsections.length < 2
            ? null
            : subsections.map(({ id, title }, i) => ({
              onClick: this.click,
              selected: location.pathname.startsWith(idToUrl(id)),
              url: idToUrl(id),
            })),
        label: ordinal > 0 ? `Section ${ordinal}: ${title}` : title,
        onClick: this.click,
        selected: location.pathname.startsWith(idToUrl(id)),
      }))
      .map(({ id, items, ...rest }) => {
        const updated = { id, items, ...rest };
        if (items == null) {
          updated.url = idToUrl(id);
        }
        return updated;
      });

    // Generate new array with only URLs (in order) in 1D array
    let items = [];
    for (let i = 0; i < parentItems.length; i++) {
      if (parentItems[i].url !== undefined) {
        items.push(parentItems[i].url);
      }

      if (parentItems[i].items !== null) {
        for (let j = 0; j < parentItems[i].items.length; j++) {
          items.push(parentItems[i].items[j].url);
        }
      }
    }

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
                  href={previousUrl}
                >
                  <FontAwesomeIcon icon={faAngleLeft} /> Previous
                </Button>
              </div> : null}

            {nextUrl ?
              <div className="form-button next">
                <Button
                  type="submit"
                  className="ds-c-button ds-c-button--primary"
                  href={nextUrl}
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
