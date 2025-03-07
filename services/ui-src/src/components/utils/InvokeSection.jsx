import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
// components
import Section from "../layout/Section";
// utils
import { loadForm } from "../../actions/initial";
import { constructIdFromYearSectionAndSubsection } from "../../store/formData";
import { updateFormYear, updateStateName } from "../../store/globalVariables";

const InvokeSection = () => {
  const { state, year, sectionOrdinal, subsectionMarker } = useParams();
  const dispatch = useDispatch();
  const currentPath = window.location.href;
  const username = useSelector((state) => state.stateUser.currentUser.username);

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
  return <Section sectionId={Number(sectionId)} subsectionId={subsectionId} />;
};

export default InvokeSection;
