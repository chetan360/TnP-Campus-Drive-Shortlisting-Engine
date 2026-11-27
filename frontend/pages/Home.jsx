import React from "react";
import { Link } from "react-router-dom";

export default function Home({ currentUser }) {
  return (
    <div className="home-desktop-fit w-full">
      <div className="grid-row items-center gutter-4 my-auto">
        <div className="lg:w-7/12 text-start">
          <div className="editorial-badge mb-2">
            <i className="fa-solid fa-sparkles me-1"></i> TnP Placement Engine
            &bull; Automated Shortlisting
          </div>

          <h1
            className="display-5 font-bold mb-2"
            style={{ color: "#192420", lineHeight: "1.15" }}
          >
            From criteria to{" "}
            <span style={{ color: "#5e967d" }}>shortlist.</span>
            <br />
            All in one place.
          </h1>

          <p
            className="text-muted mb-4"
            style={{ fontSize: "1rem", maxWidth: "580px", lineHeight: "1.5" }}
          >
            Screen student profiles against corporate cutoffs in seconds, track
            applications, and prepare interview candidate shortlists.
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            <Link
              to="/drives"
              className="btn btn-primary btn-pill px-6 py-2 inline-flex items-center gap-2"
            >
              <span>Browse Campus Drives</span>
              <i className="fa-solid fa-arrow-right text-[.875em]"></i>
            </Link>
            {currentUser ? (
              <Link
                to="/admin/dashboard"
                className="btn btn-outline-primary btn-pill px-6 py-2"
              >
                <i className="fa-solid fa-gauge-high me-1"></i> Open Dashboard
              </Link>
            ) : (
              <Link
                to="/auth/login"
                className="btn btn-outline-secondary btn-pill px-6 py-2"
              >
                <i className="fa-solid fa-user-shield me-1"></i> Coordinator
                Login
              </Link>
            )}
          </div>

          <div
            className="search-pill-wrapper mb-2"
            style={{ maxWidth: "520px" }}
          >
            <i className="fa-solid fa-magnifying-glass search-pill-icon"></i>
            <form action="/drives" method="GET">
              <input
                type="text"
                className="form-control search-pill-input"
                name="search"
                placeholder="Search company, job role, or eligibility criteria..."
              />
            </form>
          </div>

          <div className="flex flex-wrap items-center gap-1 text-[.875em] mt-2">
            <span
              className="text-muted font-semibold me-1"
              style={{ fontSize: "0.8rem" }}
            >
              Explore:
            </span>
            <Link
              to="/drives"
              className="badge badge-sage no-underline py-1 px-2"
              style={{ fontSize: "0.75rem" }}
            >
              Software Engineering
            </Link>
            <Link
              to="/drives"
              className="badge bg-light text-muted border no-underline py-1 px-2"
              style={{ fontSize: "0.75rem" }}
            >
              Computer
            </Link>
            <Link
              to="/drives"
              className="badge bg-light text-muted border no-underline py-1 px-2"
              style={{ fontSize: "0.75rem" }}
            >
              IT
            </Link>
            <Link
              to="/drives"
              className="badge bg-light text-muted border no-underline py-1 px-2"
              style={{ fontSize: "0.75rem" }}
            >
              MCA
            </Link>
            <Link
              to="/drives"
              className="badge bg-light text-muted border no-underline py-1 px-2"
              style={{ fontSize: "0.75rem" }}
            >
              0 Backlogs
            </Link>
          </div>
        </div>

        <div className="lg:w-5/12">
          <div
            className="card p-4 shadow-sm "
            style={{ borderRadius: "20px", border: "1px solid #e5ede8" }}
          >
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <div
                  className="icon-bubble"
                  style={{ width: "36px", height: "36px", fontSize: "1rem" }}
                >
                  <i className="fa-solid fa-sun-plant-wilt"></i>
                </div>
                <div>
                  <div className="font-bold text-[.875em] text-dark">
                    Live Placement Pipeline
                  </div>
                  <div className="text-muted" style={{ fontSize: "0.72rem" }}>
                    Placement Cycle 2026 Active
                  </div>
                </div>
              </div>
              <span
                className="badge badge-sage"
                style={{ fontSize: "0.72rem" }}
              >
                Live Hub
              </span>
            </div>

            <div className="dashed-box p-2 mb-2">
              <div className="flex items-center gap-2">
                <i className="fa-regular fa-circle-play text-primary"></i>
                <span className="font-bold text-dark text-[.875em]">
                  Automated Shortlisting Engine
                </span>
              </div>
              <div className="text-muted ps-6" style={{ fontSize: "0.75rem" }}>
                Instant screening by 10th %, 12th %, UG/PG CGPA & backlogs.
              </div>
            </div>

            <div className="grid-row gutter-2">
              <div className="w-6/12">
                <Link
                  to="/drives"
                  className="btn btn-outline-primary btn-pill w-full py-2 flex items-center justify-center gap-1"
                  style={{ fontSize: "0.84rem" }}
                >
                  <i className="fa-solid fa-graduation-cap"></i>
                  <span>Students</span>
                </Link>
              </div>
              <div className="w-6/12">
                <Link
                  to={currentUser ? "/admin/dashboard" : "/auth/login"}
                  className="btn btn-outline-secondary btn-pill w-full py-2 flex items-center justify-center gap-1"
                  style={{ fontSize: "0.84rem" }}
                >
                  <i className="fa-solid fa-user-shield"></i>
                  <span>Coordinators</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid-row gutter-2 mt-auto pt-2 pb-1">
        <div className="w-6/12 lg:w-3/12">
          <div className="step-card-compact">
            <div className="flex justify-between items-center">
              <span className="step-badge">Step 01</span>
              <i
                className="fa-solid fa-arrow-right text-muted"
                style={{ fontSize: "0.65rem" }}
              ></i>
            </div>
            <div className="step-title">Drive Creation</div>
            <p className="step-desc">
              Configure visit roles & eligibility cutoffs
            </p>
          </div>
        </div>

        <div className="w-6/12 lg:w-3/12">
          <div className="step-card-compact">
            <div className="flex justify-between items-center">
              <span className="step-badge">Step 02</span>
              <i
                className="fa-solid fa-arrow-right text-muted"
                style={{ fontSize: "0.65rem" }}
              ></i>
            </div>
            <div className="step-title">Discover Drives</div>
            <p className="step-desc">
              Students review criteria & submit profiles
            </p>
          </div>
        </div>

        <div className="w-6/12 lg:w-3/12">
          <div className="step-card-compact">
            <div className="flex justify-between items-center">
              <span className="step-badge">Step 03</span>
              <i
                className="fa-solid fa-arrow-right text-muted"
                style={{ fontSize: "0.65rem" }}
              ></i>
            </div>
            <div className="step-title">Track & Filter</div>
            <p className="step-desc">Automated matching by CGPA & backlogs</p>
          </div>
        </div>

        <div className="w-6/12 lg:w-3/12">
          <div className="step-card-compact">
            <div className="flex justify-between items-center">
              <span className="step-badge">Step 04</span>
              <i
                className="fa-solid fa-arrow-right text-muted"
                style={{ fontSize: "0.65rem" }}
              ></i>
            </div>
            <div className="step-title">Interview Lists</div>
            <p className="step-desc">
              Export verified shortlists for company rounds
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
