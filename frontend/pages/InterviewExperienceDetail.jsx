import React from "react";
import { Link } from "react-router-dom";
import MarkdownRenderer, {
  getMarkdownTitle,
} from "../components/MarkdownRenderer";

export default function InterviewExperienceDetail({ experience }) {
  return (
    <div className="page-container py-12">
      <div className="experience-detail-shell">
        <Link to="/experiences" className="experience-back-link">
          <i className="fa-solid fa-arrow-left"></i> All experiences
        </Link>

        <article className="experience-article">
          <header className="experience-article-header">
            <div className="editorial-badge mb-4">Interview Story</div>
            <h1>{getMarkdownTitle(experience.content)}</h1>
            <div className="experience-article-author">
              <div className="experience-author-avatar">
                {experience.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <strong>{experience.name}</strong>
                <span>
                  Shared {new Date(experience.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </header>

          <MarkdownRenderer
            content={experience.content.replace(/^#\s+.+\n?/, "")}
          />
        </article>

        <aside className="experience-share-card">
          <div>
            <strong>Have an interview story to share?</strong>
            <p>Your experience can help another student prepare with confidence.</p>
          </div>
          <Link to="/experiences/new" className="btn btn-primary btn-pill">
            Write your experience
          </Link>
        </aside>
      </div>
    </div>
  );
}
