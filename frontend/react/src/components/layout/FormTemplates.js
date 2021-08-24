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
  const [newFormYear, setNewFormYear] = useState(2020)

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

    setNewFormYear(event.target.value)
    console.log("[DEBUG]: Current Form Year:" + newFormYear)
    //setFormTemplates(newForms);
  };
  const handleSave = () => {
    console.log("[DEBUG: save triggered");
    let newForms = [...formTemplates];
    // newForms[index].contents = event.target.value;
    //let section = document.getElementById("ft-0")
   // let jsonparse = JSON.parse(section.textContent)
    let newFormTemplates = [];
    newForms.map((item, index) =>
    {
     // console.log(JSON.stringify(item["contents"]).replace("2020","2323"))
      let re = new RegExp(`2021`, 'g');
      let item2 = JSON.parse(JSON.stringify(item).replace(re,newFormYear))
      let re2 = new RegExp(`2020`, 'g');
      let item3 = JSON.parse(JSON.stringify(item2).replace(re2,newFormYear-2))
      newFormTemplates.push(item3)
    });
    console.log(JSON.stringify(newFormTemplates))
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
      </select> {newFormYear}
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
