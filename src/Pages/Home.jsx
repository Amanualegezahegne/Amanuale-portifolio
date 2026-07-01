import React from "react";
import "../css/Home.css";
import image from "../assets/images/DSC_0127.JPG";
import { useTypedEffect } from "../hooks/useTypedEffect";

const Home = () => {
    const displayedText = useTypedEffect(
        ['Software Engineering Student', 'Full-Stack Developer', 'Problem Solver', 'Open Source Enthusiast'],
        80
    );

    return (
        <section id="Home" className="home">
            <div className="home-content">
                <div className="intro">
                    <h1 className="hero-name">
                        Hi, I'm <span className="gradient-name">Amanuale Gezahegn</span>
                    </h1>

                    <p className="hero-role">
                        <span className="typed-text">{displayedText}</span>
                        <span className="typed-cursor" aria-hidden="true">|</span>
                    </p>

                    <p className="hero-subtext">
                        4th-year Software Engineering student at Debre Birhan University.
                        Building full-stack web apps and turning complex problems into elegant solutions.
                    </p>

                    <div className="hero-ctas">
                        <a href="#Projects" className="btn btn-primary">View My Work</a>
                        <a href="/Amanuale_Gezahegne_CV.docx" download className="btn btn-secondary">Download CV</a>
                    </div>
                </div>

                <div className="home-image">
                    <div className="image-glow-ring" aria-hidden="true" />
                    <img src={image} alt="Amanuale Gezahegn — Software Engineering Student" />
                </div>
            </div>
        </section>
    );
};

export default Home;
