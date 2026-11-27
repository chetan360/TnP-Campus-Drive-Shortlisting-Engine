import React from "react";

export default function Flash({ messages }) {
  const [closed, setClosed] = React.useState({});
  return (
    <>
      {!closed.error &&
      messages &&
      messages.error &&
      messages.error.length > 0 ? (
        <div
          className="alert alert-danger alert-dismissible fade show border-0 rounded-2xl shadow-sm mb-6"
          role="alert"
        >
          <div className="flex items-center">
            <i className="fa-solid fa-circle-exclamation me-2 text-xl"></i>
            <div>{String(messages.error)}</div>
          </div>
          <button
            type="button"
            className="btn-close"
            onClick={() => setClosed({ ...closed, error: true })}
            aria-label="Close"
          ></button>
        </div>
      ) : null}

      {!closed.success &&
      messages &&
      messages.success &&
      messages.success.length > 0 ? (
        <div
          className="alert alert-success alert-dismissible fade show border-0 rounded-2xl shadow-sm mb-6"
          style={{ backgroundColor: "#eaf4ef", color: "#28543e" }}
          role="alert"
        >
          <div className="flex items-center">
            <i
              className="fa-solid fa-circle-check me-2 text-xl"
              style={{ color: "#5e967d" }}
            ></i>
            <div>{String(messages.success)}</div>
          </div>
          <button
            type="button"
            className="btn-close"
            onClick={() => setClosed({ ...closed, success: true })}
            aria-label="Close"
          ></button>
        </div>
      ) : null}
    </>
  );
}
