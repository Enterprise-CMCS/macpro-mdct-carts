import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import PageInfo from "./PageInfo";
import { selectSectionTitle, selectFormStatus } from "../../store/selectors";
import Subsection from "./Subsection";
import FormNavigation from "./FormNavigation";
import FormActions from "./FormActions";
import Autosave from "../fields/Autosave";

// Get section number only from sectionId
const selectSectionNumber = (sectionId) => {
  return Number(sectionId.split("-")[1]);
};

const Section = ({ subsectionId, title, sectionId }) => {
  return (
    <div className="section-basic-info ds-l-col--9 content">
      <div className="main">
        <PageInfo />
        <h2 className="print-only">
          {sectionId !== 0 && <span>Section {sectionId}: </span>}
          {title}
        </h2>
        <h2 className="screen-only">{title}</h2>
        <Subsection key={subsectionId} subsectionId={subsectionId} />
      </div>
      <div className="form-footer">
        <Autosave />
        <FormNavigation />
        <FormActions />
      </div>
    </div>
  );
};
Section.propTypes = {
  status: PropTypes.string.isRequired,
  subsectionId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  sectionId: PropTypes.string.isRequired,
};

const mapStateToProps = (state, { sectionId, subsectionId }) => {
  return {
    subsectionId,
    title: selectSectionTitle(state, sectionId),
    sectionId: selectSectionNumber(sectionId),
    status: selectFormStatus(state),
  };
};

export default connect(mapStateToProps)(Section);
