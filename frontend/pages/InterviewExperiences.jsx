import React from "react";
import { Link } from "react-router-dom";
import {
  getMarkdownExcerpt,
  getMarkdownTitle,
} from "../components/MarkdownRenderer";

export default function InterviewExperiences({ experiences = [] }) {
  const [search, setSearch] = React.useState("");
  const filteredExperiences = experiences.filter((experience) =>
    [experience.name, experience.content]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <div className="page-container py-12 experience-page">
      <section className="experience-hero mb-10">
        <div>
          <div className="editorial-badge mb-4">
            <i className="fa-solid fa-comments me-1"></i> Student Stories
          </div>
          <h1 className="display-5 font-bold mb-3">
            Real interview experiences,
            <span> shared by students.</span>
          </h1>
          <p className="text-muted mb-0">
            Learn about interview rounds, questions, preparation strategies,
            and lessons from candidates who have been through the process.
          </p>
        </div>
        <Link to="/experiences/new" className="btn btn-primary btn-pill px-6 py-3">
          <i className="fa-solid fa-pen-to-square me-2"></i>
          Share Your Experience
        </Link>
      </section>

      <div className="search-pill-wrapper mb-8 experience-search">
        <i className="fa-solid fa-magnifying-glass search-pill-icon"></i>
        <input
          type="search"
          className="form-control search-pill-input"
          placeholder="Search by company, role, topic, or student name..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {filteredExperiences.length ? (
        <div className="grid-row gutter-4">
          {filteredExperiences.map((experience) => (
            <article key={experience._id} className="md:w-6/12 lg:w-4/12">
              <div className="experience-card h-full">
                <div className="experience-card-icon">
                  <i className="fa-solid fa-quote-left"></i>
                </div>
                <div className="experience-meta mb-3">
                  <span>{new Date(experience.createdAt).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>5 min read</span>
                </div>
                <h2>{getMarkdownTitle(experience.content)}</h2>
                <p className="experience-excerpt">
                  {getMarkdownExcerpt(experience.content)}
                </p>
                <div className="experience-card-footer">
                  <div className="experience-author-avatar">
                    {experience.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <strong>{experience.name}</strong>
                    <span>Campus candidate</span>
                  </div>
                  <Link
                    to={`/experiences/${experience._id}`}
                    className="experience-read-link"
                    aria-label={`Read ${getMarkdownTitle(experience.content)}`}
                  >
                    <i className="fa-solid fa-arrow-right"></i>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="experience-empty">
          <div className="icon-bubble icon-lg mb-4">
            <i className="fa-solid fa-book-open"></i>
          </div>
          <h3>No matching experiences found</h3>
          <p className="text-muted">Try another search or share the first story.</p>
        </div>
      )}
    </div>
  );
}
