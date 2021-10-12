import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faFileAlt } from "@fortawesome/free-solid-svg-icons";

export const DownloadDrawer = () => {
  return (
    <div className="ds-l-row">
      <div className="updates ds-l-col--12">
        <h4>Updates from Central Office</h4>
        <div className="update ds-l-row">
          <div className="icon ds-l-col--2">
            <div className="icon-inner">
              <FontAwesomeIcon icon={faFileAlt} />
            </div>
          </div>
          <div className="update-contents ds-l-col--10">
            <div className="title">
              <h3>FY21 template is ready for download</h3>
            </div>
            <p>
              Welcome to CARTS! We’ve incorporated feedback from several states
              to bring you a better CARTS experience. Contact{" "}
              <a href="mailto:mdct_help@cms.hhs.gov?subject=CARTS Help request">
                mdct_help@cms.hhs.gov
              </a>{" "}
              with any questions.
            </p>
            <div className="download">
              <a
                href={"docs/FFY_2021_CARTS_Template.pdf"}
                download
                aria-label="Download Template"
              >
                <button className="ds-c-button ds-c-button--primary">
                  <span>Download template</span>
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
