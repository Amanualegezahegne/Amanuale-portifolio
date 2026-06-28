import React, { useEffect, useRef, useState } from "react";
import "../css/About.css";
import profilePic from "../assets/images/DSC_0130.JPG";
import SkillBar from "../Components/SkillBar";
import { useScrollReveal } from "../hooks/useScrollReveal";

const SKILLS = [
  { label: 'HTML',       percent: 90 },
  { label: 'CSS',        percent: 85 },
  { label: 'JavaScript', percent: 80 },
  { label: 'React',      percent: 82 },
  { label: 'Node.js',    percent: 70 },
  { label: 'MongoDB',    percent: 65 },
  { label: 'Python',     percent: 60 },
  { label: 'Git',        percent: 78 },
];

const About = () => {
  const cardRef0 = useRef(null);
  const cardRef1 = useRef(null);
  const cardRef2 = useRef(null);
  const [skillsVisible, setSkillsVisible] = useState(false);

  useScrollReveal([cardRef0, cardRef1, cardRef2]);

  useEffect(() => {
    const el = cardRef1.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setSkillsVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="About" className="about">
      <div className="about-content">

        <div className="about-image">
          <div className="image-accent-border" aria-hidden="true" />
          <img src={profilePic} alt="Amanuale Gezahegn" />
        </div>

        <div className="about-text">
          <h2>About Me</h2>
          <p>
            Hi, I&apos;m <strong>Amanuale Gezahegn</strong>, a 4th-year Software Engineering
            student at Debre Birhan University, focused on building full-stack web applications.
          </p>
          <p>
            I enjoy turning complex problems into simple, elegant solutions with code.
            Constantly learning new technologies and improving my craft.
          </p>

          <a href="/cv.pdf" download className="btn btn-secondary download-cv">
            Download CV
          </a>

          <div className="about-cards">
            <div className="card reveal-item" ref={cardRef0} style={{'--reveal-delay': '0ms'}}>
              <h3>Education</h3>
              <p>B.Sc. Software Engineering, 4th Year<br />Debre Birhan University<br />Udacity certificates completed.</p>
            </div>

            <div className="card reveal-item" ref={cardRef1} style={{'--reveal-delay': '100ms'}}>
              <h3>Skills</h3>
              <div className="skill-bars">
                {SKILLS.map(s => (
                  <SkillBar key={s.label} label={s.label} percent={s.percent} isVisible={skillsVisible} />
                ))}
              </div>
            </div>

            <div className="card reveal-item" ref={cardRef2} style={{'--reveal-delay': '200ms'}}>
              <h3>Hobbies</h3>
              <p>Coding, Learning New Tech, Reading, Problem Solving</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default About;
