import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loadSections } from "../../actions/initial";
import { getProgramData, getStateData, getUserData } from "../../store/stateUser";

const InitialDataLoad = ({userData}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserData(userData.currentUser));
    dispatch(getProgramData(userData));
    dispatch(getStateData(userData));
    dispatch(loadSections(userData));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  // :point-up: We don't need that lint check because the empty dependencies
  // is what we want: only load the data once, period.

  return null;
};

export default InitialDataLoad;
