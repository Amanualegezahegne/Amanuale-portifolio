import React from "react";
import "../css/Contact.css";

const Contact = () => {
  return (
    <section id="Contact">
      <h2>Contact Me</h2>
      <p>If you’d like to work together or just say hi, feel free to send a message!</p>

      <div className="contact-form">
        <form>
          <input type="text" name="name" placeholder="Your Name" required />
          <input type="email" name="email" placeholder="Your Email" required />
          <textarea name="message" placeholder="Your Message" required></textarea>
          <button type="submit">Send Message</button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
