import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

export const NotFoundPage = () => {
  return (
    <div className="page-info ds-l-container">
      <div className="ds-l-col--12 notfound">
        <header>
          <h1>
            <FontAwesomeIcon
              icon={faTriangleExclamation}
              className="notfound-icon"
            />
            Page not found
          </h1>
        </header>
        <main className="main">
          <h2>
            Sorry, the page you're looking for couldn't be found. It's possible
            that this page has moved, or the address may have been typed
            incorrectly.
          </h2>
          <p>
            Please email{" "}
            <a href="mailto:mdct_help@cms.hhs.gov">mdct_help@cms.hhs.gov</a> for
            help or feedback.
          </p>
          <p>
            Note: If you were using a bookmark, please reset it once you find
            the correct page.
          </p>
        </main>
      </div>
    </div>
  );
};
