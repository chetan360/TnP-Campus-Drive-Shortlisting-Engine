import React from "react";
import ExportShortlist from "../components/ExportShortlist";
import { Link } from "react-router-dom";

export default function Shortlist({
  drives,
  criteria,
  shortlisted,
  selectedDriveId,
}) {
  const [cutoffs, setCutoffs] = React.useState(criteria);
  const [results, setResults] = React.useState(shortlisted);
  const [running, setRunning] = React.useState(false);

  async function runShortlisting(event) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }
    setRunning(true);
    try {
      const response = await fetch("/shortlist", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new URLSearchParams(new FormData(form)),
      });
      const result = await response.json();
      if (result.success) setResults(result.data);
    } finally {
      setRunning(false);
    }
  }

  function fillFromDrive(event) {
    const drive = drives.find((item) => item._id === event.target.value);
    if (drive) setCutoffs({ ...drive.criteria });
  }
  return (
    <div className="page-container py-6">
      <div className="flex flex-wrap justify-between items-center mb-6 pb-2 border-b">
        <div>
          <div className="editorial-badge mb-1">
            <i className="fa-solid fa-filter me-1"></i> Automated Screening
            Engine
          </div>
          <h2 className="font-bold mb-1" style={{ color: "#264336" }}>
            Shortlisting Engine
          </h2>
          <p className="text-muted mb-0">
            Screen candidate profiles dynamically based on academic eligibility
            criteria.
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link
            to="/admin/dashboard"
            className="btn btn-outline-secondary btn-pill px-4"
          >
            <i className="fa-solid fa-arrow-left me-1"></i> Dashboard
          </Link>
        </div>
      </div>

      <div
        className="card  shadow-sm rounded-2xl mb-6 p-6 md:p-12"
        style={{ border: "1px solid #e5ede8" }}
      >
        <h5
          className="font-bold mb-4 flex items-center gap-2"
          style={{ color: "#264336" }}
        >
          <i className="fa-solid fa-sliders text-primary text-base"></i> Set
          Eligibility Cutoffs
        </h5>

        <form
          action="/shortlist"
          method="POST"
          id="shortlistForm"
          onSubmit={runShortlisting}
        >
          <div className="grid-row gutter-3 mb-6">
            <div className="w-full">
              <label htmlFor="driveSelect" className="form-label">
                Quick-fill from Drive (Optional)
              </label>
              <select
                className="form-select"
                id="driveSelect"
                name="driveId"
                defaultValue={selectedDriveId}
                onChange={fillFromDrive}
              >
                <option value="">
                  -- Custom Criteria (Screen All Registered Students) --
                </option>
                {drives && drives.length > 0 ? (
                  <>
                    {drives.map((d) => {
                      return (
                        <option key={d._id} value={d._id}>
                          {d.name} - {d.role} ({d.package})
                        </option>
                      );
                    })}
                  </>
                ) : null}
              </select>
              <div className="form-text text-muted text-[.875em]">
                Selecting a drive pre-fills its cutoffs and filters candidates
                who applied to it.
              </div>
            </div>

            <div className="md:w-4/12 sm:w-6/12">
              <label htmlFor="minTenthPercentage" className="form-label">
                Min 10th %
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                className="form-control"
                id="minTenthPercentage"
                name="minTenthPercentage"
                value={cutoffs.minTenthPercentage}
                onChange={(event) =>
                  setCutoffs({
                    ...cutoffs,
                    minTenthPercentage: event.target.value,
                  })
                }
                required
              />
            </div>

            <div className="md:w-4/12 sm:w-6/12">
              <label htmlFor="minTwelfthPercentage" className="form-label">
                Min 12th / Diploma %
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                className="form-control"
                id="minTwelfthPercentage"
                name="minTwelfthPercentage"
                value={cutoffs.minTwelfthPercentage}
                onChange={(event) =>
                  setCutoffs({
                    ...cutoffs,
                    minTwelfthPercentage: event.target.value,
                  })
                }
                required
              />
            </div>

            <div className="md:w-4/12 sm:w-6/12">
              <label htmlFor="minUgCgpa" className="form-label">
                Min UG CGPA
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                className="form-control"
                id="minUgCgpa"
                name="minUgCgpa"
                value={cutoffs.minUgCgpa}
                onChange={(event) =>
                  setCutoffs({ ...cutoffs, minUgCgpa: event.target.value })
                }
                required
              />
            </div>

            <div className="md:w-6/12 sm:w-6/12">
              <label htmlFor="minPgCgpa" className="form-label">
                Min PG CGPA
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                className="form-control"
                id="minPgCgpa"
                name="minPgCgpa"
                value={cutoffs.minPgCgpa}
                onChange={(event) =>
                  setCutoffs({ ...cutoffs, minPgCgpa: event.target.value })
                }
                required
              />
            </div>

            <div className="md:w-6/12 sm:w-6/12">
              <label htmlFor="maxBacklogs" className="form-label">
                Max Active Backlogs
              </label>
              <input
                type="number"
                min="0"
                className="form-control"
                id="maxBacklogs"
                name="maxBacklogs"
                value={cutoffs.maxBacklogs}
                onChange={(event) =>
                  setCutoffs({ ...cutoffs, maxBacklogs: event.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Link
              to="/shortlist"
              className="btn btn-outline-secondary btn-pill px-6"
            >
              Reset
            </Link>
            <button
              type="submit"
              className="btn btn-primary btn-pill px-6"
              disabled={running}
            >
              <i className="fa-solid fa-filter me-1"></i>{" "}
              {running ? "Running..." : "Run Shortlisting"}
            </button>
          </div>
        </form>
      </div>

      {results !== null ? (
        <div
          className="card  shadow-sm rounded-2xl overflow-hidden"
          style={{ border: "1px solid #e5ede8" }}
        >
          <div className="card-header bg-white py-4 px-6 border-b flex justify-between items-center">
            <h5 className="font-bold mb-0" style={{ color: "#264336" }}>
              Shortlisted Candidates
            </h5>
            <div>
              <span className="badge badge-sage px-4 py-2 me-2">
                {results.length} Qualified
              </span>
              <ExportShortlist students={results} />
              {results.length > 0 ? (
                <button
                  onClick={() => window.print()}
                  className="btn btn-sm btn-outline-secondary btn-pill px-4"
                >
                  <i className="fa-solid fa-print me-1"></i> Print
                </button>
              ) : null}
            </div>
          </div>

          <div className="card-body p-0">
            {results.length > 0 ? (
              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead>
                    <tr>
                      <th scope="col" className="ps-6">
                        #
                      </th>
                      <th scope="col">Candidate Name</th>
                      <th scope="col">Roll / PRN</th>
                      <th scope="col">Branch</th>
                      <th scope="col">10th %</th>
                      <th scope="col">12th %</th>
                      <th scope="col">UG CGPA</th>
                      <th scope="col">PG CGPA</th>
                      <th scope="col">Backlogs</th>
                      <th scope="col" className="text-right pe-6">
                        Resume
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((student, index) => {
                      return (
                        <tr key={student._id}>
                          <td className="ps-6 text-muted">{index + 1}</td>
                          <td>
                            <div className="font-bold text-dark text-base">
                              {student.name}
                            </div>
                          </td>
                          <td>
                            <code>{student.rollNo}</code>
                          </td>
                          <td>
                            <span className="badge bg-light text-dark border">
                              {student.branch}
                            </span>
                          </td>
                          <td>{student.tenthPercentage}%</td>
                          <td>{student.twelfthPercentage}%</td>
                          <td>
                            <span className="badge badge-sage text-base">
                              {student.ugCgpa}
                            </span>
                          </td>
                          <td>{student.pgCgpa}</td>
                          <td>
                            <span
                              className={`badge ${student.activeBacklogs === 0 ? "bg-success-subtle text-success" : "bg-warning-subtle text-warning"} rounded-full px-2`}
                            >
                              {student.activeBacklogs}
                            </span>
                          </td>
                          <td className="text-right pe-6">
                            {student.resumeLink ? (
                              <a
                                href={student.resumeLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-sm btn-outline-primary btn-pill"
                              >
                                <i className="fa-solid fa-arrow-up-right-from-square me-1"></i>{" "}
                                View
                              </a>
                            ) : (
                              <span className="text-muted text-[.875em]">
                                N/A
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="icon-bubble icon-lg mb-4">
                  <i className="fa-solid fa-user-xmark"></i>
                </div>
                <h5 className="font-bold">No students met the criteria</h5>
                <p className="text-muted text-[.875em] mb-0">
                  Try lowering the CGPA or percentage cutoffs to broaden the
                  pool.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
