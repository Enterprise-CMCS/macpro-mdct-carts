import React, { useState } from "react";
import { Button } from "@cmsgov/design-system";
import { useNavigate } from "react-router";
import { apiLib } from "../../util/apiLib";
import { useFlags } from "launchdarkly-react-client-sdk";

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
    } catch {
      window.alert("Error - Contact Support");
    }
    setInprogress(false);
  };

  const defaultYear = useFlags().release2026 ? "2026" : "2025";
  const endYear = 2021;
  const length = Number(defaultYear) - endYear + 1;
  const years = Array.from({ length }, (_, i) => Number(defaultYear) - i);

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
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
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
