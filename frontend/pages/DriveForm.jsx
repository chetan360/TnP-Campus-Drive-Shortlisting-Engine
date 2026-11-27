import React from "react";
import { Link } from "react-router-dom";

export default function DriveForm({ drive }) {
  return (
    <div className="page-container py-6">
      <div className="grid-row justify-center">
        <div className="lg:w-8/12">
          <div className="mb-4">
            <Link
              to="/admin/dashboard"
              className="btn btn-sm btn-outline-secondary btn-pill px-4"
            >
              <i className="fa-solid fa-arrow-left me-1"></i> Back to Dashboard
            </Link>
          </div>

          <div
            className="card p-6 md:p-12  shadow-sm"
            style={{ borderRadius: "22px", border: "1px solid #e5ede8" }}
          >
            <div className="text-center mb-6">
              <div className="editorial-badge mb-2">
                <i
                  className={
                    drive
                      ? "fa-solid fa-pen-to-square me-1"
                      : "fa-solid fa-building me-1"
                  }
                ></i>{" "}
                {drive ? "Update Drive" : "Drive Configuration"}
              </div>
              <h2 className="font-bold mb-1" style={{ color: "#264336" }}>
                {drive
                  ? "Edit " + drive.name + " Drive"
                  : "Create Campus Drive"}
              </h2>
              <p className="text-muted text-[.875em]">
                {drive
                  ? "Update role parameters, compensation packages, and screening thresholds."
                  : "Configure corporate visit parameters, roles, compensation, and screening cutoffs."}
              </p>
            </div>

            <form
              action={drive ? `/drives/${drive._id}?_method=PUT` : "/drives"}
              method="POST"
              className="needs-validation"
              noValidate
            >
              <h5
                className="font-bold mb-4 flex items-center gap-2"
                style={{ color: "#264336" }}
              >
                <i className="fa-solid fa-circle-info text-primary text-base"></i>{" "}
                Company Information
              </h5>
              <div className="grid-row gutter-3 mb-6">
                <div className="md:w-6/12">
                  <label htmlFor="name" className="form-label">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    defaultValue={drive?.name}
                    required
                    placeholder={
                      drive ? undefined : "e.g. Google, Microsoft, Infosys"
                    }
                  />
                </div>

                <div className="md:w-6/12">
                  <label htmlFor="role" className="form-label">
                    Job Role / Designation *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="role"
                    name="role"
                    defaultValue={drive?.role}
                    required
                    placeholder={
                      drive ? undefined : "e.g. Software Engineer, Data Analyst"
                    }
                  />
                </div>

                <div className="md:w-6/12">
                  <label htmlFor="package" className="form-label">
                    Compensation Package *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="package"
                    name="package"
                    defaultValue={drive?.package}
                    required
                    placeholder={drive ? undefined : "e.g. 12 LPA, 8.5 LPA"}
                  />
                </div>

                <div className="md:w-6/12">
                  <label htmlFor="deadline" className="form-label">
                    Application Deadline *
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="deadline"
                    name="deadline"
                    defaultValue={
                      drive
                        ? new Date(drive.deadline).toISOString().slice(0, 10)
                        : ""
                    }
                    required
                  />
                </div>

                <div className="w-full">
                  <label htmlFor="description" className="form-label">
                    Drive Description *
                  </label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    defaultValue={drive?.description}
                    rows="3"
                    required
                    placeholder={
                      drive
                        ? undefined
                        : "Describe the job profile, responsibilities, selection rounds, and perks..."
                    }
                  ></textarea>
                </div>
              </div>

              <h5
                className="font-bold mb-4 flex items-center gap-2"
                style={{ color: "#264336" }}
              >
                <i className="fa-solid fa-sliders text-primary text-base"></i>{" "}
                Screening Cutoffs
              </h5>
              <div className="grid-row gutter-3 mb-6">
                <div className="md:w-6/12">
                  <label htmlFor="minTenthPercentage" className="form-label">
                    Min 10th Percentage (%) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    className="form-control"
                    id="minTenthPercentage"
                    name="minTenthPercentage"
                    defaultValue={drive?.criteria.minTenthPercentage ?? 60}
                    required
                  />
                </div>

                <div className="md:w-6/12">
                  <label htmlFor="minTwelfthPercentage" className="form-label">
                    Min 12th / Diploma (%) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    className="form-control"
                    id="minTwelfthPercentage"
                    name="minTwelfthPercentage"
                    defaultValue={drive?.criteria.minTwelfthPercentage ?? 60}
                    required
                  />
                </div>

                <div className="md:w-4/12">
                  <label htmlFor="minUgCgpa" className="form-label">
                    Min UG CGPA *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    className="form-control"
                    id="minUgCgpa"
                    name="minUgCgpa"
                    defaultValue={drive?.criteria.minUgCgpa ?? 6.5}
                    required
                  />
                </div>

                <div className="md:w-4/12">
                  <label htmlFor="minPgCgpa" className="form-label">
                    Min PG CGPA *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    className="form-control"
                    id="minPgCgpa"
                    name="minPgCgpa"
                    defaultValue={drive?.criteria.minPgCgpa ?? 6.5}
                    required
                  />
                </div>

                <div className="md:w-4/12">
                  <label htmlFor="maxBacklogs" className="form-label">
                    Max Backlogs Allowed *
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="form-control"
                    id="maxBacklogs"
                    name="maxBacklogs"
                    defaultValue={drive?.criteria.maxBacklogs ?? 0}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <Link
                  to="/admin/dashboard"
                  className="btn btn-outline-secondary btn-pill px-6"
                >
                  Cancel
                </Link>
                <button type="submit" className="btn btn-primary btn-pill px-6">
                  <i className="fa-solid fa-check me-1"></i>{" "}
                  {drive ? "Update Drive" : "Create Drive"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
