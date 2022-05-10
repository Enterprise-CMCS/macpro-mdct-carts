import React, { useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { loadForm } from "../../actions/initial";
import { constructIdFromYearSectionAndSubsection } from "../../store/formData";
import Section from "../layout/Section";
import { updateFormYear, updateStateName } from "../../store/globalVariables";

const InvokeSection = (username) => {
  const { state, year, sectionOrdinal, subsectionMarker } = useParams();
  const dispatch = useDispatch();
  const currentPath = window.location.href;

  useEffect(() => {
    if (username) {
      if (currentPath.includes("views")) {
        const stateInitials = window.location.href.toString().split("/")[5];
        const linkYear = window.location.href.toString().split("/")[6];
        dispatch(updateStateName(stateInitials));
        dispatch(updateFormYear(linkYear));
      }
      dispatch(loadForm(state));
    }
  }, [username]);

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
