import React, { Component } from "react";
import { Button } from "@cmsgov/design-system-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

const idToUrl = (id) => `/sections/${id.replace(/-/g, "/")}`;

class FormNavigation extends Component {

  render() {
    const { location, sections } = this.props;

    // Get all section data
    let items = sections
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

    // Generate new array with only URLs
    let newItems = [];
    for (let i = 0; i < items.length; i++) {
      if (items[i].url !== undefined) {
        newItems.push(items[i].url);
      }

      if (items[i].items !== null) {
        for (let j = 0; j < items[i].items.length; j++) {
          newItems.push(items[i].items[j].url);
        }
      }
    }

    // Write newItems back into items
    items = [...newItems];

    // Get current url
    let currentUrl = window.location.pathname;

    // Get index of url in items array
    let currentIndex = items.indexOf(currentUrl);

    // Determine previous index
    const previousUrl = items[currentIndex - 1];

    // Determin next index
    const nextUrl = items[currentIndex + 1]


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

const selectSectionsForNav = (state) => {
  if (state.formData) {
    const sections = state.formData.sort(sortByOrdinal);
    return sections.map(
      ({
        contents: {
          section: { id, ordinal, subsections, title },
        },
      }) => ({
        id,
        ordinal,
        title,
        subsections: subsections.map(({ id, title }) => ({ id, title })),
      })
    );
  }
  return [];
};

const sortByOrdinal = (sectionA, sectionB) => {
  const a = sectionA.contents.section.ordinal;
  const b = sectionB.contents.section.ordinal;

  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
};

const mapStateToProps = (state) => ({ sections: selectSectionsForNav(state) });

export default connect(mapStateToProps)(withRouter(FormNavigation));

export { FormNavigation };
