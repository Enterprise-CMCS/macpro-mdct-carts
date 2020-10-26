import React, { useState } from "react";
import { Button } from "@cmsgov/design-system-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";

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
  }
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
        <h4>Print</h4>
        <div className="print-options">
          <div className="print-page">
            <Button
              className="ds-c-button--primary ds-c-button--small"
              onClick={printWindow}
              title="This Page"
            >
              <FontAwesomeIcon icon={faPrint} /> This Page
            </Button>
          </div>
          <div className="print-form">
            <Button
              className="ds-c-button--primary ds-c-button--small"
              href="/print?dev=dev-ak"
              title="Entire Form"
            >
              <FontAwesomeIcon icon={faPrint} /> Entire Form
            </Button>
          </div>
        </div>
      </div>) : null }
    </section>
  );
};

export default FormActions;
