import React from "react";
import { Alert } from "@cmsgov/design-system";
import PropTypes from "prop-types";

export const AlertNotification = ({ title, description, variation }) => (
  <Alert variation={variation} heading={title}>
    {description}
  </Alert>
);

AlertNotification.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  variation: PropTypes.oneOf(["error", "warn", "success"]).isRequired,
};
