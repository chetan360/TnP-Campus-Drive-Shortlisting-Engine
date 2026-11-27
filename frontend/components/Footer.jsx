import React from "react";

export default function Footer() {
  return (
    <>
      <footer className="lampzi-footer mt-auto text-center">
        <div className="page-container flex flex-wrap justify-between items-center">
          <div className="flex items-center text-muted text-[.875em]">
            <span className="text-primary me-2">
              <i className="fa-solid fa-sun-plant-wilt"></i>
            </span>
            <span>
              &copy; {new Date().getFullYear()} TnP Campus Drive Shortlisting
              Engine &bull; Training & Placement Cell
            </span>
          </div>
          <div className="text-[.875em] text-muted mt-2 md:mt-0">
            <span className="badge badge-sage">CampusFlow 2.0</span>
          </div>
        </div>
      </footer>

      <div
        className="feedback-pill"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <i className="fa-regular fa-message me-1 text-primary"></i>
        <span>Feedback</span>
      </div>
    </>
  );
}
