import React, { Component } from "react";
import { VerticalNav } from "@cmsgov/design-system-core";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

const idToUrl = (id) => `/sections/${id.replace(/-/g, "/")}`;
const subsection = (index) => String.fromCharCode("A".charCodeAt(0) + index);

class TOC extends Component {
  constructor(props) {
    super(props);
    this.click = this.click.bind(this);
  }

  click = (e, _, url) => {
    e.preventDefault();
    e.stopPropagation();
    if (!url.startsWith("javascript:")) {
      this.props.history.push(url);
    }
  };

  render() {
    const { location, sections } = this.props;

    const items = sections
      .map(({ id, ordinal, subsections, title }) => ({
        id,
        items:
          subsections.length < 2
            ? null
            : subsections.map(({ id, title }, i) => ({
                label: `Section ${ordinal}${subsection(i)}: ${title}`,
                onClick: this.click,
                selected: location.pathname.toLowerCase().startsWith(idToUrl(id)),
                url: idToUrl(id),
              })),
        label: ordinal > 0 ? `Section ${ordinal}: ${title}` : title,
        onClick: this.click,
        selected: location.pathname.toLowerCase().startsWith(idToUrl(id)),
      }))
      .map(({ id, items, ...rest }) => {
        const updated = { id, items, ...rest };
        if (items == null) {
          updated.url = idToUrl(id);
        }
        return updated;
      });

    return (
      <div className="toc">
        <VerticalNav selectedId="toc" items={items} />
      </div>
    );
  }
}

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

const mapStateToProps = (state) => ({ sections: selectSectionsForNav(state) });

export default connect(mapStateToProps)(withRouter(TOC));

export { TOC };
