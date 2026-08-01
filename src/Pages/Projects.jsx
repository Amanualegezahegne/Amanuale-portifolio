import React, { useRef, useState, useEffect } from "react";
import "../css/Projects.css";
import { FaSearch } from "react-icons/fa";

const CATEGORIES = ['All', 'Web', 'Backend', 'Other'];

const projects = [
  {
    title: "Portfolio Website",
    description: "A personal portfolio website built with React and CSS, showcasing projects and skills.",
    link: "https://github.com/Amanualegezahegne/Amanuale-portifolio.git",
    demo: "https://amanuale-portifolio.vercel.app/",
    category: "Web",
    tags: ["React", "CSS", "Vite"],
  },
  {
    title: "Quiz App",
    description: "An interactive quiz application with a MongoDB backend and dynamic question loading.",
    link: "https://github.com/Amanualegezahegne/quiz_app.git",
    demo: "",
    category: "Web",
    tags: ["React", "MongoDB", "Node.js"],
  },
  {
    title: "Hotel Management System",
    description: "A user-friendly application to manage hotel operations efficiently, including bookings, rooms, and customer information.",
    link: "https://github.com/Amanualegezahegne/Hotel-Management-System.git",
    demo: "",
    category: "Web",
    tags: ["HTML", "CSS", "JavaScript"],
  },
  {
    title: "Sweetbee Honey Website",
    description: "A clean, responsive web app showcasing natural honey products, allowing users to explore and purchase with ease.",
    link: "https://github.com/Amanualegezahegne/sweetbee.git",
    demo: "https://sweetbee-honey.vercel.app",
    category: "Web",
    tags: ["HTML", "CSS", "JavaScript"],
  },
  {
    title: "Ankesebirhan Sunday School",
    description: "A comprehensive platform for managing Sunday school activities, student records, and educational resources.",
    link: "https://github.com/Amanualegezahegne/Ankese_birhan_senbet.git",
    demo: "https://ankesebirhansundayschool.vercel.app/",
    category: "Web",
    tags: ["React", "CSS"],
  },
  {
    title: "Spam Filter Detection",
    description: "A machine learning-based tool for identifying and filtering spam content in messages using Python.",
    link: "https://github.com/Amanualegezahegne/spam-filter-detection.git",
    demo: "",
    category: "Other",
    tags: ["Python", "ML"],
  },
  {
    title: "Project Management Tool",
    description: "A collaborative task tracking and management system designed for academic and professional projects.",
    link: "https://github.com/Amanualegezahegne/project_managment.git",
    demo: "",
    category: "Backend",
    tags: ["React", "Node.js", "MongoDB"],
  },
  {
    title: "To-Do List App",
    description: "A lightweight and efficient application for daily task planning and personal productivity.",
    link: "https://github.com/Amanualegezahegne/to-do-app.git",
    demo: "https://amanualegezahegne.github.io/to-do-app/",
    category: "Web",
    tags: ["HTML", "CSS", "JavaScript"],
  },
  {
    title: "Other Portfolios",
    description: "Additional portfolio websites showcasing diverse projects and web development skills.",
    link: "",
    demo: "https://abrhame-portfolio.odoo.com",
    category: "Web",
    tags: ["Odoo", "Web Design"],
  },
  {
    title: "Kotlin Gradle Project",
    description: "A backend development project showcasing Kotlin's capabilities with the Gradle build system.",
    link: "https://github.com/Amanualegezahegne/kotlin__gradle_project.git",
    demo: "",
    category: "Backend",
    tags: ["Kotlin", "Gradle"],
  },
];

const Projects = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const cardRefs = useRef([]);

  const filteredProjects = projects.filter((p) => {
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  // Scroll reveal with IntersectionObserver
  useEffect(() => {
    const prefersReduced =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      card.classList.add("reveal-item");
      card.style.setProperty("--reveal-delay", `${i * 80}ms`);
      if (prefersReduced) {
        card.classList.add("is-visible");
      } else {
        observer.observe(card);
      }
    });

    return () => observer.disconnect();
  }, [filteredProjects.length]);

  return (
    <section id="Projects">
      <h2>My Projects</h2>

      {/* Category filter tabs */}
      <div className="filter-tabs" role="tablist" aria-label="Project categories">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            role="tab"
            aria-selected={activeCategory === cat}
            className={`filter-tab ${activeCategory === cat ? "active" : ""}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="search-container">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search by title, description or tech..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
          aria-label="Search projects"
        />
      </div>

      {/* Project cards */}
      <div className="projects-container">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project, index) => (
            <div
              className="project-card"
              key={project.title}
              ref={(el) => (cardRefs.current[index] = el)}
            >
              <div className="project-top-accent" aria-hidden="true" />
              <div className="project-icon">{project.title.charAt(0)}</div>
              <div className="project-info">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                {project.tags.length > 0 && (
                  <div className="tech-tags">
                    {project.tags.map((tag) => (
                      <span className="tech-tag" key={tag}>{tag}</span>
                    ))}
                  </div>
                )}
                <div className="project-actions">
                  <a
                    href={project.link}
                    className="btn btn-github"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View ${project.title} on GitHub`}
                  >
                    GitHub
                  </a>
                  {project.demo && (
                    <a
                      href={project.demo}
                      className="btn btn-demo"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`View live demo of ${project.title}`}
                    >
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-projects">
            <p>No projects found matching &quot;{searchQuery}&quot;</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
