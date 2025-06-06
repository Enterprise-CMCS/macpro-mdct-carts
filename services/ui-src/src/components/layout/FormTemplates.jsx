import React, { useState } from "react";
import { Button } from "@cmsgov/design-system";
import { useNavigate } from "react-router-dom";
import { apiLib } from "../../util/apiLib";

const FormTemplates = () => {
  const navigate = useNavigate();
  const [inProgress, setInprogress] = useState(false);

  const handleUpdateTemplates = async () => {
    var selectedYear = document.getElementById("selectedYear").value;
    setInprogress(true);

    try {
      const opts = {
        body: { year: selectedYear },
      };
      await apiLib.post("/formTemplates", opts);
      window.alert("Request Completed");
      navigate("/");
    } catch (e) {
      window.alert("Error - Contact Support");
    }
    setInprogress(false);
  };

  const defaultYear = "2024";

  return (
    <div className="ds-l-container">
      <div className="ds-l-row ds-u-padding-left--2">
        <div>
          <h1>Generate Form Base Templates</h1>
          <h3>Select Year</h3>
          <select
            className="ds-c-field"
            name="selectedYear"
            id="selectedYear"
            data-testid="generate-forms-options"
            defaultValue={defaultYear}
          >
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
            <option value="2021">2021</option>
          </select>
          <Button
            type="button"
            className="ds-c-button ds-c-button--solid"
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
      </div>
    </div>
  );
};

export default FormTemplates;
