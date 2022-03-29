import React, { useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { loadForm } from "../../actions/initial";
import { constructIdFromYearSectionAndSubsection } from "../../store/formData";
import Section from "../layout/Section";
import { updateFormYear } from "../../store/globalVariables";

const InvokeSection = (username) => {
  const { state, year, sectionOrdinal, subsectionMarker } = useParams();
  const dispatch = useDispatch();
  const currentPath = window.location.href;
  let linkYear = window.location.href.toString().split("/")[2];
  if (currentPath.includes("views")) {
    linkYear = window.location.href.toString().split("/")[6];
    dispatch(updateFormYear(linkYear));
  }

  useEffect(() => {
    if (username) {
      dispatch(loadForm(state));
    }
  }, [username]); // eslint-disable-line react-hooks/exhaustive-deps

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

const mapState = (state) => ({
  username: state.stateUser.currentUser.username,
});

export default connect(mapState)(InvokeSection);
