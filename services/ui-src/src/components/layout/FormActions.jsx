import React, { useState, useEffect, useRef } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useLocation } from "react-router";
// components
import { Button } from "@cmsgov/design-system";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint, faWindowClose } from "@fortawesome/free-solid-svg-icons";
//types
import { AppRoles } from "../../types";
import {
  DEFAULT_SUBSECTION_MARKER,
  SECTION_THREE_ORDINAL,
  getPrintRouteContext,
  parseStateId,
  parseYear,
  printFormUrl,
} from "../utils/printUrlHelpers";

/**
 * Display available options for form (print)
 *
 * @returns {JSX.Element}
 * @constructor
 */
const FormActions = () => {
  const [currentUser, formYear] = useSelector(
    (state) => [state.stateUser.currentUser, state.global.formYear],
    shallowEqual
  );
  const { pathname } = useLocation();

  // Initialise printDialogeRef
  const printDialogeRef = useRef(null);

  const role = currentUser.role;
  const {
    routeStateId,
    routeYear,
    routeSectionOrdinal,
    routeSubsectionMarker,
  } = getPrintRouteContext(role, pathname);

  const safeFormYear = parseYear(formYear) ?? routeYear;
  const safeStateId =
    role === AppRoles.STATE_USER
      ? parseStateId(currentUser.state?.id)
      : routeStateId;

  const sectionId =
    safeFormYear && routeSectionOrdinal
      ? `${safeFormYear}-${routeSectionOrdinal}`
      : null;

  const subsectionMarker =
    routeSectionOrdinal === SECTION_THREE_ORDINAL
      ? (routeSubsectionMarker ?? DEFAULT_SUBSECTION_MARKER)
      : DEFAULT_SUBSECTION_MARKER;

  const subsectionId = sectionId ? `${sectionId}-${subsectionMarker}` : null;

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
   * Generates the URL to print a form.
   * @param {string} formYear - the year associated with the report
   * @return {string} The URL string
   */
  return (
    <section className="action-buttons">
      <div className="print-button">
        <Button
          className="ds-c-button--solid ds-c-button--small"
          onClick={togglePrintDialogue}
          title="Print"
          data-testid="print-show"
        >
          <FontAwesomeIcon icon={faPrint} /> Print
        </Button>
      </div>
      {printShow ? (
        <div className="print-dialogue" ref={printDialogeRef}>
          <div className="close">
            <Button
              className="ds-c-button--ghost ds-c-button--small"
              onClick={togglePrintDialogue}
              data-testid="print-hide"
              title="close"
            >
              <FontAwesomeIcon icon={faWindowClose} />
            </Button>
          </div>
          <h4 data-testid="print-title">Print</h4>
          <div className="print-options">
            <div className="print-page">
              <Button
                className="ds-c-button--solid ds-c-button--small"
                href={printFormUrl(
                  safeFormYear,
                  safeStateId,
                  sectionId,
                  subsectionId
                )}
                title="This Section"
                target="_blank"
                onClick={togglePrintDialogue}
                data-testid="print-page"
              >
                <FontAwesomeIcon icon={faPrint} /> This Section
              </Button>
            </div>
            <div className="print-form">
              <Button
                className="ds-c-button--solid ds-c-button--small"
                href={printFormUrl(safeFormYear, safeStateId)}
                title="Entire Form"
                target="_blank"
                onClick={togglePrintDialogue}
                data-testid="print-form"
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
