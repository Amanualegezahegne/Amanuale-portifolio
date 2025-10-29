import React from "react";
import "../css/Projects.css";

const Projects = () => {
  const projects = [
    {
      title: "Portfolio Website",
      description: "A personal portfolio website built with React and CSS.",
      link: "#",
    },
    {
      title: "Quiz App",
      description: "An interactive quiz application with MongoDB backend.",
      link: "#",
    },
    {
      title: "Hotel Managment System",
      description: "A user-friendly application to manage hotel operations efficiently, including bookings, rooms, and customer information..",
      link: "#",
    },
    {
      title: "sweetbee Honey website",
      description: "A clean, responsive web app showcasing natural honey products, allowing users to explore and purchase with ease.",
      link: "#",
    },
  ];

  return (
    <section id="Projects">
      <h2>My Projects</h2>
      <div className="projects-container">
        {projects.map((project, index) => (
          <div className="project-card" key={index}>
            <div className="project-icon">{project.title.charAt(0)}</div>
            <div className="project-info">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <a href={project.link} className="btn" target="_blank" rel="noopener noreferrer">
                View Project
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;
