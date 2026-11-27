import React from "react";
import { Link } from "react-router-dom";

export default function Application({ drive }) {
  return (
    <div className="page-container py-12">
      <div className="grid-row justify-center">
        <div className="md:w-9/12 lg:w-8/12">
          <div className="mb-4">
            <Link
              to="/drives"
              className="btn btn-sm btn-outline-secondary btn-pill px-4"
            >
              <i className="fa-solid fa-arrow-left me-1"></i> Back to All Drives
            </Link>
          </div>

          <div
            className="card p-6 md:p-12  shadow-sm"
            style={{ borderRadius: "22px", border: "1px solid #e5ede8" }}
          >
            <div className="text-center mb-6">
              <div className="editorial-badge mb-2">
                <i className="fa-solid fa-paper-plane me-1"></i> Candidate
                Application
              </div>
              <h2 className="font-bold mb-1" style={{ color: "#264336" }}>
                Apply for {drive.name || drive.companyName}
              </h2>
              <p className="text-muted">
                Role: <strong>{drive.role}</strong> &bull; Package:{" "}
                <strong>{drive.package}</strong>
              </p>
            </div>

            <form
              action={`/drive/apply/${drive._id}`}
              method="POST"
              className="needs-validation"
              noValidate
            >
              <input type="hidden" name="driveId" defaultValue={drive._id} />

              <div className="mb-4">
                <label htmlFor="name" className="form-label">
                  Full Name *
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  required
                  placeholder="e.g. Chetan Sharma"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="rollNo" className="form-label">
                  Roll Number / PRN *
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="rollNo"
                  name="rollNo"
                  required
                  placeholder="e.g. 126M1H039"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="branch" className="form-label">
                  Branch / Department *
                </label>
                <select
                  className="form-select"
                  id="branch"
                  defaultValue=""
                  name="branch"
                  required
                >
                  <option value="" disabled>
                    Select your branch
                  </option>
                  <option value="MCA">
                    Master of Computer Applications (MCA)
                  </option>
                  <option value="Computer Engineering">
                    Computer Engineering
                  </option>
                  <option value="Information Technology">
                    Information Technology
                  </option>
                  <option value="E&TC">Electronics & Telecommunication</option>
                  <option value="Mechanical">Mechanical Engineering</option>
                </select>
              </div>

              <div className="grid-row gutter-3 mb-4">
                <div className="md:w-6/12">
                  <label htmlFor="tenthPercentage" className="form-label">
                    10th Percentage (%) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    className="form-control"
                    id="tenthPercentage"
                    name="tenthPercentage"
                    required
                    placeholder="e.g. 88.50"
                  />
                </div>
                <div className="md:w-6/12">
                  <label htmlFor="twelfthPercentage" className="form-label">
                    12th / Diploma (%) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    className="form-control"
                    id="twelfthPercentage"
                    name="twelfthPercentage"
                    required
                    placeholder="e.g. 85.00"
                  />
                </div>
              </div>

              <div className="grid-row gutter-3 mb-4">
                <div className="md:w-6/12">
                  <label htmlFor="ugCgpa" className="form-label">
                    UG CGPA *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    className="form-control"
                    id="ugCgpa"
                    name="ugCgpa"
                    required
                    placeholder="e.g. 8.61"
                  />
                </div>
                <div className="md:w-6/12">
                  <label htmlFor="pgCgpa" className="form-label">
                    PG / Current CGPA *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    className="form-control"
                    id="pgCgpa"
                    name="pgCgpa"
                    required
                    placeholder="e.g. 9.00"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="resumeLink" className="form-label">
                  Resume Link (Google Drive / Portfolio) *
                </label>
                <input
                  type="url"
                  className="form-control"
                  id="resumeLink"
                  name="resumeLink"
                  required
                  placeholder="https://drive.google.com/file/d/..."
                />
              </div>

              <div className="mb-6">
                <label htmlFor="activeBacklogs" className="form-label">
                  Active Backlogs *
                </label>
                <input
                  type="number"
                  min="0"
                  className="form-control"
                  id="activeBacklogs"
                  name="activeBacklogs"
                  defaultValue="0"
                  required
                />
              </div>

              <div className="grid mt-6">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg btn-pill py-4"
                >
                  <i className="fa-solid fa-check me-1"></i> Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
