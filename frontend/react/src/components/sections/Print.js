import React, { useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@cmsgov/design-system-core";
import PropTypes from "prop-types";
import { loadSections } from "../../actions/initial";
import Section from "../layout/Section";

// Print page
const printWindow = (event) => {
  event.preventDefault();
  window.print();
};

/**
 * Generate data and load entire form based on user information
 *
 * @param currentUser
 * @param state
 * @returns {JSX.Element}
 * @constructor
 */
const Print = ({ stateUser, formData }) => {
  const dispatch = useDispatch();

  // Load formData via side effect
  useEffect(() => {
    // Create function to call data to prevent return data from useEffect
    const retrieveUserData = async () => {
      /* eslint-disable-line */
      const stateCode = stateUser.abbr;
      // Start Spinner
      dispatch({ type: "CONTENT_FETCHING_STARTED" });

      // Pull data based on user details
      await Promise.all([
        dispatch(loadSections({ userData: stateUser, stateCode })),
      ]);

      // End isFetching for spinner
      dispatch({ type: "CONTENT_FETCHING_FINISHED" });
    };

    // Call async function to load data
    retrieveUserData();
  }, [stateUser]);

  const sections = [];

  // Check if formData has values
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
  stateUser: PropTypes.object.isRequired,
  formData: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  stateUser: state.stateUser || "",
  formData: state.formData || undefined,
});

export default connect(mapStateToProps)(Print);
