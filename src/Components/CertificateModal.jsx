import React, { useState, useEffect } from "react";
import "./CertificateModal.css";
import { FaTimes, FaChevronLeft, FaChevronRight, FaDownload, FaRedo } from "react-icons/fa";

// Certificate metadata for all 3 certificates
const CERTIFICATES = [
  {
    id: 1,
    title: "Udacity React Nanodegree - Part 1",
    filename: "udacity-react-1.jpg",
    issuer: "Udacity",
    date: "2023"
  },
  {
    id: 2,
    title: "Udacity React Nanodegree - Part 2",
    filename: "udacity-react-2.jpg",
    issuer: "Udacity",
    date: "2023"
  },
  {
    id: 3,
    title: "Amanuale Gezahegn Professional Certificate",
    filename: "dbu-certificate-main.jpg",
    issuer: "Debre Birhan University",
    date: "2023"
  }
];

const CertificateModal = ({ isOpen, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [rotation, setRotation] = useState(0);

  // Close modal on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Navigation
  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % CERTIFICATES.length);
    setIsZoomed(false);
    setRotation(0);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + CERTIFICATES.length) % CERTIFICATES.length);
    setIsZoomed(false);
    setRotation(0);
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleDownload = () => {
    const cert = CERTIFICATES[currentIndex];
    const link = document.createElement("a");
    link.href = `/certificates/${cert.filename}`;
    link.download = cert.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  const currentCert = CERTIFICATES[currentIndex];

  return (
    <div className="certificate-modal-overlay" onClick={onClose}>
      <div className="certificate-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="cert-info">
            <h3>{currentCert.title}</h3>
            <p className="cert-meta">
              {currentCert.issuer} • {currentCert.date}
            </p>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close modal">
            <FaTimes />
          </button>
        </div>

        {/* Image Container */}
        <div className="modal-image-container">
          <img
            src={`/certificates/${currentCert.filename}`}
            alt={currentCert.title}
            className={`cert-image ${isZoomed ? "zoomed" : ""}`}
            style={{ transform: `rotate(${rotation}deg)` }}
            onClick={() => setIsZoomed(!isZoomed)}
            onError={(e) => {
              e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23333'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' fill='%23999' font-size='16' font-family='sans-serif'%3ECertificate Image Not Found%3C/text%3E%3Ctext x='50%25' y='60%25' text-anchor='middle' fill='%23666' font-size='12' font-family='monospace'%3E" + currentCert.filename + "%3C/text%3E%3C/svg%3E";
            }}
          />
          {isZoomed && (
            <div className="zoom-hint">Click image to zoom out</div>
          )}
        </div>

        {/* Navigation & Actions */}
        <div className="modal-footer">
          <div className="navigation-controls">
            <button
              className="nav-btn"
              onClick={goToPrev}
              disabled={CERTIFICATES.length <= 1}
              aria-label="Previous certificate"
            >
              <FaChevronLeft />
            </button>
            <span className="cert-counter">
              {currentIndex + 1} / {CERTIFICATES.length}
            </span>
            <button
              className="nav-btn"
              onClick={goToNext}
              disabled={CERTIFICATES.length <= 1}
              aria-label="Next certificate"
            >
              <FaChevronRight />
            </button>
          </div>

          <div className="action-buttons">
            <button className="rotate-btn" onClick={handleRotate} aria-label="Rotate certificate">
              <FaRedo /> Rotate
            </button>
            <button className="download-btn" onClick={handleDownload} aria-label="Download certificate">
              <FaDownload /> Download
            </button>
          </div>
        </div>

        {/* Thumbnail Strip */}
        {CERTIFICATES.length > 1 && (
          <div className="thumbnail-strip">
            {CERTIFICATES.map((cert, index) => (
              <button
                key={cert.id}
                className={`thumbnail ${index === currentIndex ? "active" : ""}`}
                onClick={() => {
                  setCurrentIndex(index);
                  setIsZoomed(false);
                  setRotation(0);
                }}
                aria-label={`View ${cert.title}`}
              >
                <img
                  src={`/certificates/${cert.filename}`}
                  alt={cert.title}
                  onError={(e) => {
                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='60'%3E%3Crect width='80' height='60' fill='%23333'/%3E%3C/svg%3E";
                  }}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificateModal;
