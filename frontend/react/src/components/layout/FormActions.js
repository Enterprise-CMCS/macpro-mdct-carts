import React, { useState } from "react";
import { Button } from "@cmsgov/design-system-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint, faWindowClose } from "@fortawesome/free-solid-svg-icons";

const FormActions = () => {
  /**
   * Print dialogue box
   * Defaults to false
   */
  const [printShow, setPrintShow] = useState(false);

  /**
   * Opens print dialogue for current view
   *
   * @param {Event} event
   */
  const printWindow = (event) => {
    event.preventDefault();
    window.print();
  };

  const togglePrintDiaglogue = () => {
    setPrintShow(!printShow);
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
        <div className="print-dialogue">
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
                href="/print?dev=dev-ak"
                title="Entire Form"
                target="_blank"
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
