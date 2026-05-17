import React, { useState } from "react";
import "../css/Projects.css";
import { FaSearch } from "react-icons/fa";

const Projects = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const projects = [
    {
      title: "Portfolio Website",
      description: "A personal portfolio website built with React and CSS.",
      link: "https://github.com/Amanualegezahegne/Amanuale-portifolio.git",
      demo: "https://amanuale-portifolio.vercel.app/",
    },
    {
      title: "Quiz App",
      description: "An interactive quiz application with MongoDB backend.",
      link: "https://github.com/Amanualegezahegne/quiz_app.git",
      demo: "", // Leave blank if not deployed
    },
    {
      title: "Hotel Managment System",
      description: "A user-friendly application to manage hotel operations efficiently, including bookings, rooms, and customer information..",
      link: "https://github.com/Amanualegezahegne/Hotel-Management-System.git",
      demo: "",
    },
    {
      title: "sweetbee Honey website",
      description: "A clean, responsive web app showcasing natural honey products, allowing users to explore and purchase with ease.",
      link: "https://github.com/Amanualegezahegne/sweetbee.git",
      demo: "https://amanualegezahegne.github.io/sweetbee/", // Example deployed link
    },
    {
      title: "Ankesebirhan Sunday School",
      description: "A comprehensive platform for managing Sunday school activities, student records, and educational resources.",
      link: "https://github.com/Amanualegezahegne/Ankese_birhan_senbet.git",
      demo: "https://ankesebirhansundayschool.vercel.app/",
    },
    {
      title: "Spam Filter Detection",
      description: "A machine learning-based tool for identifying and filtering spam content in messages.",
      link: "https://github.com/Amanualegezahegne/spam-filter-detection.git",
      demo: "",
    },
    {
      title: "Project Management Tool",
      description: "A collaborative task tracking and management system designed for academic and professional projects.",
      link: "https://github.com/Amanualegezahegne/project_managment.git",
      demo: "",
    },
    {
      title: "To-Do List App",
      description: "A lightweight and efficient application for daily task planning and personal productivity.",
      link: "https://github.com/Amanualegezahegne/to-do-app.git",
      demo: "https://amanualegezahegne.github.io/to-do-app/", // Example deployed link
    },
    {
      title: "Kotlin Gradle Project",
      description: "A backend development project showcasing Kotlin's capabilities with the Gradle build system.",
      link: "https://github.com/Amanualegezahegne/kotlin__gradle_project.git",
      demo: "",
    },
  ];

  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section id="Projects">
      <h2>My Projects</h2>

      <div className="search-container">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search projects by title or tech stack..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="projects-container">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project, index) => (
            <div className="project-card" key={index}>
              <div className="project-icon">{project.title.charAt(0)}</div>
              <div className="project-info">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="project-actions">
                  <a href={project.link} className="btn btn-github" target="_blank" rel="noopener noreferrer">
                    GitHub Code
                  </a>
                  {project.demo && (
                    <a href={project.demo} className="btn btn-demo" target="_blank" rel="noopener noreferrer">
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-projects">
            <p>No projects found matching "{searchQuery}"</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;

