import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loadSections } from "../../actions/initial";

const InitialDataLoad = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadSections());
  }, []);

  return null;
};

export default InitialDataLoad;
