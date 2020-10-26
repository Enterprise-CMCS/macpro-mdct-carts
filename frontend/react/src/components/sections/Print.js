import React, {useEffect} from "react";
import {connect, useDispatch} from "react-redux";
import {getAllStatesData, getStateStatus, loadSections} from "../../actions/initial";
import Section from "../layout/Section";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPrint} from "@fortawesome/free-solid-svg-icons";
import {Button} from "@cmsgov/design-system-core";

const printWindow = (event) => {
  event.preventDefault();
  window.print();
};

const Print = (props) => {
  const dispatch = useDispatch();

  useEffect(async () => {

    // Get user details
    const {stateUser} = props.state;
    const stateCode = stateUser.currentUser.state.id;

    // Start Spinner
    dispatch({type: "CONTENT_FETCHING_STARTED"});

    // Pull data based on user details
    try {
      await Promise.all([
        dispatch(loadSections({userData: stateUser, stateCode})),
        dispatch(getStateStatus({stateCode})),
        dispatch(getAllStatesData()),
      ])
    } catch (err) {
      console.log("err", err);
    }

    // End isFetching for spinner
    dispatch({type: "CONTENT_FETCHING_FINISHED"});
  }, []);

  let sections = [];

  // Check if formData has values
  const formData = props.state.formData;
  if (formData !== undefined && formData.length != 0) {

    // Loop through each section to get sectionId
    for (let i = 0; i < formData.length; i++) {
      let sectionId = formData[i].contents.section.id;

      // Loop through subsections to get subsectionId
      for (let j = 0; j < formData[i].contents.section.subsections.length; j++) {
        let subsectionId = formData[i].contents.section.subsections[j].id;

        // Add section to sections array
        sections.push(<Section sectionId={sectionId} subsectionId={subsectionId}/>)
      }
    }
  }

  // Return sections with wrapper div and print dialogue box
  return (
    <div className="print-all">
      <Button
        className="ds-c-button--primary ds-c-button--large print-all-btn"
        onClick={printWindow}
        title="Print"
      >
        <FontAwesomeIcon icon={faPrint}/> Print
      </Button>
      {sections}
    </div>);
};

const mapStateToProps = (state) => ({
  username: state.stateUser.currentUser.username,
  state: state,
});

export default connect(mapStateToProps)(Print);
