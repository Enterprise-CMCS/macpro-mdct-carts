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

  const handleUpdateSection = async () => {
    var selectedYear = document.getElementById("selectedYear").value;
    var selectedSection = document.getElementById("selectedSection").value;
    var sectionJSONEditor = document.getElementById("sectionJSONEditor");

    // TODO: Remove dev-admin demo test code.
    let { data } = await axios.post(
      `/api/v1/updateformsection/${selectedYear}?dev=dev-admin`,
      {
        section: selectedSection,
        contents: sectionJSONEditor.innerText,
      }
    );
    setFormSectionBase(data);
    window.alert("Request Completed");

    //history.push("/");
  };

  const handleChange = () => {
    var sectionJSONEditor = document.getElementById("sectionJSONEditor");
    //setFormSectionBase(e.json);
    window.alert("Request Update" + sectionJSONEditor.innerText);
  };

  const handleUpdateTemplates = async () => {
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
          <option value="2022">2022</option>
          <option value="2023">2023</option>
          <option value="2024">2024</option>
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
