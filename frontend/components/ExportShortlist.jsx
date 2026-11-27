import React from "react";
import { downloadShortlist } from "../exportShortlist";

export default function ExportShortlist({ students, name = "Shortlisted candidates" }) {
  const [error, setError] = React.useState("");
  function download() {
    try {
      downloadShortlist(students, name);
      setError("");
    } catch {
      setError("The spreadsheet could not be created. Please try again.");
    }
  }
  return (
    <span className="inline-block me-2">
      <button type="button" className="btn btn-outline-primary btn-pill px-4"
        disabled={!students?.length} onClick={download}
        title="Download an Excel workbook. You can also import it into Google Sheets.">
        <i className="fa-solid fa-file-excel me-1"></i> Download Excel
      </button>
      {error && <span role="alert" className="block text-danger">{error}</span>}
    </span>
  );
}
