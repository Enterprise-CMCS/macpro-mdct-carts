import React from 'react'
import { Button } from "@cmsgov/design-system-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWindowClose, faCopy } from "@fortawesome/free-regular-svg-icons";

export const ShareLinkCopy = _ => {
  return (
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

  )
}