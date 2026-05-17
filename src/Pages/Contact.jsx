import React, { useState } from "react";
import "../css/Contact.css";

// ==========================================
// 📬 PORTFOLIO EMAIL FORWARDING CONFIGURATION
// ==========================================
// To receive form submissions directly to your email (amanualegezahegne2066@gmail.com):
// 1. Visit https://web3forms.com/ and enter your email to get a FREE Access Key instantly.
// 2. Replace the placeholder string below with your new Access Key.
const WEB3FORMS_ACCESS_KEY = "d9864f24-f947-4e71-b093-bc556881ef34";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState(""); // "success", "error", "info"
  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (WEB3FORMS_ACCESS_KEY === "YOUR_ACCESS_KEY_HERE") {
      setStatus("error");
      setStatusMessage("Form not activated! Please open src/Pages/Contact.jsx and paste your Web3Forms Access Key.");
      return;
    }

    setIsSubmitting(true);
    setStatus("info");
    setStatusMessage("Sending message...");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          name: formData.name,
          email: formData.email,
          message: formData.message,
          subject: `New Portfolio Message from ${formData.name}`,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus("success");
        setStatusMessage("Thank you! Your message has been sent successfully. I will get back to you soon!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
        setStatusMessage(data.message || "Oops! Something went wrong. Please try again or email me directly.");
      }
    } catch (error) {
      setStatus("error");
      setStatusMessage("Oops! There was a connection error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="Contact">
      <h2>Contact Me</h2>
      <p>If you’d like to work together or just say hi, feel free to send a message!</p>

      <div className="contact-form">
        {statusMessage && (
          <div className={`form-status ${status}`}>
            {statusMessage}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
          <textarea
            name="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          ></textarea>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
