import React from "react";
import { useParams } from "react-router-dom";
import { constructIdFromYearSectionAndSubsection } from "../../store/formData";
import Section from "../layout/Section";
import SecureInitialDataLoad from "./SecureInitialDataLoad";

const InvokeSection = () => {
  const { state, year, sectionOrdinal, subsectionMarker } = useParams();
  if (state) {
    SecureInitialDataLoad({ stateCode: state });
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
  return <Section sectionId={sectionId} subsectionId={subsectionId} />;
};

export default InvokeSection;
