import React from "react";

const employment = [
  {
    role: "Example Role",
    company: "Example Company",
    dates: "2024 — Present",
    description: "Short description of what you did here.",
  },
  {
    role: "Previous Role",
    company: "Previous Company",
    dates: "2022 — 2024",
    description: "Short description of what you did here.",
  },
];

const skills = [
  "JavaScript / React",
  "HTML & CSS",
  "Python",
  "Git & version control",
];

export default function About() {
  return (
    <div className="about-content">
      <div className="about-top">
        <img src="/assets/portrait.png" alt="Portrait of Vod" className="about-portrait" />
        <div className="header">
          <h3 className="about-name">Vod</h3>
          <p className="about-summary">
            Student studying Computer Science, focused on front-end
            development and building clean, interactive interfaces.
          </p>
        </div>
      </div>

      <div className="about-scroll">
        <h4 className="about-scroll-heading">Experience</h4>
        {employment.map((job) => (
          <div className="about-job" key={job.role + job.company}>
            <div className="about-job-header">
              <span className="about-job-role">{job.role}</span>
              <span className="about-job-dates">{job.dates}</span>
            </div>
            <p className="about-job-company">{job.company}</p>
            <p className="about-job-desc">{job.description}</p>
          </div>
        ))}

        <h4 className="about-scroll-heading">Skills</h4>
        <ul className="about-skills">
          {skills.map((skill) => (
            <li key={skill}>{skill}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}