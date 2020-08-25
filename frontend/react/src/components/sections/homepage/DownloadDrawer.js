import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faFileAlt } from "@fortawesome/free-solid-svg-icons";

/**
 * 
 * @param {boolean} show Only display download template text boolean is true. 
 * Otherwise show default text.
 */
export const DownloadDrawer = ({ show }) => {
  return (
    show ?
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
              <div className="title-date ds-l-row">
                <div className="title ds-l-col--7">
                  <h3>FY20 template is ready for download</h3>
                </div>
                <div className="date ds-l-col--">AUG, 15, 2019</div>
              </div>
              <p>
                Welcome to CARTS! We’ve incorporated feedback from several states to bring you a better CARTS experience. Contact <a href="mailto:CARTSHELP@cms.hhs.gov?subject=CARTS Help request">CARTSHELP@cms.hhs.gov</a> with any questions.
                  </p>
              <div className="download">
                <button className="ds-c-button ds-c-button--primary">
                  <span>Download template</span>
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      :
      <p className="ds-u-margin-bottom--2">Welcome to CARTS! We’ve incorporated feedback from several states to bring you a better CARTS experience. Contact <a href="mailto:CARTSHELP@cms.hhs.gov?subject=CARTS Help request">CARTSHELP@cms.hhs.gov</a> with any questions.</p>
  )
}
