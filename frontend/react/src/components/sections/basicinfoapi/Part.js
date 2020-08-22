import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import FPL from "../../layout/FPL";
import CMSChoice from "../../fields/CMSChoice";
import CMSLegend from "../../fields/CMSLegend";
import FillForm from "../../layout/FillForm";
import {TextField} from "@cmsgov/design-system-core";
import { selectFragmentById, selectSectionByOrdinal } from "../../../store/formData";

const validEmailRegex = RegExp(
  /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i
);
  
const validTelephoneRegex = RegExp(
  /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
);

const Part = ({ Data, fragment, subsectionId }) => {
  const title = fragment.title ? <h2>{fragment.title}</h2> : <span></span>;
  const text = fragment.text ? <p>{fragment.text}</p> : <span></span>;
  return Data? (
    <div id={fragment.id}>
    I am a part
    {title}
    {text}

    
      
    </div>

  ) : null;
}


const mapStateToProps = (state, ownProps) => ({
  fragment: selectFragmentById(state, ownProps.partId),
  partId: ownProps.partId,
  abbr: state.stateUser.currentUser.state.id,
  year: state.global.formYear,
  Data: selectSectionByOrdinal(state, 0),
  programType: state.stateUser.programType,
  programName: state.stateUser.programName,
});

export default connect(mapStateToProps)(Part);

