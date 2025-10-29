import React from "react";
import "../css/Footer.css";
import { FaEnvelope, FaLinkedin, FaGithub, FaPhone, FaTelegramPlane, FaInstagram } from "react-icons/fa";

const Footer = () => {
    return (
        <footer>
            <div className="footer-container">
                <a href="mailto:Amanualegezahegne2066@gmail.com" target="_blank" rel="noopener noreferrer">
                    <FaEnvelope className="footer-icon" />
                </a>
                <a href="tel:+251920663551">
                    <FaPhone className="footer-icon" />
                </a>
                <a href="https://linkedin.com/in/Amanualegezahegne" target="_blank" rel="noopener noreferrer">
                    <FaLinkedin className="footer-icon" />
                </a>
                <a href="https://github.com/amanualegezahegne" target="_blank" rel="noopener noreferrer">
                    <FaGithub className="footer-icon" />
                </a>
                <a href="https://t.me/iamuu" target="_blank" rel="noopener noreferrer">
                    <FaTelegramPlane className="footer-icon" />
                </a>
                <a href="https://instagram.com/amangezu_28" target="_blank" rel="noopener noreferrer">
                    <FaInstagram className="footer-icon" />
                </a>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2025 Amanuale Gezahegn. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
