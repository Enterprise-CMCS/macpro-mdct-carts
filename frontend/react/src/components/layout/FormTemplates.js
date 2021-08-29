import React, { useState, useEffect } from "react";
import axios from "../../authenticatedAxios";
import "react-data-table-component-extensions/dist/index.css";
import { Button } from "@cmsgov/design-system-core";

const FormTemplates = ({ formYear }) => {

  const handleSave = async () => {

    var selectedYear = document.getElementById("selectedYear");
      // TODO: Remove dev-admin demo test code.
    let {data} = await axios.post(
        `/api/v1/updateformtemplates?dev=dev-admin`,{
            "year": selectedYear.value
        }
    )
    window.alert("Request Completed")
  };

  return (
    <div className="form-templates">
      <h1>Generate Section Forms</h1>
      <h3>Select Year for Form Generation</h3>
      <select  className="ds-c-field" name="selectedYear" id="selectedYear" >
        <option value="2021">2021</option>
        <option value="2022">2022</option>
        <option value="2023">2023</option>
        <option value="2024">2024</option>
      </select>
        <br/>
      <Button
        type="button"
        className="ds-c-button ds-c-button--primary"
        onClick={handleSave}
      >
       Generate New Section Forms
      </Button>
    </div>
  );
};

export default FormTemplates;
