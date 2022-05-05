import React, { useState, useEffect, useRef } from "react";
import { Button } from "@cmsgov/design-system-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint, faWindowClose } from "@fortawesome/free-solid-svg-icons";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { UserRoles } from "../../types";

/**
 * Display available options for form (print)
 *
 * @returns {JSX.Element}
 * @constructor
 */
const FormActions = (props) => {
  // Initialise printDialogeRef
  const printDialogeRef = useRef(null);
  const { currentUser, formYear } = props;

  /**
   * Print dialogue box state
   * Defaults to false
   */
  const [printShow, setPrintShow] = useState(false);

  /**
   * If click occurs outside component, setPrintShow to false
   */
  const useOutsideAlerter = (ref) => {
    useEffect(() => {
      // if clicked on outside of element
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setPrintShow(false);
        }
      }

      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  };

  useOutsideAlerter(printDialogeRef);

  /**
   * Toggles printDialogue component display
   */
  const togglePrintDialogue = () => {
    setPrintShow(!printShow);
  };

  /**
   * Opens print dialogue for current view
   *
   * @param {Event} event
   */
  const printWindow = (event) => {
    event.preventDefault();

    // Close dialogue box
    togglePrintDialogue();
    window.print();
  };

  /**
   * Generates the URL to print an entire form.
   * @param {object} currentUser - the current user object
   * @param {string} formYear - the year associated with the report
   * @return {string} The URL string
   */
  const printEntireFormUrl = (currentUser, formYear) => {
    let urlString = "";

    if (currentUser.role === UserRoles.STATE) {
      urlString = `/print?year=${formYear}&state=${currentUser.state.id}`;
    } else {
      urlString = `/print?year=${formYear}&state=${
        window.location.href.split("/")[5]
      }`;
    }

    return urlString;
  };

  return (
    <section className="action-buttons">
      <div className="print-button">
        <Button
          className="ds-c-button--primary ds-c-button--small"
          onClick={togglePrintDialogue}
          title="Print"
        >
          <FontAwesomeIcon icon={faPrint} /> Print
        </Button>
      </div>
      {printShow ? (
        <div className="print-dialogue" ref={printDialogeRef}>
          <div className="close">
            <Button
              className="ds-c-button--transparent ds-c-button--small"
              onClick={togglePrintDialogue}
              title="close"
            >
              <FontAwesomeIcon icon={faWindowClose} />
            </Button>
          </div>
          <h4>Print</h4>
          <div className="print-options">
            <div className="print-page">
              <Button
                className="ds-c-button--primary ds-c-button--small"
                onClick={printWindow}
                title="This Section"
              >
                <FontAwesomeIcon icon={faPrint} /> This Section
              </Button>
            </div>
            <div className="print-form">
              <Button
                className="ds-c-button--primary ds-c-button--small"
                href={printEntireFormUrl(currentUser, formYear)}
                title="Entire Form"
                target="_blank"
                onClick={togglePrintDialogue}
              >
                <FontAwesomeIcon icon={faPrint} /> Entire Form
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
};

FormActions.propTypes = {
  currentUser: PropTypes.object.isRequired,
  formYear: PropTypes.object.isRequired,
};

export const mapStateToProps = (state) => ({
  currentUser: state.stateUser.currentUser,
  formYear: state.global.formYear,
});

export default connect(mapStateToProps)(FormActions);
