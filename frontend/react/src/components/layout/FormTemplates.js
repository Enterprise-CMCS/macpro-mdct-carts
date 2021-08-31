import React, { useState, useEffect } from "react";
import axios from "../../authenticatedAxios";
import "react-data-table-component-extensions/dist/index.css";
import { Button } from "@cmsgov/design-system-core";
import { useHistory } from "react-router-dom";
import JSONInput from "react-json-editor-ajrm";
import locale from "react-json-editor-ajrm/locale/en";

const FormTemplates = () => {
  const history = useHistory();
  const [formSectionBase, setFormSectionBase] = useState();

  const loadSectionBaseBySection = async () => {
    var selectedYear = document.getElementById("selectedYear").value;
    var selectedSection = document.getElementById("selectedSection").value;

    // TODO: Remove dev-admin demo test code.
    let { data } = await axios.post(
      `/api/v1/formtemplates/${selectedYear}?dev=dev-admin`,
      {
        section: selectedSection,
      }
    );
    setFormSectionBase(data);
    window.alert("Request Completed");
  };

  const handleUpdate = async () => {
    var sectionJSONEditor = document.getElementById("sectionJSONEditor");
    window.alert("Request Update" + JSON.stringify(sectionJSONEditor.toJSON()));
    //history.push("/");
  };

  const handleChange = async (e) => {
    var sectionJSONEditor = document.getElementById("sectionJSONEditor");
    //setFormSectionBase(e.json);
    window.alert("Request Update" + sectionJSONEditor.innerText);
  };

  const handleSubmit = async () => {
    var selectedYear = document.getElementById("selectedYear");

    // TODO: Remove dev-admin demo test code.
    let { data } = await axios.post(
      `/api/v1/updateformtemplates?dev=dev-admin`,
      {
        year: selectedYear.value,
      }
    );
    window.alert("Request Completed");
    history.push("/");
  };

  return (
    <>
      <div>
        <h1>Generate Form Base Templates</h1>
        <div>
          <h3>Select Year</h3>
          <select
            className="ds-c-field"
            name="selectedYear"
            id="selectedYear"
            // onChange={loadSectionBaseBySection}
          >
            <option value="2020" selected>
              2020
            </option>
            <option value="2021">2021</option>
            <option value="2022">2022</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
          </select>
          <Button
            type="button"
            className="ds-c-button ds-c-button--primary"
            onClick={handleSubmit}
          >
            Generate New Section Forms
          </Button>
          <h3>Select Section</h3>
          <select
            className="ds-c-field"
            name="selectedSection"
            id="selectedSection"
            //onChange={loadSectionBaseBySection}
          >
            <option value="0" selected>
              Basic State Information
            </option>
            <option value="1">Program Fees and Policy Changes</option>
            <option value="2">Enrollment and Uninsured</option>
            <option value="3">Eligibility, Enrollment, and Operations</option>
            <option value="4">State Plan Goals and Objectives</option>
            <option value="5">Program Financing</option>
            <option value="6">Challenges and Accomplishments</option>
          </select>
          <Button
            type="button"
            className="ds-c-button ds-c-button--primary"
            onClick={loadSectionBaseBySection}
          >
            Edit Section Template
          </Button>
          <hr />
          <br />
        </div>
        <div>
          <JSONInput
            id="sectionJSONEditor"
            placeholder={formSectionBase}
            locale={locale}
            width="700px"
            height="550px"
            onBlur={handleChange}
          />
          <Button
            type="button"
            className="ds-c-button ds-c-button--primary"
            onClick={handleUpdate}
          >
            Update Section
          </Button>
        </div>
      </div>
    </>
  );
};

export default FormTemplates;
