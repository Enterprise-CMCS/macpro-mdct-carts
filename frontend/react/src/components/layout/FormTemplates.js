import React from "react";
import axios from "../../authenticatedAxios";
import "react-data-table-component-extensions/dist/index.css";
import { Button } from "@cmsgov/design-system-core";
import { useHistory } from "react-router-dom";

const FormTemplates = () => {
  const history = useHistory();

  const handleUpdateTemplates = async () => {
    var selectedYear = document.getElementById("selectedYear").value;

    await axios.post(`/api/v1/updateformtemplates`, {
      year: selectedYear,
    });
    window.alert("Request Completed");
    history.push("/");
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
        >
          Generate New Section Forms
        </Button>
      </div>
    </>
  );
};

export default FormTemplates;
