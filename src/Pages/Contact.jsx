import React, { useState } from "react";
import "../css/Contact.css";
import {
  FaEnvelope, FaPhone, FaLinkedin, FaGithub,
  FaCheckCircle, FaExclamationCircle
} from "react-icons/fa";

const WEB3FORMS_ACCESS_KEY = "d9864f24-f947-4e71-b093-bc556881ef34";

const CONTACT_INFO = [
  { icon: FaEnvelope, href: "mailto:Amanualegezahegne2066@gmail.com", label: "Email" },
  { icon: FaPhone,    href: "tel:+251920663551",                        label: "Phone" },
  { icon: FaLinkedin, href: "https://linkedin.com/in/Amanualegezahegne", label: "LinkedIn" },
  { icon: FaGithub,   href: "https://github.com/amanualegezahegne",      label: "GitHub" },
];

const Contact = () => {
  const [formData, setFormData]         = useState({ name: "", email: "", message: "" });
  const [status, setStatus]             = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
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
        setSuccessVisible(true);
        setFormData({ name: "", email: "", message: "" });
        setTimeout(() => setSuccessVisible(false), 5000);
      } else {
        setStatus("error");
        setStatusMessage(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setStatusMessage("Connection error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="Contact">
      <h2>Contact Me</h2>
      <p className="contact-subtitle">
        Got a project in mind or want to collaborate? Drop me a message.
      </p>

      {/* Contact info icon row */}
      <div className="contact-info-row">
        {CONTACT_INFO.map(({ icon: Icon, href, label }) => (
          <a
            key={label}
            href={href}
            className="contact-info-link"
            aria-label={label}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon aria-hidden="true" />
            <span>{label}</span>
          </a>
        ))}
      </div>

      <div className="contact-form reveal-item">
        {/* Auto-dismiss success banner */}
        {successVisible && (
          <div className="form-banner form-banner--success" role="alert">
            <FaCheckCircle aria-hidden="true" />
            <span>Message sent! I'll get back to you soon.</span>
          </div>
        )}

        {/* Persistent error banner */}
        {status === "error" && (
          <div className="form-banner form-banner--error" role="alert">
            <FaExclamationCircle aria-hidden="true" />
            <span>{statusMessage}</span>
            <button
              className="banner-dismiss"
              onClick={() => setStatus("")}
              aria-label="Dismiss error"
            >
              Try Again
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="field-group">
            <input
              id="name"
              type="text"
              name="name"
              placeholder=" "
              value={formData.name}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              autoComplete="name"
            />
            <label htmlFor="name">Your Name</label>
          </div>

          <div className="field-group">
            <input
              id="email"
              type="email"
              name="email"
              placeholder=" "
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              autoComplete="email"
            />
            <label htmlFor="email">Your Email</label>
          </div>

          <div className="field-group field-group--textarea">
            <textarea
              id="message"
              name="message"
              placeholder=" "
              value={formData.message}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              rows={5}
            />
            <label htmlFor="message">Your Message</label>
          </div>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className="spinner" aria-hidden="true" />
                Sending…
              </>
            ) : (
              "Send Message"
            )}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
