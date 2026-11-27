import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import MarkdownRenderer from "../components/MarkdownRenderer";

const starterContent = `# Company and Role Interview Experience

Briefly introduce the role and how you applied.

## Interview process

- Round 1:
- Round 2:
- Round 3:

## Questions asked

Share the important technical, aptitude, or HR questions.

## Preparation advice

What would you recommend to future candidates?`;

export default function InterviewExperienceForm() {
  const [content, setContent] = useState(starterContent);
  const [mode, setMode] = useState("write");
  const editorRef = useRef(null);
  const canSubmit = content.trim().length >= 50;

  function applyMarkdown(prefix, suffix = "", placeholder = "text") {
    const textarea = editorRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.slice(start, end) || placeholder;
    const replacement = `${prefix}${selected}${suffix}`;
    setContent(`${content.slice(0, start)}${replacement}${content.slice(end)}`);

    requestAnimationFrame(() => {
      textarea.focus();
      const selectionStart = start + prefix.length;
      textarea.setSelectionRange(selectionStart, selectionStart + selected.length);
    });
  }

  function applyLinePrefix(prefix, placeholder) {
    const textarea = editorRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.slice(start, end) || placeholder;
    const replacement = selected
      .split("\n")
      .map((line) => `${prefix}${line}`)
      .join("\n");
    setContent(`${content.slice(0, start)}${replacement}${content.slice(end)}`);
    requestAnimationFrame(() => textarea.focus());
  }

  const toolbar = [
    {
      label: "Heading",
      icon: "fa-heading",
      action: () => applyLinePrefix("## ", "Section heading"),
    },
    {
      label: "Bold",
      icon: "fa-bold",
      action: () => applyMarkdown("**", "**", "bold text"),
    },
    {
      label: "Italic",
      icon: "fa-italic",
      action: () => applyMarkdown("*", "*", "italic text"),
    },
    {
      label: "Bulleted list",
      icon: "fa-list-ul",
      action: () => applyLinePrefix("- ", "List item"),
    },
    {
      label: "Numbered list",
      icon: "fa-list-ol",
      action: () => applyLinePrefix("1. ", "List item"),
    },
    {
      label: "Quote",
      icon: "fa-quote-left",
      action: () => applyLinePrefix("> ", "Helpful advice"),
    },
    {
      label: "Inline code",
      icon: "fa-code",
      action: () => applyMarkdown("`", "`", "code"),
    },
    {
      label: "Link",
      icon: "fa-link",
      action: () => applyMarkdown("[", "](https://example.com)", "link text"),
    },
  ];

  return (
    <div className="page-container py-12">
      <div className="experience-form-heading">
        <div>
          <Link to="/experiences" className="experience-back-link">
            <i className="fa-solid fa-arrow-left"></i> Interview experiences
          </Link>
          <div className="editorial-badge mt-5 mb-3">
            <i className="fa-solid fa-feather-pointed me-1"></i> Share Your Story
          </div>
          <h1>Help the next candidate prepare.</h1>
          <p>
            No account is required. Share the rounds, questions, and advice you
            wish you had before your interview.
          </p>
        </div>
        <div className="experience-form-note">
          <i className="fa-solid fa-shield-heart"></i>
          <span>Your email is stored privately and never shown publicly.</span>
        </div>
      </div>

      <form
        action="/experiences"
        method="POST"
        className="needs-validation experience-form"
        noValidate
      >
        <input type="hidden" name="content" value={content} />
        <div className="grid-row gutter-4 mb-6">
          <div className="md:w-6/12">
            <label htmlFor="experience-name" className="form-label">
              Your name
            </label>
            <input
              id="experience-name"
              name="name"
              type="text"
              className="form-control"
              maxLength="80"
              placeholder="e.g. Aarav Sharma"
              required
            />
          </div>
          <div className="md:w-6/12">
            <label htmlFor="experience-email" className="form-label">
              Email address
            </label>
            <input
              id="experience-email"
              name="email"
              type="email"
              className="form-control"
              maxLength="160"
              placeholder="you@example.com"
              required
            />
          </div>
        </div>

        <div className="markdown-editor">
          <div className="markdown-editor-topbar">
            <div>
              <strong>Interview experience</strong>
              <span>Markdown supported</span>
            </div>
            <div className="markdown-mode-switch" role="tablist">
              <button
                type="button"
                className={mode === "write" ? "active" : ""}
                onClick={() => setMode("write")}
              >
                <i className="fa-solid fa-pen"></i> Write
              </button>
              <button
                type="button"
                className={mode === "preview" ? "active" : ""}
                onClick={() => setMode("preview")}
              >
                <i className="fa-regular fa-eye"></i> Preview
              </button>
            </div>
          </div>

          {mode === "write" ? (
            <>
              <div className="markdown-toolbar" aria-label="Markdown formatting">
                {toolbar.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    title={item.label}
                    aria-label={item.label}
                    onClick={item.action}
                  >
                    <i className={`fa-solid ${item.icon}`}></i>
                  </button>
                ))}
              </div>
              <textarea
                ref={editorRef}
                id="experience-content"
                value={content}
                onChange={(event) => setContent(event.target.value)}
                minLength="50"
                maxLength="20000"
                required
                spellCheck="true"
                aria-label="Interview experience in Markdown"
              />
            </>
          ) : (
            <div className="markdown-preview">
              <MarkdownRenderer content={content} />
            </div>
          )}

          <div className="markdown-editor-footer">
            <span>
              <i className="fa-brands fa-markdown"></i> Use headings, lists,
              bold text, quotes, code, and links
            </span>
            <span>{content.length.toLocaleString()} / 20,000 characters</span>
          </div>
        </div>

        <div className="experience-submit-row">
          <p>
            By publishing, you confirm this is your own experience and contains
            no confidential interview material.
          </p>
          <button
            type="submit"
            className="btn btn-primary btn-pill px-6 py-3"
            disabled={!canSubmit}
          >
            Publish experience <i className="fa-solid fa-arrow-right ms-2"></i>
          </button>
        </div>
      </form>
    </div>
  );
}
