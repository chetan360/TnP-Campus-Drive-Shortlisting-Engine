import React from "react";
import ExportShortlist from "../components/ExportShortlist";
import { Link } from "react-router-dom";

export default function DriveShortlist({
  drive,
  shortlistedStudents,
  filterScope,
  totalApplicants,
}) {
  return (
    <div className="page-container py-6">
      <div className="flex flex-wrap justify-between items-center mb-6 pb-2 border-b">
        <div>
          <div className="editorial-badge mb-1">
            <i className="fa-solid fa-list-check me-1"></i> Drive Shortlist
            Results
          </div>
          <h2 className="font-bold mb-1" style={{ color: "#264336" }}>
            Candidates for {drive.name}
          </h2>
          <p className="text-muted mb-0">
            Role: <strong>{drive.role}</strong> &bull; Package:{" "}
            <strong>{drive.package}</strong>
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
          <ExportShortlist students={shortlistedStudents} name={drive.name} />
          <Link
            to="/admin/dashboard"
            className="btn btn-outline-secondary btn-pill px-4"
          >
            <i className="fa-solid fa-arrow-left me-1"></i> Dashboard
          </Link>
          <button
            onClick={() => window.print()}
            className="btn btn-outline-primary btn-pill px-4"
          >
            <i className="fa-solid fa-print me-1"></i> Print / Export
          </button>
        </div>
      </div>

      <div
        className="card  shadow-sm rounded-2xl mb-6"
        style={{ backgroundColor: "#f7faf8", border: "1px solid #e5ede8" }}
      >
        <div className="card-body p-4 md:p-6">
          <div className="grid-row text-center gutter-3">
            <div className="w-6/12 md:flex-1">
              <small
                className="text-muted block uppercase font-semibold"
                style={{ fontSize: "0.75rem" }}
              >
                Min 10th %
              </small>
              <strong className="text-base text-dark">
                {drive.criteria.minTenthPercentage}%
              </strong>
            </div>
            <div className="w-6/12 md:flex-1">
              <small
                className="text-muted block uppercase font-semibold"
                style={{ fontSize: "0.75rem" }}
              >
                Min 12th %
              </small>
              <strong className="text-base text-dark">
                {drive.criteria.minTwelfthPercentage}%
              </strong>
            </div>
            <div className="w-6/12 md:flex-1">
              <small
                className="text-muted block uppercase font-semibold"
                style={{ fontSize: "0.75rem" }}
              >
                Min UG CGPA
              </small>
              <strong className="text-base text-primary">
                {drive.criteria.minUgCgpa}
              </strong>
            </div>
            <div className="w-6/12 md:flex-1">
              <small
                className="text-muted block uppercase font-semibold"
                style={{ fontSize: "0.75rem" }}
              >
                Min PG CGPA
              </small>
              <strong className="text-base text-primary">
                {drive.criteria.minPgCgpa}
              </strong>
            </div>
            <div className="w-6/12 md:flex-1">
              <small
                className="text-muted block uppercase font-semibold"
                style={{ fontSize: "0.75rem" }}
              >
                Max Backlogs
              </small>
              <strong className="text-base text-dark">
                &le; {drive.criteria.maxBacklogs}
              </strong>
            </div>
            <div className="w-full md:flex-1">
              <small
                className="text-muted block uppercase font-semibold"
                style={{ fontSize: "0.75rem" }}
              >
                Screening Scope
              </small>
              <span className="badge badge-sage">
                {filterScope === "applicants"
                  ? "Direct Applicants (" + totalApplicants + ")"
                  : "Total Student Pool"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div
        className="card  shadow-sm rounded-2xl overflow-hidden"
        style={{ border: "1px solid #e5ede8" }}
      >
        <div className="card-header bg-white py-4 px-6 border-b flex justify-between items-center">
          <h5 className="font-bold mb-0" style={{ color: "#264336" }}>
            Eligible Qualified Candidates
          </h5>
          <span className="badge badge-sage px-4 py-2">
            {shortlistedStudents.length} Shortlisted
          </span>
        </div>

        <div className="card-body p-0">
          {shortlistedStudents && shortlistedStudents.length > 0 ? (
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
                  {shortlistedStudents.map((student, index) => {
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
                              View Resume
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
                None of the{" "}
                {filterScope === "applicants" ? "applied" : "registered"}{" "}
                students matched the cutoff requirements for this drive.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

