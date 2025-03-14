import React from "react";
import { useSelector } from "react-redux";

const Spinner = () => {
  const isFetching = useSelector((state) => state.global.isFetching);

  return isFetching ? (
    <div className="preloader">
      <div className="preloader-image">
        <img
          data-testid="spinner-img"
          src={`/img/spinner.gif`}
          alt="Loading. Please wait."
        />
      </div>
    </div>
  ) : null;
};

export default Spinner;
