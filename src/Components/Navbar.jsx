import React, { useEffect, useState } from "react";
import { useActiveSection } from "../hooks/useActiveSection";
import "../css/Navbar.css";

const NAV_LINKS = ['Home', 'About', 'Projects', 'Contact'];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const activeSection = useActiveSection(NAV_LINKS);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <span className="logo">AG.</span>

      <div className={`nav-links ${isOpen ? "active" : ""}`}>
        {NAV_LINKS.map((id) => (
          <a
            key={id}
            href={`#${id}`}
            className={activeSection === id ? 'active-link' : ''}
            onClick={() => setIsOpen(false)}
          >
            {id}
          </a>
        ))}
      </div>

      <button
        className={`hamburger ${isOpen ? 'open' : ''}`}
        aria-label="Toggle navigation menu"
        onClick={toggleMenu}
      >
        <span className="bar bar-1"></span>
        <span className="bar bar-2"></span>
        <span className="bar bar-3"></span>
      </button>
    </nav>
  );
};

export default Navbar;
