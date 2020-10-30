import React, {useEffect, useState} from "react";
import { connect, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@cmsgov/design-system-core";
import PropTypes from "prop-types";
import {
  getAllStatesData,
  getStateStatus,
  loadSections,
} from "../../actions/initial";
import Section from "../layout/Section";
import {useOktaAuth} from "@okta/okta-react";

const printWindow = (event) => {
  event.preventDefault();
  window.print();
};



const Print = ({currentUser, myState}) => {
  const dispatch = useDispatch();
let n =0;
  useEffect( () => {

    const retrieveUserData = async (myState, currentUser, dispatch) => {
      // Get user details
      const { stateUser } = myState;
      const stateCode = stateUser.abbr;
      let a = 0;
      // Start Spinner
      dispatch({ type: "CONTENT_FETCHING_STARTED" });
      let b = 0;
      // Pull data based on user details
      await Promise.all([
        dispatch(loadSections({ userData: currentUser, stateCode })),
        // dispatch(getStateStatus({ stateCode })),
        // dispatch(getAllStatesData()),
      ]);

      // End isFetching for spinner
      dispatch({ type: "CONTENT_FETCHING_FINISHED" });
    }

    retrieveUserData(myState, currentUser, dispatch)
  }, [currentUser]);

  const sections = [];

  // Check if formData has values
  const { state } = myState;
  const { formData } = myState;
let a =0;
  if (formData !== undefined && formData.length !== 0) {
    // Loop through each section to get sectionId
    /* eslint-disable no-plusplus */
    for (let i = 0; i < formData.length; i++) {
      const sectionId = formData[i].contents.section.id;

      // Loop through subsections to get subsectionId
      /* eslint-disable no-plusplus */
      for (
        let j = 0;
        j < formData[i].contents.section.subsections.length;
        j++
      ) {
        const subsectionId = formData[i].contents.section.subsections[j].id;

        // Add section to sections array
        sections.push(
          <Section
            sectionId={sectionId}
            subsectionId={subsectionId}
            readonly="false"
          />
        );
      }
    }
  }

  // Return sections with wrapper div and print dialogue box
  return (
    <div className="print-all">
      <div className="print-directions">
        <p>Click below to print full CARTS report shown here</p>
        <Button
          className="ds-c-button--primary ds-c-button--large print-all-btn"
          onClick={printWindow}
          title="Print"
        >
          <FontAwesomeIcon icon={faPrint} /> Print
        </Button>
      </div>

      {sections}
      <Button
        className="ds-c-button--primary ds-c-button--large print-all-btn"
        onClick={printWindow}
        title="Print"
      >
        <FontAwesomeIcon icon={faPrint} /> Print
      </Button>
    </div>
  );
};

Print.propTypes = {
  state: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  currentUser: state.stateUser,
  myState: state,
});

export default connect(mapStateToProps)(Print);
