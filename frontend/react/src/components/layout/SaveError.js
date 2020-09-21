import { Alert } from "@cmsgov/design-system-core";
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";

import { selectHasError } from "../../store/save.selectors";

const SaveError = ({ hasError }) => {
  const className = hasError ? "alert--unexpected-error__active" : "";

  return (
    <div
      aria-hidden={!hasError}
      aria-live="polite"
      className={`alert--unexpected-error ${className}`}
    >
      <Alert
        heading="There's been an unexpected error."
        role="alertdialog"
        variation="warn"
      >
        We weren&lsquo;t able to save your latest changes. Try saving in a few
        minutes. If you continue to see this message, refresh your browser.
        Before this issue is resolved, new changes may be lost if you continue
        to make edits or if you refresh your browser.
      </Alert>
    </div>
  );
};

SaveError.propTypes = {
  hasError: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  hasError: selectHasError(state),
});

export default connect(mapStateToProps)(SaveError);
