import React, { useState } from "react";
import axios from "../../authenticatedAxios";
import "react-data-table-component-extensions/dist/index.css";
import { Button } from "@cmsgov/design-system-core";
import { useHistory } from "react-router-dom";

const FormTemplates = () => {
  const history = useHistory();
  const [inProgress, setInprogress] = useState(false);

  const handleUpdateTemplates = async () => {
    var selectedYear = document.getElementById("selectedYear").value;
    setInprogress(true);

    try {
      await axios.post(`/api/v1/updateformtemplates`, {
        year: selectedYear,
      });
      window.alert("Request Completed");
      history.push("/");
    } catch (e) {
      window.alert("Error - Contact Support");
    }
    setInprogress(false);
  };

  return (
    <>
      <div>
        <h1>Generate Form Base Templates</h1>
        <h3>Select Year</h3>
        <select
          className="ds-c-field"
          name="selectedYear"
          id="selectedYear"
          // onChange={loadSectionBaseBySection}
        >
          <option value="2021" selected>
            2021
          </option>
        </select>
        <Button
          type="button"
          className="ds-c-button ds-c-button--primary"
          onClick={handleUpdateTemplates}
          disabled={inProgress}
        >
          Generate New Section Forms
        </Button>
        {inProgress && (
          <div style={{ color: "red" }}>Running Please wait ....</div>
        )}
      </div>
    </>
  );
};

export default FormTemplates;