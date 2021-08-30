import React, { useState, useEffect } from "react";
import axios from "../../authenticatedAxios";
import "react-data-table-component-extensions/dist/index.css";
import { Button } from "@cmsgov/design-system-core";
import {useHistory} from "react-router-dom";
import {JSONEditor} from "react-json-editor-viewer";
import JSONInput from "react-json-editor-ajrm";
import locale    from "react-json-editor-ajrm/locale/en";
const styles = {
    dualView: {
        display: "flex",
    },
    jsonViewer: {
        borderLeft: "1px dashed white",
        lineHeight: 1.25,
        width: "50%",
        borderLeft: "1px solid lightgrey",
        margin: 10,
    },
    jsonEditor: {
        width: "50%",
        fontSize: 12,
        fontFamily: "Lucida Console, monospace",
        lineHeight: 1.25,
    },
    root: {
        fontSize: 12,
        fontFamily: "Lucida Console, monospace",
        lineHeight: 1.25,
        /*color: "#3E3D32"*/
    },
    label: {
        color: "DeepPink",
        marginTop: 3,
    },
    value: {
        marginLeft: 10,
    },
    row: {
        display: "flex",
    },
    withChildrenLabel: {
        color: "DeepPink",
    },
    select: {
        borderRadius: 3,
        borderColor: "grey",
        backgroundColor: "DimGray",
        color: "khaki",
    },
    input: {
        borderRadius: 3,
        border: "1px solid #272822",
        padding: 2,
        fontFamily: "Lucida Console, monospace",
        fontSize: 12,
        backgroundColor: "gray",
        color: "khaki",
        width: "200%",
    },
    addButton: {
        cursor: "pointer",
        color: "LightGreen",
        marginLeft: 15,
        fontSize: 12,
    },
    removeButton: {
        cursor: "pointer",
        color: "magenta",
        marginLeft: 15,
        fontSize: 12,
    },
    saveButton: {
        cursor: "pointer",
        color: "green",
        marginLeft: 15,
        fontSize: 12,
    },
    builtin: {
        color: "green",
        fontSize: 12,
    },
    text: {
        color: "black",
        fontSize: 12,
    },
    number: {
        color: "purple",
        fontSize: 12,
    },
    property: {
        color: "DeepPink",
        fontSize: 12,
    },
    collapseIcon: {
        cursor: "pointer",
        fontSize: 10,
        color: "teal",
    },
};


const FormTemplates = () => {
  const history = useHistory();
  const [formSectionBase, setFormSectionBase] = useState()

  const loadSectionBaseBySection = async (e) => {
      const year = e.target.value;
      var selectedYear = document.getElementById("selectedYear");
      // TODO: Remove dev-admin demo test code.
      let {data} = await axios.get(
          `/api/v1/formtemplates/${year}`,{
              "year": selectedYear.value
          }
      )
      setFormSectionBase(data.contents)
      window.alert("Request Completed")
  }

  const handleSave = async () => {

    var selectedYear = document.getElementById("selectedYear");
      // TODO: Remove dev-admin demo test code.
    let {data} = await axios.post(
        `/api/v1/updateformtemplates?dev=dev-admin`,{
            "year": selectedYear.value
        }
    )
    window.alert("Request Completed")
    history.push("/");
  };

  return (
    <div className="form-templates">
      <h1>Generate Form Base Templates</h1>
      <h3>Select Year</h3>
      <select  className="ds-c-field" name="selectedYear" id="selectedYear"
         onChange={loadSectionBaseBySection}>
        <option value="2020" selected>2020</option>
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
        <div>
            <JSONEditor
                data={formSectionBase}
                collapsible
                view="dual"
                styles={{styles}}
            />
            <JSONInput
                id          = 'a_unique_id'
                placeholder = { formSectionBase }
                locale      = { locale }
                height      = '550px'
            />
        </div>
    </div>
  );
};


export default FormTemplates;
