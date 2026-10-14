'use client';

import React, { useState } from "react";
import Modal from "./modal";
import PortfolioA from "./portfolioA";
import AboutA from "./aboutA";
import LinksA from "./linksa";
import ContactA from "./contactA";
import aboutIcon from "./icons/About_Icon.svg";
import workIcon from "./icons/Portfolio_Pieces_Icon.svg";
import pinIcon from "./icons/pinIcon.svg";
import linksIcon from "./icons/links_icon.svg";
import contactIcon from "./icons/contactIcon.svg";

export default function HeroAlt({ onSwitchPage }) {
  const [openPopups, setOpenPopups] = useState(new Set());

  const openModal = (key) => {
    setOpenPopups((prev) => new Set(prev).add(key));
  };

  const closeModal = (key) => {
    setOpenPopups((prev) => {
      const next = new Set(prev);
      next.delete(key);
      return next;
    });
  };

  return (
    <main className="hero-wrap">
      <div className="ring-wrap" aria-hidden="true">
        <svg className="orbit" viewBox="0 0 400 400">
          <circle
            cx="200"
            cy="200"
            r="192"
            fill="none"
            stroke="#9C97B8"
            strokeWidth="1.5"
            strokeDasharray="4 10"
            opacity="0.55"
          />
          <circle cx="200" cy="8" r="4" fill="#9C97B8" />
        </svg>

        <section className="hero-card">
          <div className="window-titlebar">
            <span className="window-label">home</span>
            <div className="window-dots">
              <span className="dot dot-1" />
              <span className="dot dot-2" />
              <span className="dot dot-3" />
            </div>
          </div>

          <div className="window-body">
            <div className="logo-morph-corner">
              <button
                type="button"
                className="logo-morph-btn"
                onClick={onSwitchPage}
                aria-label="Switch page"
              >
                <img src={pinIcon.src} alt="" className="pin-icon" />
              </button>
            </div>

            <h1 className="hero-name">
              <span className="hero-name-muted">hi! </span>
              <span className="hero-name-accent">i'm vod</span>
            </h1>
            <p className="tagline">
              Illustrator, Character Designer
            </p>

            <div className="cta-row">
              <div className="cta-item">
                <button
                  type="button"
                  className="cta-btn icon-btn primary"
                  aria-label="About me"
                  onClick={() => openModal("about")}
                >
                  <img src={aboutIcon.src} alt="" className="cta-icon" />
                </button>
              </div>

              <div className="cta-item">
                <button
                  type="button"
                  className="cta-btn icon-btn secondary"
                  aria-label="Works"
                  onClick={() => openModal("works")}
                >
                  <img src={workIcon.src} alt="" className="cta-icon" />
                </button>
              </div>

              <div className="cta-item">
                <button
                  type="button"
                  className="cta-btn icon-btn secondary"
                  aria-label="Links"
                  onClick={() => openModal("links")}
                >
                  <img src={linksIcon.src} alt="" className="cta-icon" />
                </button>
              </div>

              <div className="cta-item">
                <button
                  type="button"
                  className="cta-btn icon-btn"
                  aria-label="Contact"
                  onClick={() => openModal("contact")}
                >
                  <img src={contactIcon.src} alt="" className="cta-icon" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Modal
        isOpen={openPopups.has("works")}
        onClose={() => closeModal("works")}
        title="My Works"
      >
        <PortfolioA />
      </Modal>

      <Modal
        isOpen={openPopups.has("about")}
        onClose={() => closeModal("about")}
        title="About Me"
      >
        <AboutA onOpenWorks={() => openModal("works")} />
      </Modal>

      <Modal
        isOpen={openPopups.has("links")}
        onClose={() => closeModal("links")}
        title="Links"
      >
        <LinksA />
      </Modal>

      <Modal
        isOpen={openPopups.has("contact")}
        onClose={() => closeModal("contact")}
        title="Contact"
      >
        <ContactA />
      </Modal>
    </main>
  );
}