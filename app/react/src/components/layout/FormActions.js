import React, { Component } from "react";
import { Button } from "@cmsgov/design-system-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShareSquare, faPrint } from "@fortawesome/free-solid-svg-icons";

class FormActions extends Component {
  constructor(props) {
    super(props);

    this.printWindow = this.printWindow.bind(this);
  }

  printWindow(event) {
    event.preventDefault();
    window.print();
  }
  render() {
    return (
      <section className="action-buttons">
        <div className="print-button">
          <Button className="ds-c-button--primary" onClick={this.printWindow}>
            <FontAwesomeIcon icon={faPrint} /> Print
          </Button>
        </div>

        <div className="share-button">
          <Button className="ds-c-button--primary">
            <FontAwesomeIcon icon={faShareSquare} /> Share
          </Button>
        </div>
      </section>
    );
  }
}

export default FormActions;
