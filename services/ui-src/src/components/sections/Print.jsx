import React, { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@cmsgov/design-system";
import { useLocation } from "react-router";
// components
import Title from "../layout/Title";
import Section from "../layout/Section";
import { Main } from "../layout/Main";
// utils
import statesArray from "../utils/statesArray";
import { loadEnrollmentCounts, loadSections } from "../../actions/initial";
import { apiLib } from "../../util/apiLib";

// Document <meta> tags carried into the generated PDF. These were previously
// rendered via react-helmet, whose side-effect mechanism does not apply under
// React 19 (the tags never reached the DOM), so the values were silently lost.
// We set them directly on mount and remove them on unmount.
const PRINT_META = [
  { name: "author", content: "CMS" },
  { name: "subject", content: "Annual CARTS Report" },
];

const setPrintMeta = () =>
  PRINT_META.map(({ name, content }) => {
    let el = document.head.querySelector(`meta[name="${name}"]`);
    const created = !el;
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute("name", name);
      document.head.append(el);
    }
    const prevContent = el.getAttribute("content");
    el.setAttribute("content", content);
    return { el, created, prevContent };
  });

const cleanupPrintMeta = (entries) =>
  entries.forEach(({ el, created, prevContent }) => {
    if (created) {
      el.remove();
    } else if (prevContent !== null) {
      el.setAttribute("content", prevContent);
    }
  });

const openPdf = (basePdf) => {
  const byteCharacters = atob(basePdf);
  let byteNumbers = Array.from({ length: byteCharacters.length });
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.codePointAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const file = new Blob([byteArray], { type: "application/pdf;base64" });
  const fileURL = URL.createObjectURL(file);
  window.open(fileURL);
};

export const getPdfFriendlyDocument = async () => {
  // Clone the document so live DOM mutations don't affect the page
  const clonedHtml = document.querySelector("html").cloneNode(true);
  clonedHtml.querySelector("noscript")?.remove();

  clonedHtml.querySelectorAll("input").forEach((element) => {
    if (element.type === "text") {
      element.style.height = "50px";
      element.style.width = "100%";
      element.style.paddingLeft = "8px";
    }
  });
  clonedHtml.querySelectorAll("button").forEach((element) => {
    if (element.title !== "Print") {
      element.remove();
    }
  });

  if (!clonedHtml.querySelector("base")) {
    const base = document.createElement("base");
    base.href = `https://${window.location.host}`;
    clonedHtml.querySelector("head").prepend(base);
  }

  const htmlString = clonedHtml.outerHTML
    .replaceAll(`’`, `'`)
    .replaceAll(`‘`, `'`)
    .replaceAll(`”`, `"`)
    .replaceAll(`“`, `"`)
    .replaceAll("\u2013", "-")
    .replaceAll("\u2014", "-");
  const base64String = btoa(unescape(encodeURIComponent(htmlString)));
  const opts = {
    body: {
      encodedHtml: base64String,
    },
  };

  const res = await apiLib.post("/print_pdf", opts);
  openPdf(res.data);
};

/**
 * Generate data and load entire form based on user information
 *
 * @returns {JSX.Element}
 * @constructor
 */
export const Print = () => {
  const dispatch = useDispatch();
  const [formData, currentUser, name] = useSelector(
    (state) => [
      state.formData,
      state.stateUser.currentUser,
      state.stateUser.name,
    ],
    shallowEqual
  );
  const search = useLocation().search;
  const searchParams = new URLSearchParams(search);
  const stateInitials = searchParams.get("state");
  const stateName =
    name || statesArray.find(({ value }) => value === stateInitials)?.label;
  const sectionId = searchParams.get("sectionId");
  const subsectionId = searchParams.get("subsectionId");

  // Load formData via side effect
  useEffect(() => {
    // Create function to call data to prevent return data from useEffect
    const retrieveUserData = async () => {
      // Get user details
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const selectedYear = urlParams.get("year");
      let stateCode;
      if (currentUser.state.id) {
        stateCode = currentUser.state.id;
      } else {
        stateCode = urlParams.get("state");
      }

      // Start Spinner
      dispatch({ type: "CONTENT_FETCHING_STARTED" });

      // Pull data based on user details
      await Promise.all([
        dispatch(loadSections({ stateCode, selectedYear })),
        dispatch(loadEnrollmentCounts({ stateCode, selectedYear })),
      ]);

      // End isFetching for spinner
      dispatch({ type: "CONTENT_FETCHING_FINISHED" });
    };

    //NOTE: Every time setAuthTimeout is called, it causes the useEffect to re-run even after data is retrieved
    if (formData.length === 0) {
      // Call async function to load data
      retrieveUserData();
    }
  }, [currentUser]);

  // Author/subject metadata for the printed report. Set directly on the DOM
  // because react-helmet is a no-op under React 19 (see PRINT_META above).
  useEffect(() => {
    const entries = setPrintMeta();
    return () => cleanupPrintMeta(entries);
  }, []);

  const sections = [];

  // Check if formData has values
  if (formData !== undefined && formData.length > 0) {
    sections.push(<Title key={"sectitle-1"} urlStateName={stateName} />);

    if (sectionId) {
      // Add section to sections array
      sections.push(
        <Section
          key={"sec-1"}
          data-testid="print-section"
          sectionId={sectionId}
          subsectionId={subsectionId}
          readonly="false"
          printView={true}
          useMain={false}
        />
      );
    } else {
      // Loop through each section to get sectionId
      for (let i = 0; i < formData.length; i++) {
        const sectionId = formData[i].contents.section.id;

        // Loop through subsections to get subsectionId
        for (
          let j = 0;
          j < formData[i].contents.section.subsections.length;
          j++
        ) {
          const subsectionId = formData[i].contents.section.subsections[j].id;

          // Add section to sections array
          sections.push(
            <Section
              key={`sec-${i}-${j}`}
              data-testid="print-section"
              sectionId={sectionId}
              subsectionId={subsectionId}
              readonly="false"
              printView={true}
              useMain={false}
            />
          );
        }
      }
    }
  }

  // Return sections with wrapper div and print dialogue box
  return (
    <div className="print-all">
      <div className="print-directions">
        <p>Click below to print full CARTS report shown here</p>
        <Button
          className="ds-c-button--solid ds-c-button--large print-all-btn"
          onClick={getPdfFriendlyDocument}
          title="Print"
        >
          <FontAwesomeIcon icon={faPrint} /> Print
        </Button>
      </div>
      {/*
        The document <title> is set centrally in PageTitle.jsx and the
        author/subject <meta> tags are set via effect above (WCAG 2.4.2;
        react-helmet does not apply either under React 19).
      */}
      <Main className="main">{sections}</Main>
      <Button
        className="ds-c-button--solid ds-c-button--large print-all-btn"
        onClick={getPdfFriendlyDocument}
        title="Print"
      >
        <FontAwesomeIcon icon={faPrint} /> Print
      </Button>
    </div>
  );
};
