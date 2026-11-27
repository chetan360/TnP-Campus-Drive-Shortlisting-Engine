import React from "react";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="clerk-auth-container">
      <div className="clerk-auth-card">
        <Link to="/" className="clerk-close-btn" title="Close and return home">
          <i className="fa-solid fa-xmark"></i>
        </Link>

        <div className="clerk-sunburst">
          <i className="fa-solid fa-sun-plant-wilt"></i>
        </div>

        <h2 className="clerk-title">Sign in to TnP Engine</h2>
        <p className="clerk-subtitle">
          Welcome back! Please sign in to continue
        </p>

        <a href="/auth/google" className="google-clerk-btn mb-2">
          <span className="last-used-pill">Last used</span>

          <svg className="google-icon-svg" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.87c2.26-2.09 3.67-5.17 3.67-9.15z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.05c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.28v3.15C3.26 21.36 7.34 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.61H1.28C.46 8.23 0 10.06 0 12s.46 3.77 1.28 5.39l3.99-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.28 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.73-4.96z"
            />
          </svg>
          <span>Continue with Google</span>
        </a>

        <div className="clerk-divider">
          <span>or</span>
        </div>

        <form
          className="needs-validation"
          action="/auth/login"
          method="POST"
          noValidate
        >
          <div className="mb-4">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              name="username"
              className="form-control"
              id="username"
              required
              placeholder="Enter your username"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              name="password"
              className="form-control"
              id="password"
              required
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="clerk-submit-btn mt-6">
            <span>Continue</span>
            <i className="fa-solid fa-play" style={{ fontSize: "0.65rem" }}></i>
          </button>

          <div className="clerk-auth-footer">
            <span>Don't have an account?</span>
            <Link to="/auth/signup" className="ms-1">
              Sign up
            </Link>
          </div>

          <div className="clerk-secured-badge">
            <i
              className="fa-solid fa-lock text-muted"
              style={{ fontSize: "0.7rem" }}
            ></i>
            <span>
              Secured by <strong>TnP Portal</strong>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
