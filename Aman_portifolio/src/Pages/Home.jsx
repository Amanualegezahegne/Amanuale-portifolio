import React from "react";
import "../css/Home.css";
import image from "../assets/images/DSC_0127.jpg";

const Home = () => {
    return (
        <section id="Home" className="home">
            <div className="home-content">
                <div className="intro">
                    <h1>Hi, I'm Amanuale Gezahegn!</h1>
                    <p>
                        I'm a passionate web developer focused on creating modern, responsive,
                        and user-friendly websites. I love turning ideas into reality with code.
                    </p>
                    <a href="#Projects" className="btn">See My Work</a>
                </div>
                <div className="home-image">
                    <img src={image} alt="Amanuale" />
                </div>
            </div>
        </section>
    );
};

export default Home;
