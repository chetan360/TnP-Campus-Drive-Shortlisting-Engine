import React from "react";
import { Link } from "react-router-dom";

export default function Results({ drives, currentUser }) {
  return (
    <div className="page-container py-12">
      <div className="grid-row mb-12 text-center">
        <div className="lg:w-8/12 mx-auto">
          <div className="editorial-badge mb-4">
            <i className="fa-solid fa-square-poll-vertical me-1"></i>{" "}
            Announcements & Results
          </div>
          <h1 className="display-5 font-bold mb-2" style={{ color: "#264336" }}>
            Campus Drive Results & Updates
          </h1>
          <p className="lead text-muted" style={{ fontSize: "1.05rem" }}>
            Track ongoing and concluded recruitment drives, corporate updates,
            and student shortlists.
          </p>
        </div>
      </div>

      <div className="grid-row gutter-4">
        {drives && drives.length > 0 ? (
          <>
            {drives.map((drive) => {
              const isExpired = new Date(drive.deadline) < new Date();
              return (
                <div key={drive._id} className="md:w-6/12 lg:w-4/12">
                  <div
                    className="card p-6  shadow-sm h-full flex flex-col justify-between"
                    style={{
                      borderRadius: "20px",
                      border: "1px solid #e5ede8",
                    }}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h4
                          className="card-title font-bold mb-0"
                          style={{ color: "#264336" }}
                        >
                          {drive.name}
                        </h4>
                        {isExpired ? (
                          <span className="badge bg-secondary-subtle text-secondary rounded-full px-2 py-1 text-[.875em]">
                            Concluded
                          </span>
                        ) : (
                          <span className="badge badge-sage rounded-full px-2 py-1 text-[.875em]">
                            In Progress
                          </span>
                        )}
                      </div>
                      <h6 className="text-muted font-semibold mb-4">
                        {drive.role}
                      </h6>
                      <p
                        className="text-muted text-[.875em] mb-6"
                        style={{ lineHeight: "1.5" }}
                      >
                        {drive.description}
                      </p>

                      <div
                        className="p-4 mb-6 rounded-lg"
                        style={{
                          backgroundColor: "#f7faf8",
                          border: "1px solid #edf4ef",
                        }}
                      >
                        <ul className="list-none pl-0 text-[.875em] text-muted mb-0">
                          <li className="mb-1 flex justify-between">
                            <span>Package:</span>
                            <strong className="text-dark">
                              {drive.package}
                            </strong>
                          </li>
                          <li className="mb-1 flex justify-between">
                            <span>Deadline:</span>
                            <span
                              className={
                                isExpired ? "text-danger" : "text-dark"
                              }
                            >
                              {new Date(drive.deadline).toLocaleDateString()}
                            </span>
                          </li>
                          <li className="flex justify-between">
                            <span>Min UG CGPA:</span>
                            <strong className="text-primary">
                              {drive.criteria.minUgCgpa}
                            </strong>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="grid gap-2">
                      {currentUser ? (
                        <Link
                          to={`/drives/${drive._id}/shortlist`}
                          className="btn btn-primary btn-pill py-2"
                        >
                          <i className="fa-solid fa-list-check me-1"></i> View
                          Shortlist
                        </Link>
                      ) : (
                        <Link
                          to={`/drives/${drive._id}/apply`}
                          className={`btn btn-outline-primary btn-pill py-2 ${isExpired ? "disabled" : ""}`}
                        >
                          {isExpired
                            ? "Applications Closed"
                            : "Apply for Drive"}
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        ) : (
          <div className="w-full text-center py-12">
            <div className="icon-bubble icon-lg mb-4">
              <i className="fa-solid fa-square-poll-vertical"></i>
            </div>
            <p className="text-muted lead">
              No campus drive results to display at this moment.
            </p>
            <Link to="/drives" className="btn btn-primary btn-pill px-6">
              Check Active Drives
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
