import React from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { constructIdFromYearSectionAndSubsection } from "../../store/formData";
import Section from "../layout/Section";
import SecureInitialDataLoad from "./SecureInitialDataLoad";

const InvokeSection = ({ userData }) => {
  const { state, year, sectionOrdinal, subsectionMarker } = useParams();
  console.log("state in InvokeSection", state);
  if (state) {
      SecureInitialDataLoad({stateCode: state});
  }
  const filteredMarker = subsectionMarker
    ? subsectionMarker.toLowerCase()
    : "a";
  const sectionId = constructIdFromYearSectionAndSubsection(
    Number(year),
    Number(sectionOrdinal)
  );
  const subsectionId = constructIdFromYearSectionAndSubsection(
    Number(year),
    Number(sectionOrdinal),
    filteredMarker
  );
  return (
    <Section
      userData={userData}
      sectionId={sectionId}
      subsectionId={subsectionId}
    />
  );
};

InvokeSection.propTypes = {
  userData: PropTypes.object.isRequired,
};

export default InvokeSection;
