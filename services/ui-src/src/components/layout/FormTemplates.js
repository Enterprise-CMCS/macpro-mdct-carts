import requestOptions from "../../hooks/authHooks/requestOptions";
import React, { useState } from "react";
import "react-data-table-component-extensions/dist/index.css";
import { Button } from "@cmsgov/design-system";
import { useHistory } from "react-router-dom";
import { apiLib } from "../../util/apiLib";

const FormTemplates = () => {
  const history = useHistory();
  const [inProgress, setInprogress] = useState(false);

  const handleUpdateTemplates = async () => {
    var selectedYear = document.getElementById("selectedYear").value;
    setInprogress(true);

    try {
      const opts = await requestOptions({ year: selectedYear });
      await apiLib.post("carts-api", "/formTemplates", opts);
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
          data-testid="generate-forms-options"
          defaultValue="2022"
          // onChange={loadSectionBaseBySection}
        >
          <option value="2022">2022</option>
          <option value="2021">2021</option>
        </select>
        <Button
          type="button"
          className="ds-c-button ds-c-button--primary"
          onClick={handleUpdateTemplates}
          disabled={inProgress}
          data-testid="generate-forms-button"
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
