import React from "react";
import "../css/About.css";
import profilePic from "../assets/images/DSC_0130.jpg";

const About = () => {
    return (
        <section id="About" className="about">
            <div className="about-content">
                {/* Profile Image */}
                <div className="about-image">
                    <img src={profilePic} alt="Amanuale Gezahegn" />
                </div>

                {/* About Text */}
                <div className="about-text">
                    <h2>About Me</h2>
                    <p>
                        Hi, I'm <strong>Amanuale Gezahegn</strong>, a 4th-year Software Engineering student at
                        Debre Birhan University. I am passionate about building modern, responsive,
                        and user-friendly web applications.
                    </p>
                    <p>
                        I enjoy turning complex problems into simple, elegant solutions with code.
                        I am constantly learning new technologies and improving my craft.
                    </p>

                    {/* Cards for Skills, Education, Hobbies */}
                    <div className="about-cards">
                        <div className="card">
                            <h3>Education</h3>
                            <p>B.Sc. in Software Engineering, 4th Year, Debre Birhan University</p>
                        </div>
                        <div className="card">
                            <h3>Skills</h3>
                            <p>HTML, CSS, JavaScript, React, Node.js, MongoDB, Git</p>
                        </div>
                        <div className="card">
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
