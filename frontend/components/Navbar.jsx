import React from "react";
import { Link } from "react-router-dom";

export default function Navbar({ currentUser }) {
  const [open, setOpen] = React.useState(false);
  return (
    <nav className="navbar navbar-expand-lg lampzi-navbar sticky top-0 z-50">
      <div className="page-container">
        <Link className="navbar-brand" to="/">
          <span className="brand-icon">
            <i className="fa-solid fa-sun-plant-wilt"></i>
          </span>
          <span>TnP Engine</span>
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          onClick={() => setOpen(!open)}
          aria-controls="navbarMain"
          aria-expanded={open}
          aria-label="Toggle navigation"
        >
          <i className="fa-solid fa-bars text-dark"></i>
        </button>

        <div
          className={`${open ? "flex" : "hidden"} navbar-collapse lg:flex`}
          id="navbarMain"
        >
          <ul className="navbar-nav mx-auto mb-2 lg:mb-0">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/drives">
                Campus Drives
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/drives/results">
                Results
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/experiences">
                Interview Stories
              </Link>
            </li>
            {currentUser ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/dashboard">
                    <i className="fa-solid fa-gauge-high me-1 text-muted"></i>{" "}
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/drives/new">
                    <i className="fa-solid fa-plus me-1 text-muted"></i> Add
                    Drive
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/shortlist">
                    <i className="fa-solid fa-filter me-1 text-muted"></i>{" "}
                    Shortlist
                  </Link>
                </li>
              </>
            ) : null}
          </ul>

          <ul className="navbar-nav ms-auto items-center">
            {currentUser ? (
              <>
                <li className="nav-item me-4">
                  <div className="user-profile-badge">
                    <div className="avatar-circle">
                      {currentUser.username.charAt(0).toUpperCase()}
                    </div>
                    <span>{currentUser.username}</span>
                  </div>
                </li>
                <li className="nav-item">
                  <form action="/auth/logout" method="POST" className="inline">
                    <button
                      className="btn btn-sm btn-outline-secondary btn-pill px-4"
                      type="submit"
                    >
                      <i className="fa-solid fa-right-from-bracket me-1"></i>{" "}
                      Logout
                    </button>
                  </form>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item me-2">
                  <Link
                    className="btn btn-sm btn-outline-primary btn-pill px-4"
                    to="/auth/login"
                  >
                    Admin Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="btn btn-sm btn-primary btn-pill px-4"
                    to="/auth/signup"
                  >
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
