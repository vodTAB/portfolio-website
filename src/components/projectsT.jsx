import React from "react";

const projects = [
    {
        projectName: "Project 1",
        description: "Short description of what this project is about.",
        link: "https://example.com/project1",
    },
    {
        projectName: "Project 2",
        description: "Short description of what this project is about.",
        link: "https://example.com/project2",
    },
];

const skills = [
    "JavaScript / React / Next.js",
    "HTML & CSS",
    "Python",
    "Databse Design and SQL",
];

export default function ProjectT() {
    return (
        <div className="about-content">

            <div className="about-scroll">
                <h4 className="about-scroll-heading">Projects</h4>
                {projects.map((project) => (
                    <div className="about-job" key={project.projectName}>
                        <div className="about-job-header">
                            <span className="about-job-role">{project.projectName}</span>
                        </div>
                        <p className="about-job-desc">{project.description}</p>
                        <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="about-job-company"
                            
                        >
                            View project →
                        </a>
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