import React, { useState, useEffect } from "react";
import axios from "../../authenticatedAxios";
import "react-data-table-component-extensions/dist/index.css";
import { useDispatch } from "react-redux";
import { Button } from "@cmsgov/design-system-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
/**
 * Display all users with options
 *
 *
 * @constructor
 */

const FormTemplates = () => {
  const dispatch = useDispatch();
  const [formTemplates, setFormTemplates] = useState([]);

  const loadFormTemplateData = async () => {
    dispatch({ type: "CONTENT_FETCHING_STARTED" });

    try {
      console.log("before axios call");
      let { data } = await axios.get(`/api/v1/formtemplates/${2020}`);
      console.log("zzzData", data);
      let a;
      setFormTemplates(data);
    } catch (e) {
      console.log("Error pulling users data: ", e);
    }
    dispatch({ type: "CONTENT_FETCHING_FINISHED" });
  };

  useEffect(async () => {
    await loadFormTemplateData();
  }, []);

  const updateField = (event, index) => {
    console.log("zzzEvent", event);
    let newForms = [...formTemplates];
    // newForms[index].contents = event.target.value;
    newForms[index].contents = JSON.parse(event.target.value);
    setFormTemplates(newForms);
  };
  const handleSave = () => {
    console.log("save triggered");
  };

  return (
    <div className="form-templates">
      <h1>Form Templates</h1>
      <h3>Year Selector</h3>
      {formTemplates.map((item, index) => (
        <div className="form-template-input" key={index}>
          <label for={`ft-${index}`}>Section {item.section}:</label>
          <textarea id={`ft-${index}`} onChange={(e) => updateField(e, index)}>
            {JSON.stringify(item.contents, null, 2)}
          </textarea>
        </div>
      ))}
      <Button
        type="button"
        className="ds-c-button ds-c-button--primary"
        onClick={handleSave}
      >
        <FontAwesomeIcon icon={faSave} /> Save
      </Button>
    </div>
  );
};

export default FormTemplates;
