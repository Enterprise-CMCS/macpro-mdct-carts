import React from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import PageInfo from "./PageInfo";
import { selectSectionTitle } from "../../store/selectors";
import Subsection from "./Subsection";
import FormNavigation from "./FormNavigation";
import FormActions from "./FormActions";
import Autosave from "../fields/Autosave";

const Section = ({ subsectionId, sectionId }) => {
  const formData = useSelector((state) => state.formData);
  const title = selectSectionTitle(formData, sectionId);

  return (
    <div className="section-basic-info ds-l-col--9 content">
      <h1> This is a section component!</h1>
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
      <h1>End of section component!</h1>
    </div>
  );
};
Section.propTypes = {
  subsectionId: PropTypes.string.isRequired,
  sectionId: PropTypes.number.isRequired,
};

export default Section;
