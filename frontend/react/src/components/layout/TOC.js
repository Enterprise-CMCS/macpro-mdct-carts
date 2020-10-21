import React, { Component } from "react";
import PropTypes from "prop-types";
import { VerticalNav } from "@cmsgov/design-system-core";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

const idToUrl = (location, id) => {
  const endOfPath = id.replace(/-/g, "/");
  if (location.pathname.startsWith("/views/sections")) {
    const pathChunks = location.pathname.split("/");
    const base = pathChunks.slice(0, 4).join("/");
    return `${base}/${endOfPath}`;
  }
  return `/sections/${endOfPath}`;
};
const subsection = (index) => String.fromCharCode("A".charCodeAt(0) + index);

class TOC extends Component {
  constructor(props) {
    super(props);
    this.click = this.click.bind(this);
  }

  click = (e, _, url) => {
    e.preventDefault();
    e.stopPropagation();

    const { history } = this.props;

    history.push(url);
  };

  render() {
    const { location, sections, userRole } = this.props;

    const items = sections
      .map(({ id: sectionId, ordinal, subsections, title: sectionTitle }) => ({
        id: sectionId,
        items:
          subsections.length < 2
            ? null
            : subsections.map(
                ({ id: subsectionId, title: subsectionTitle }, i) => ({
                  label: `Section ${ordinal}${subsection(
                    i
                  )}: ${subsectionTitle}`,
                  onClick: this.click,
                  selected: location.pathname
                    .toLowerCase()
                    .startsWith(idToUrl(location, subsectionId)),
                  url: idToUrl(location, subsectionId),
                })
              ),
        label:
          ordinal > 0 ? `Section ${ordinal}: ${sectionTitle}` : sectionTitle,
        onClick: this.click,
        selected: location.pathname
          .toLowerCase()
          .startsWith(idToUrl(location, sectionId)),
      }))
      .map(({ id, items: childItems, ...rest }) => {
        const updated = { id, items: childItems, ...rest };
        if (childItems == null) {
          updated.url = idToUrl(location, id);
        }
        return updated;
      });

    // If the user can certify and submit AND the form is not yet submitted...
    if (userRole === "state_user") {
      items.push({
        id: "certify-and-submit",
        label: "Certify and Submit",
        onClick: this.click,
        selected: location.pathname === "/sections/2020/certify-and-submit",
        url: "/sections/2020/certify-and-submit",
      });
    }

    return (
      <div className="toc">
        <VerticalNav selectedId="toc" items={items} />
      </div>
    );
  }
}
TOC.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  sections: PropTypes.array.isRequired,
  userRole: PropTypes.string.isRequired,
};

const selectSectionsForNav = (state) => {
  if (state.formData) {
    const sections = state.formData;
    return sections.map(
      ({
        contents: {
          section: { id: sectionId, ordinal, subsections, title: sectionTitle },
        },
      }) => ({
        id: sectionId,
        ordinal,
        title: sectionTitle,
        subsections: subsections.map(
          ({ id: subsectionId, title: subsectionTitle }) => ({
            id: subsectionId,
            title: subsectionTitle,
          })
        ),
      })
    );
  }
  return [];
};

const mapStateToProps = (state) => ({
  sections: selectSectionsForNav(state),
  userRole: state.stateUser.currentUser.role,
});

export default connect(mapStateToProps)(withRouter(TOC));
