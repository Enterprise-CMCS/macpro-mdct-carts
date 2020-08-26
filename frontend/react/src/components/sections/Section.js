import React, { Component } from "react";
import { connect } from "react-redux";
import PageInfo from "../layout/PageInfo";
import { extractSectionOrdinalFromId, selectSectionByOrdinal, winnowProperties } from "../../store/formData";
import Subsection from "./basicinfoapi/Subsection";

const Section = ({Data}) => {
  const title = Data && Data.title ? (<h2>{Data.title}</h2>) : "";
  
  return Data ? (
    <div className="section-basic-info ds-l-col--9 content">
      <div className="main">
        <PageInfo />
        <div className="section-content">
         {title}
         {Data.subsections.map((subsection) => (
             <Subsection key={subsection.id} subsectionId={subsection.id}/>
         ))}
        </div>
      </div>
    </div>
  ) : null;
} 


const mapStateToProps = (state, ownProps) => {
  return {
    abbr: state.stateUser.currentUser.state.id,
    Data: winnowProperties(selectSectionByOrdinal(state, extractSectionOrdinalFromId(ownProps.fragmentId))),
    year: state.global.formYear,
    programType: state.stateUser.programType,
    programName: state.stateUser.programName,
  }
};

export default connect(mapStateToProps)(Section);
