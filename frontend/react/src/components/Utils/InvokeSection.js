import React, { useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { loadForm } from "../../actions/initial";
import { constructIdFromYearSectionAndSubsection } from "../../store/formData";
import Section from "../layout/Section";

const InvokeSection = (username) => {
  const { state, year, sectionOrdinal, subsectionMarker } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    if (username) {
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
