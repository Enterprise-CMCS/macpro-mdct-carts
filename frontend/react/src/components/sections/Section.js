import React, { Component } from "react";
import { connect } from "react-redux";
import PageInfo from "../layout/PageInfo";
import { selectSectionTitle } from "../../store/formData";
import Subsection from "./basicinfoapi/Subsection";

const Section = ({ Data, subsectionConstraint }) => {
  const constrained = Data && Data.subsections.filter((subsection) => subsection.id === subsectionConstraint);
  const title = Data && Data.title ? (<h2>{Data.title}</h2>) : "";
  return constrained ? (
    <div className="section-basic-info ds-l-col--9 content">
      <div className="main">
        <PageInfo />
        <h2>{title}</h2>
        {constrained.map((subsection) => (
          <Subsection key={subsection.id} subsectionId={subsection.id} />
        ))}
      </div>
    </div>
  ) : null;
}

const mapStateToProps = (state, { sectionId, subsectionId }) => {
  return {
    subsectionId,
    title: selectSectionTitle(state, sectionId),
  };
};

export default connect(mapStateToProps)(Section);
