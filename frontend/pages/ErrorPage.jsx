import React from "react";
import { Link } from "react-router-dom";

export default function ErrorPage({ message }) {
  return (
    <div className="page-container py-12">
      <div className="grid-row justify-center">
        <div className="md:w-7/12 lg:w-5/12 text-center">
          <div
            className="card p-6 md:p-12  shadow-sm"
            style={{ borderRadius: "22px", border: "1px solid #e5ede8" }}
          >
            <div
              className="icon-bubble icon-lg mb-4"
              style={{ backgroundColor: "#fee2e2", color: "#dc2626" }}
            >
              <i className="fa-solid fa-triangle-exclamation"></i>
            </div>
            <h3 className="font-bold mb-2" style={{ color: "#264336" }}>
              Notice
            </h3>
            <p className="text-muted mb-6">{message}</p>
            <Link to="/" className="btn btn-primary btn-pill px-6">
              <i className="fa-solid fa-house me-1"></i> Return Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
