import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import PageInfo from "./PageInfo";
import { selectSectionTitle } from "../../store/selectors";
import Subsection from "./Subsection";
import FormNavigation from "./FormNavigation";
import FormActions from "./FormActions";
import Autosave from "../fields/Autosave";

// Get section number only from sectionId
const selectSectionNumber = (sectionId) => {
  return Number(sectionId.split("-")[1]);
};

const Section = ({ subsectionId, title }) => {
  return (
    <div className="section-basic-info ds-l-col--9 content">
      <main id="main-content" className="main">
        <PageInfo />
        <h2 data-testid="section-title">{title}</h2>
        <Subsection key={subsectionId} subsectionId={subsectionId} />
      </main>
      <div className="form-footer">
        <Autosave />
        <FormNavigation />
        <FormActions />
      </div>
    </div>
  );
};
Section.propTypes = {
  subsectionId: PropTypes.string.isRequired,
  title: PropTypes.string,
  sectionId: PropTypes.number.isRequired,
};

const mapStateToProps = (state, { sectionId, subsectionId }) => {
  return {
    subsectionId,
    title: selectSectionTitle(state, sectionId),
    sectionId: selectSectionNumber(sectionId),
  };
};

export default connect(mapStateToProps)(Section);
