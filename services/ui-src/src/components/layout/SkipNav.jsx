import React from "react";
import PropTypes from "prop-types";

export const SkipNav = ({ id, href = "#main-content", text }) => {
  return (
    <a id={id} href={href} className="skip-nav">
      {text}
    </a>
  );
};

SkipNav.propTypes = {
  id: PropTypes.string.isRequired,
  href: PropTypes.string,
  text: PropTypes.string.isRequired,
};

export default SkipNav;
