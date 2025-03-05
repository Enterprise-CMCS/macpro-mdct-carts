import React from "react";
import Homepage from "../sections/homepage/Homepage";
import SaveError from "./SaveError";
import ScrollToTop from "../utils/ScrollToTop";

const StateHome = () => {
  return (
    <>
      <SaveError />
      <ScrollToTop />
      <Homepage />
    </>
  );
};
export default StateHome;
