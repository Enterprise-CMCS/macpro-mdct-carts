import React from "react";
import PropTypes from "prop-types";
import PageInfo from "./PageInfo";
import Subsection from "./Subsection";
import FormNavigation from "./FormNavigation";
import FormActions from "./FormActions";
import { Main } from "./Main";

const Section = ({ subsectionId, printView, useMain = true }) => {
  const section = (
    <>
      <PageInfo />
      <Subsection
        key={subsectionId}
        subsectionId={subsectionId}
        printView={printView}
      />
    </>
  );

  return (
    <div className="section-basic-info ds-l-col--9 content">
      {useMain ? <Main className="main">{section}</Main> : section}
      <div className="form-footer">
        <FormNavigation />
        <FormActions />
      </div>
    </div>
  );
};
Section.propTypes = {
  subsectionId: PropTypes.string.isRequired,
  sectionId: PropTypes.number.isRequired,
  printView: PropTypes.bool,
  useMain: PropTypes.bool,
};

export default Section;
