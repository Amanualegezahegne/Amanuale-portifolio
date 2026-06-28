import React from "react";
import "../css/Footer.css";
import {
  FaEnvelope, FaLinkedin, FaGithub, FaPhone,
  FaTelegramPlane, FaInstagram
} from "react-icons/fa";

const SOCIAL_LINKS = [
  { icon: FaEnvelope,     href: "mailto:Amanualegezahegne2066@gmail.com", label: "Email",     rel: "noopener noreferrer" },
  { icon: FaPhone,        href: "tel:+251920663551",                        label: "Phone",     rel: undefined },
  { icon: FaLinkedin,     href: "https://linkedin.com/in/Amanualegezahegne", label: "LinkedIn", rel: "noopener noreferrer" },
  { icon: FaGithub,       href: "https://github.com/amanualegezahegne",      label: "GitHub",   rel: "noopener noreferrer" },
  { icon: FaTelegramPlane,href: "https://t.me/iamuu",                        label: "Telegram", rel: "noopener noreferrer" },
  { icon: FaInstagram,    href: "https://instagram.com/amangezu_28",         label: "Instagram",rel: "noopener noreferrer" },
];

const Footer = () => {
  const handleBackToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer>
      <div className="footer-inner">
        {/* Row 1 — name */}
        <p className="footer-name">Amanuale Gezahegn</p>

        {/* Row 2 — tagline */}
        <p className="footer-tagline">
          Building the web, one component at a time.
        </p>

        {/* Row 3 — social icons */}
        <div className="footer-icons">
          {SOCIAL_LINKS.map(({ icon: Icon, href, label, rel }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              target={rel ? "_blank" : undefined}
              rel={rel}
            >
              <Icon className="footer-icon" aria-hidden="true" />
            </a>
          ))}
        </div>

        {/* Back to Top */}
        <button
          className="back-to-top"
          onClick={handleBackToTop}
          aria-label="Back to top"
        >
          ↑ Back to Top
        </button>

        {/* Copyright */}
        <p className="footer-copy">
          &copy; {new Date().getFullYear()} Amanuale Gezahegn. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
