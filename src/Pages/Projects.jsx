import React from "react";
import "../css/Projects.css";

const Projects = () => {
  const projects = [
    {
      title: "Portfolio Website",
      description: "A personal portfolio website built with React and CSS.",
      link: "https://github.com/Amanualegezahegne/Amanuale-portifolio.git",
    },
    {
      title: "Quiz App",
      description: "An interactive quiz application with MongoDB backend.",
      link: "https://github.com/Amanualegezahegne/quiz_app.git",
    },
    {
      title: "Hotel Managment System",
      description: "A user-friendly application to manage hotel operations efficiently, including bookings, rooms, and customer information..",
      link: "https://github.com/Amanualegezahegne/Hotel-Management-System.git",
    },
    {
      title: "sweetbee Honey website",
      description: "A clean, responsive web app showcasing natural honey products, allowing users to explore and purchase with ease.",
      link: "https://github.com/Amanualegezahegne/sweetbee.git",
    },
    {
      title: "Ankesebirhan Sunday School",
      description: "A comprehensive platform for managing Sunday school activities, student records, and educational resources.",
      link: "https://github.com/Amanualegezahegne/Ankese_birhan_senbet.git",
    },
    {
      title: "Spam Filter Detection",
      description: "A machine learning-based tool for identifying and filtering spam content in messages.",
      link: "https://github.com/Amanualegezahegne/spam-filter-detection.git",
    },
    {
      title: "Project Management Tool",
      description: "A collaborative task tracking and management system designed for academic and professional projects.",
      link: "https://github.com/Amanualegezahegne/project_managment.git",
    },
    {
      title: "To-Do List App",
      description: "A lightweight and efficient application for daily task planning and personal productivity.",
      link: "https://github.com/Amanualegezahegne/to-do-app.git",
    },
    {
      title: "Kotlin Gradle Project",
      description: "A backend development project showcasing Kotlin's capabilities with the Gradle build system.",
      link: "https://github.com/Amanualegezahegne/kotlin__gradle_project.git",
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

