import React from "react";
import { Integer } from "./Integer";

const Money = ({ ...props }) => {
  return <Integer {...props} inputMode="currency" mask="currency" />;
};

export { Money };
