import React, { Component } from "react";
import { Button } from "@cmsgov/design-system-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShareSquare, faPrint } from "@fortawesome/free-solid-svg-icons";
import { ShareLinkModal } from "./ShareLinkModal";

class FormActions extends Component {
  constructor(props) {
    super(props);

    this.state = {
      copyUrl: "https://cartsdemo.cms.gov/l32kksf3isdgf823nsd9",
      shareShow: false,
    };

    this.printWindow = this.printWindow.bind(this);
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
  }

  showModal() {
    this.setState({
      shareShow: true
    })
  }

  hideModal() {
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
            onClick={this.showModal}
            title="Share"
          >
            <FontAwesomeIcon icon={faShareSquare} />
            Share
          </Button>
        </div>
        {this.state["shareShow"] && <ShareLinkModal hide={this.hideModal} />}
      </section>
    );
  }
}

export default FormActions;
