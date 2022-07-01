import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDown,
  faMinus,
  faFileAlt,
} from "@fortawesome/free-solid-svg-icons";

export const TemplateDownload = ({ getTemplate }) => {
  return (
    <div className="ds-l-row">
      <div className="updates ds-l-col--12">
        <h4>Updates from Central Office</h4>
        <div className="update-date">Aug 2021</div>
        <div className="update ds-l-row">
          <div className="icon ds-l-col--2">
            <div className="icon-inner">
              <FontAwesomeIcon icon={faFileAlt} />
            </div>
          </div>
          <div className="update-contents ds-l-col--10">
            <div className="title">
              <h3>Your fiscal year 2021 template is ready for download</h3>
            </div>
            <p>
              Download your template for the current reporting period below.
              Please contact{" "}
              <a href="mailto:mdct_help@cms.hhs.gov?subject=CARTS Help request">
                mdct_help@cms.hhs.gov
              </a>{" "}
              with any questions.
            </p>
            <div className="download">
              <button
                className="ds-c-button ds-c-button--primary"
                onClick={() => getTemplate()}
              >
                <span className="button-display">Download template</span>
                <span className="fa-layers fa-fw">
                  <FontAwesomeIcon
                    icon={faArrowDown}
                    transform="up-2 right-2"
                    position
                  />
                  <FontAwesomeIcon
                    icon={faMinus}
                    transform="down-10 right-2"
                    size="sm"
                  />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

TemplateDownload.propTypes = {
  getTemplate: PropTypes.func.isRequired,
};
