import React, { useState, useEffect, useRef } from "react";
import { Button } from "@cmsgov/design-system-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint, faWindowClose } from "@fortawesome/free-solid-svg-icons";

/**
 * Display available options for form (print)
 *
 * @returns {JSX.Element}
 * @constructor
 */
const FormActions = () => {
  // Initialise printDialogeRef
  const printDialogeRef = useRef(null);

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
  const togglePrintDiaglogue = () => {
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
    togglePrintDiaglogue();
    window.print();
  };

  return (
    <section className="action-buttons">
      <div className="print-button">
        <Button
          className="ds-c-button--primary ds-c-button--small"
          onClick={togglePrintDiaglogue}
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
              onClick={togglePrintDiaglogue}
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
                href="/print"
                title="Entire Form"
                target="_blank"
                onClick={togglePrintDiaglogue}
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

export default FormActions;
