import React from "react";
//components
import Autosave from "../fields/Autosave";
import FormActions from "./FormActions";
import FormNavigation from "./FormNavigation";
import PageInfo from "./PageInfo";
import Subsection from "./Subsection";
//types
import PropTypes from "prop-types";

const Section = ({ subsectionId }) => {
  return (
    <div className="section-basic-info ds-l-col--9 content">
      <main id="main-content" className="main">
        <PageInfo />
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
};

export default Section;
