import React from "react";
import { Link } from "react-router-dom";

export default function Dashboard({
  currentUser,
  drives,
  activeDrivesCount,
  totalDrives,
  totalStudents,
}) {
  return (
    <div className="page-container py-6">
      <div className="mb-6">
        <div className="editorial-badge mb-2">
          <i className="fa-solid fa-sparkles me-1"></i> TnP Coordinator
          Dashboard &bull;{" "}
          {new Date().toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          })}
        </div>
        <div className="flex flex-wrap justify-between items-center">
          <div>
            <h1
              className="display-6 font-bold mb-1"
              style={{ color: "#264336" }}
            >
              Welcome, {currentUser ? currentUser.username : "Coordinator"}
            </h1>
            <p className="text-muted mb-0">
              You have <strong>{activeDrivesCount}</strong> active campus drives
              in your recruitment pipeline.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-2">
            <Link
              to="/drives/new"
              className="btn btn-primary btn-pill shadow-sm"
            >
              <i className="fa-solid fa-plus me-1"></i> Create Drive
            </Link>
            <Link to="/shortlist" className="btn btn-outline-primary btn-pill">
              <i className="fa-solid fa-filter me-1"></i> Shortlist Tool
            </Link>
          </div>
        </div>
      </div>

      <div className="grid-row gutter-3 mb-6">
        <div className="md:w-4/12">
          <div className="stat-metric-card">
            <div className="flex items-center">
              <div className="icon-bubble me-4">
                <i className="fa-solid fa-building"></i>
              </div>
              <div>
                <div className="text-muted text-[.875em] font-semibold uppercase">
                  Total Drives
                </div>
                <h3 className="font-bold mb-0 text-dark">{totalDrives}</h3>
              </div>
            </div>
            <div className="text-muted text-xl">
              <i className="fa-solid fa-arrow-right"></i>
            </div>
          </div>
        </div>

        <div className="md:w-4/12">
          <div className="stat-metric-card">
            <div className="flex items-center">
              <div className="icon-bubble me-4">
                <i className="fa-solid fa-circle-check"></i>
              </div>
              <div>
                <div className="text-muted text-[.875em] font-semibold uppercase">
                  Active Drives
                </div>
                <h3 className="font-bold mb-0 text-dark">
                  {activeDrivesCount}
                </h3>
              </div>
            </div>
            <div className="text-muted text-xl">
              <i className="fa-solid fa-arrow-right"></i>
            </div>
          </div>
        </div>

        <div className="md:w-4/12">
          <div className="stat-metric-card">
            <div className="flex items-center">
              <div className="icon-bubble me-4">
                <i className="fa-solid fa-user-graduate"></i>
              </div>
              <div>
                <div className="text-muted text-[.875em] font-semibold uppercase">
                  Candidates Pool
                </div>
                <h3 className="font-bold mb-0 text-dark">{totalStudents}</h3>
              </div>
            </div>
            <div className="text-muted text-xl">
              <i className="fa-solid fa-arrow-right"></i>
            </div>
          </div>
        </div>
      </div>

      <div
        className="card  shadow-sm rounded-2xl overflow-hidden"
        style={{ border: "1px solid #e5ede8" }}
      >
        <div className="card-header bg-white py-4 px-6 border-b flex justify-between items-center">
          <div>
            <h5 className="font-bold mb-0" style={{ color: "#264336" }}>
              Recruitment Pipeline Management
            </h5>
            <small className="text-muted">
              Live company drives, application cutoffs, and student pools
            </small>
          </div>
          <span className="badge badge-sage px-4 py-2">
            {drives.length} Drives Recorded
          </span>
        </div>

        <div className="card-body p-0">
          {drives && drives.length > 0 ? (
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead>
                  <tr>
                    <th scope="col" className="ps-6">
                      Company & Role
                    </th>
                    <th scope="col">Package</th>
                    <th scope="col">Eligibility Cutoffs</th>
                    <th scope="col">Max Backlogs</th>
                    <th scope="col">Deadline</th>
                    <th scope="col">Applicants</th>
                    <th scope="col" className="text-right pe-6">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {drives.map((drive) => {
                    const isExpired = new Date(drive.deadline) < new Date();
                    return (
                      <tr key={drive._id}>
                        <td className="ps-6">
                          <div className="font-bold text-dark text-base">
                            {drive.name}
                          </div>
                          <small className="text-muted">{drive.role}</small>
                        </td>
                        <td>
                          <span className="badge badge-sage">
                            {drive.package}
                          </span>
                        </td>
                        <td>
                          <div className="text-[.875em] text-muted">
                            <span>
                              10th:{" "}
                              <strong>
                                {drive.criteria.minTenthPercentage}%
                              </strong>
                            </span>{" "}
                            &bull;
                            <span>
                              12th:{" "}
                              <strong>
                                {drive.criteria.minTwelfthPercentage}%
                              </strong>
                            </span>
                            <br />
                            <span>
                              UG: <strong>{drive.criteria.minUgCgpa}</strong>
                            </span>{" "}
                            &bull;
                            <span>
                              PG: <strong>{drive.criteria.minPgCgpa}</strong>
                            </span>
                          </div>
                        </td>
                        <td>
                          <span className="badge bg-light text-secondary border">
                            &le; {drive.criteria.maxBacklogs}
                          </span>
                        </td>
                        <td>
                          {isExpired ? (
                            <span className="badge bg-danger-subtle text-danger rounded-full px-2 py-1">
                              Closed (
                              {new Date(drive.deadline).toLocaleDateString()})
                            </span>
                          ) : (
                            <span className="badge badge-sage rounded-full px-2 py-1">
                              {new Date(drive.deadline).toLocaleDateString()}
                            </span>
                          )}
                        </td>
                        <td>
                          <span className="badge bg-light text-dark border rounded-full px-4 py-1 font-bold">
                            {drive.applicantCount}
                          </span>
                        </td>
                        <td className="text-right pe-6">
                          <div className="btn-group" role="group">
                            <Link
                              to={`/drives/${drive._id}/shortlist`}
                              className="btn btn-sm btn-outline-primary btn-pill me-1"
                              title="Shortlist Candidates"
                            >
                              <i className="fa-solid fa-list-check me-1"></i>{" "}
                              Shortlist
                            </Link>
                            <Link
                              to={`/drives/${drive._id}/edit`}
                              className="btn btn-sm btn-outline-secondary btn-pill me-1"
                              title="Edit Drive"
                            >
                              <i className="fa-solid fa-pen"></i>
                            </Link>
                            <form
                              action={`/drives/${drive._id}?_method=DELETE`}
                              method="POST"
                              className="inline"
                              onSubmit={(event) => {
                                if (
                                  !window.confirm(
                                    `Are you sure you want to delete this drive for ${drive.name}?`,
                                  )
                                )
                                  event.preventDefault();
                              }}
                            >
                              <button
                                type="submit"
                                className="btn btn-sm btn-outline-danger btn-pill"
                                title="Delete Drive"
                              >
                                <i className="fa-solid fa-trash-can"></i>
                              </button>
                            </form>
                          </div>
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
                <i className="fa-solid fa-briefcase"></i>
              </div>
              <h5 className="font-bold">No campus drives created yet</h5>
              <p className="text-muted text-[.875em] mb-4">
                Create your first campus recruitment drive to begin receiving
                student profiles.
              </p>
              <Link to="/drives/new" className="btn btn-primary btn-pill">
                <i className="fa-solid fa-plus me-1"></i> Create First Drive
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
