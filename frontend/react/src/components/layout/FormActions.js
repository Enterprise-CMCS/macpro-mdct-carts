import React, { Component } from "react";
import { Button } from "@cmsgov/design-system-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShareSquare, faPrint } from "@fortawesome/free-solid-svg-icons";
import { faWindowClose, faCopy } from "@fortawesome/free-regular-svg-icons";

class FormActions extends Component {
  constructor(props) {
    super(props);

    this.state = {
      copyUrl: "https://cartsdemo.cms.gov/l32kksf3isdgf823nsd9",
      shareShow: false,
    };

    this.printWindow = this.printWindow.bind(this);
    this.copyInput = this.copyInput.bind(this);
    this.toggleShare = this.toggleShare.bind(this);
  }

  /**
   * Toggle state value for showing shareURL box
   *
   * @param {Event} event
   */
  toggleShare(event) {
    this.setState({
      shareShow: this.state.shareShow ? false : true,
    });
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

  /**
   * Copy contents from share URL input
   *
   */
  copyInput() {
    this.shareURL.select();
    document.execCommand("copy");
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
          <div
            className={
              "share-container " + (this.state["shareShow"] ? "active" : "")
            }
          >
            <div className="close">
              <Button
                className="ds-c-button--transparent ds-c-button--small"
                onClick={this.toggleShare}
                title="close"
              >
                <FontAwesomeIcon icon={faWindowClose} />
              </Button>
            </div>
            <h4>Share your progress</h4>
            <div className="form">
              <form>
                <input
                  type="text"
                  value={this.state.copyUrl}
                  ref={(shareURL) => (this.shareURL = shareURL)}
                />
              </form>
            </div>
            <div className="copy">
              <Button
                className="ds-c-button--transparent ds-c-button--small"
                onClick={this.copyInput}
                title="Copy to clipboard"
              >
                <FontAwesomeIcon icon={faCopy} />
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default FormActions;
