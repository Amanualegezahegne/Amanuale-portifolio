import React, { useState } from "react";
import "../css/Navbar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <h1 className="logo">My Portfolio</h1>

      <div className={`nav-links ${isOpen ? "active" : ""}`}>
        <a href="#Home" onClick={() => setIsOpen(false)}>Home</a>
        <a href="#About" onClick={() => setIsOpen(false)}>About</a>
        <a href="#Projects" onClick={() => setIsOpen(false)}>Projects</a>
        <a href="#Contact" onClick={() => setIsOpen(false)}>Contact</a>
      </div>

      <div className="hamburger" onClick={toggleMenu}>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>
    </nav>
  );
};

export default Navbar;
