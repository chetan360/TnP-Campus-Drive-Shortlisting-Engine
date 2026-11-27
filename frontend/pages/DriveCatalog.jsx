import React from "react";
import { Link } from "react-router-dom";

export default function DriveCatalog({ companies, currentUser }) {
  const [search, setSearch] = React.useState(
    new URLSearchParams(location.search).get("search") || "",
  );
  return (
    <div className="page-container py-12">
      <div className="grid-row justify-center text-center mb-6">
        <div className="lg:w-8/12">
          <div className="editorial-badge mb-4">
            <i className="fa-solid fa-sparkles me-1"></i> Placement
            Opportunities 2026
          </div>
          <h1 className="display-5 font-bold mb-2" style={{ color: "#264336" }}>
            Active Campus Drives
          </h1>
          <p
            className="lead text-muted mx-auto"
            style={{ maxWidth: "650px", fontSize: "1.05rem" }}
          >
            Select an ongoing company drive below to review academic criteria
            and submit your placement application.
          </p>
        </div>
      </div>

      <div className="grid-row justify-center mb-12">
        <div className="md:w-8/12 lg:w-7/12">
          <div className="search-pill-wrapper mb-4">
            <i className="fa-solid fa-magnifying-glass search-pill-icon"></i>
            <input
              type="text"
              className="form-control search-pill-input"
              id="driveSearchInput"
              placeholder="Search by company name, role or package..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="flex flex-wrap justify-center items-center gap-2 text-[.875em]">
            <span className="text-muted font-semibold">Quick Filters:</span>
            <button
              type="button"
              className="btn btn-sm btn-soft btn-pill px-4"
              onClick={() => setSearch("")}
            >
              All ({companies ? companies.length : 0})
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary btn-pill px-4"
              onClick={() => setSearch("Software")}
            >
              Software
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary btn-pill px-4"
              onClick={() => setSearch("LPA")}
            >
              High Package
            </button>
          </div>
        </div>
      </div>

      <div className="grid-row gutter-4" id="drivesGrid">
        {companies && companies.length > 0 ? (
          <>
            {companies
              .filter((company) =>
                [company.name, company.role, company.package]
                  .join(" ")
                  .toLowerCase()
                  .includes(search.toLowerCase()),
              )
              .map((company) => {
                const isExpired = new Date(company.deadline) < new Date();
                return (
                  <div
                    key={company._id}
                    className="md:w-6/12 lg:w-4/12 drive-item"
                  >
                    <div
                      className="card h-full p-6  shadow-sm"
                      style={{
                        borderRadius: "20px",
                        border: "1px solid #e5ede8",
                      }}
                    >
                      <div className="flex flex-col justify-between h-full">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <h4
                              className="card-title font-bold mb-0"
                              style={{ color: "#264336" }}
                            >
                              {company.name}
                            </h4>
                            {isExpired ? (
                              <span className="badge bg-secondary-subtle text-secondary rounded-full px-2 py-1 text-[.875em]">
                                Closed
                              </span>
                            ) : (
                              <span className="badge badge-sage rounded-full px-2 py-1 text-[.875em]">
                                <i className="fa-solid fa-circle-dot me-1 text-primary text-[.875em]"></i>{" "}
                                Active
                              </span>
                            )}
                          </div>

                          <h6 className="text-muted font-semibold mb-4">
                            {company.role}
                          </h6>
                          <p
                            className="text-muted text-[.875em] mb-4"
                            style={{ lineHeight: "1.5" }}
                          >
                            {company.description}
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
                                  {company.package}
                                </strong>
                              </li>
                              <li className="mb-1 flex justify-between">
                                <span>Min 10th / 12th:</span>
                                <span>
                                  {company.criteria.minTenthPercentage}% /{" "}
                                  {company.criteria.minTwelfthPercentage}%
                                </span>
                              </li>
                              <li className="mb-1 flex justify-between">
                                <span>Min UG / PG CGPA:</span>
                                <span className="text-primary font-bold">
                                  {company.criteria.minUgCgpa} /{" "}
                                  {company.criteria.minPgCgpa}
                                </span>
                              </li>
                              <li className="mb-1 flex justify-between">
                                <span>Backlogs Allowed:</span>
                                <span>&le; {company.criteria.maxBacklogs}</span>
                              </li>
                              <li className="flex justify-between">
                                <span>Deadline:</span>
                                <span
                                  className={
                                    isExpired
                                      ? "text-danger font-semibold"
                                      : "text-dark"
                                  }
                                >
                                  {new Date(
                                    company.deadline,
                                  ).toLocaleDateString()}
                                </span>
                              </li>
                            </ul>
                          </div>
                        </div>

                        <div className="grid gap-2">
                          {!isExpired ? (
                            <Link
                              to={`/drives/${company._id}/apply`}
                              className="btn btn-primary btn-pill py-2"
                            >
                              <i className="fa-solid fa-paper-plane me-1"></i>{" "}
                              Apply Now
                            </Link>
                          ) : (
                            <button
                              className="btn btn-outline-secondary btn-pill py-2"
                              disabled
                            >
                              Applications Closed
                            </button>
                          )}
                          {currentUser ? (
                            <Link
                              to={`/drives/${company._id}/shortlist`}
                              className="btn btn-outline-primary btn-pill py-2 btn-sm"
                            >
                              <i className="fa-solid fa-list-check me-1"></i>{" "}
                              Shortlist Eligible Students
                            </Link>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </>
        ) : (
          <div className="w-full text-center py-12">
            <div className="icon-bubble icon-lg mb-4">
              <i className="fa-solid fa-briefcase"></i>
            </div>
            <h4 className="font-bold">No active campus drives right now</h4>
            <p className="text-muted lead">
              Check back later or contact your college Training & Placement
              cell.
            </p>
            {currentUser ? (
              <Link to="/drives/new" className="btn btn-primary btn-pill">
                Create First Drive
              </Link>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
