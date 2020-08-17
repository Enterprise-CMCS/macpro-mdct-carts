import React, { Component } from "react";
import { Button } from "@cmsgov/design-system-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShareSquare, faPrint } from "@fortawesome/free-solid-svg-icons";
import { ShareLinkModal } from "./ShareLinkModal";

class FormActions extends Component {
  constructor(props) {
    super(props);

    this.state = {
      shareShow: false,
    };

    this.printWindow = this.printWindow.bind(this);
    this.toggleShare = this.toggleShare.bind(this);
  }

  toggleShare() {
    this.setState({
      shareShow: this.state.shareShow ? false : true,
    })
  }

  /**
   * Opens print dialogue for current view
   *
   * @param {Event} event
   */
  printWindow(event) {
    event.preventDefault();
    window.print();
  }

  render() {
    return (
      <section className="action-buttons">
        <div className="print-button">
          <Button
            className="ds-c-button--primary ds-c-button--small"
            onClick={this.printWindow}
            title="Print"
          >
            <FontAwesomeIcon icon={faPrint} /> Print
          </Button>
        </div>

        <div className="share-button">
          <Button
            className="ds-c-button--primary ds-c-button--small"
            onClick={this.toggleShare}
            title="Share"
          >
            <FontAwesomeIcon icon={faShareSquare} />
            Share
          </Button>
        </div>

        {this.state["shareShow"] && <ShareLinkModal hide={this.toggleShare} />}
      </section>
    );
  }
}

export default FormActions;
