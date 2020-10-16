import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loadUserThenSections } from "../../actions/initial";

const InitialDataLoad = ({ userData }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUserThenSections({ userData }));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  // :point-up: We don't need that lint check because the empty dependencies
  // is what we want: only load the data once, period.

  return null;
};

export default InitialDataLoad;
