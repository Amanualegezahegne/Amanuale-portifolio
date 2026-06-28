import React, { useState, useEffect } from "react";
import "./RobotAssistant.css";
import robotImage from "../assets/robot.svg";

const SUGGESTIONS = [
  { text: "👋 Hi! I'm Aman's assistant.", action: null },
  { text: "💼 Check out my projects below!", action: "#Projects" },
  { text: "🚀 Want to collaborate? Let's talk!", action: "#Contact" },
  { text: "🎓 4th-year Software Engineering student", action: "#About" },
  { text: "⚡ Full-stack developer & problem solver", action: "#About" },
  { text: "📬 Feel free to reach out anytime!", action: "#Contact" },
];

const RobotAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isWaving, setIsWaving] = useState(false);

  // Show robot after 2 seconds, auto-open bubble after 4 seconds
  useEffect(() => {
    const showTimer = setTimeout(() => setIsVisible(true), 2000);
    const openTimer = setTimeout(() => {
      setIsOpen(true);
      setIsWaving(true);
      setTimeout(() => setIsWaving(false), 1000);
    }, 4000);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(openTimer);
    };
  }, []);

  // Cycle suggestions every 4 seconds when open
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setSuggestionIndex((i) => (i + 1) % SUGGESTIONS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isOpen]);

  const handleRobotClick = () => {
    setIsOpen((prev) => !prev);
    setIsWaving(true);
    setTimeout(() => setIsWaving(false), 800);
  };

  const handleSuggestionClick = () => {
    const suggestion = SUGGESTIONS[suggestionIndex];
    if (suggestion.action) {
      const el = document.querySelector(suggestion.action);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  return (
    <div className={`robot-assistant ${isVisible ? "visible" : ""}`}>
      {/* Speech bubble */}
      {isOpen && (
        <div className="robot-bubble" onClick={handleSuggestionClick}>
          <p>{SUGGESTIONS[suggestionIndex].text}</p>
          {SUGGESTIONS[suggestionIndex].action && (
            <span className="bubble-hint">Click to go there ↗</span>
          )}
          <div className="bubble-dots">
            {SUGGESTIONS.map((_, i) => (
              <span
                key={i}
                className={`bubble-dot ${i === suggestionIndex ? "active" : ""}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Robot character */}
      <button
        className={`robot-btn ${isWaving ? "waving" : ""}`}
        onClick={handleRobotClick}
        aria-label="Robot assistant — click for suggestions"
      >
        <img 
          src={robotImage} 
          alt="Robot Assistant" 
          className="robot-image"
        />
      </button>
    </div>
  );
};

export default RobotAssistant;
