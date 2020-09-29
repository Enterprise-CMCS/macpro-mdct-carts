import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import PageInfo from "./PageInfo";
import { selectSectionTitle } from "../../store/selectors";
import Subsection from "./Subsection";
import FormNavigation from "./FormNavigation";
import FormActions from "./FormActions";
import Autosave from "../fields/Autosave";

const Section = ({ subsectionId, title }) => {
  return (
    <div className="section-basic-info ds-l-col--9 content">
      <div className="main">
        <PageInfo />
        <h2>{title}</h2>
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
  subsectionId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

const mapStateToProps = (state, { sectionId, subsectionId }) => {
  return {
    subsectionId,
    title: selectSectionTitle(state, sectionId),
  };
};

export default connect(mapStateToProps)(Section);
