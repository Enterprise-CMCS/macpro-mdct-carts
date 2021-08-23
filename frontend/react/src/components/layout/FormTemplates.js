import React, { useState, useEffect } from "react";
import axios from "../../authenticatedAxios";
import "react-data-table-component-extensions/dist/index.css";
import { useDispatch } from "react-redux";
import { Button } from "@cmsgov/design-system-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { connect } from "react-redux";

/**
 * Display all users with options
 *
 *
 * @constructor
 */

const FormTemplates = ({formYear}) => {
  const dispatch = useDispatch();
  const [formTemplates, setFormTemplates] = useState([]);

  const loadFormTemplateData = async () => {
    dispatch({ type: "CONTENT_FETCHING_STARTED" });

    try {
      /* TODO:  get from Global Redux Store */
      let { data } = await axios.get(`/api/v1/formtemplates/${formYear}?dev=dev-admin`);
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
    // TODO: Work in progress need to make change to DB.
    let newForms = [...formTemplates];
    // newForms[index].contents = event.target.value;
    let section = document.getElementById("ft-0")
    let jsonparse = JSON.parse(section.textContent)
    let re = new RegExp(`${jsonparse.section["year"]}`, 'g');
    section.textContent = section.textContent.replace(re, event.target.value)
    newForms.push(section.textContent)
    setFormTemplates(newForms);
  };
  const handleSave = () => {
    console.log("save triggered");
  };

  return (
    <div className="form-templates">
      <h1>Form Templates</h1>
      <h3>Year Selector: {formYear}</h3>
      <select name="selectedYear" id="selectedYear" onChange={updateField}>
        <option value="2021">2021</option>
        <option value="2022">2022</option>
        <option value="2023">2023</option>
        <option value="2024">2024</option>
      </select>
      {formTemplates.map((item, index) => (
        <div className="form-template-input" key={index}>
          <label for={`ft-${index}`}>Section {item.section}:</label>
          <textarea id={`ft-${index}`} rows="24" cols="60" onChange={(e) => updateField(e, index)}>
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

const mapState = (state) => ({
  formYear: state.global.formYear
});

export default connect(mapState)(FormTemplates);
