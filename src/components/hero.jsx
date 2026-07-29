'use client';

import React, { useState } from "react";
import LogoMorph from "./logoMorph";
import Modal from "./modal";
import About from "./about";
import ProjectT from "./projectsT";

export default function Hero({ onSwitchPage }) {
  const [openPopup, setOpenPopup] = useState(null); // null | "about" | "projectsT"

  return (
    <main className="hero-wrap">
      <div className="ring-wrap" aria-hidden="true">
        <svg className="orbit" viewBox="0 0 400 400">
          <circle
            cx="200"
            cy="200"
            r="192"
            fill="none"
            stroke="#E3A93B"
            strokeWidth="1.5"
            strokeDasharray="4 10"
            opacity="0.55"
          />
          <circle cx="200" cy="8" r="4" fill="#E86F5C" />
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
              <LogoMorph
                logoA="/assets/techIcon.png"
                logoB="/assets/artIcon.png"
                alt="Vod"
                onClick={onSwitchPage}
              />
            </div>

            <h1 className="hero-name">
              <span className="hero-name-muted">hi! </span>
              <span className="hero-name-accent">i'm vod</span>
            </h1>
            <p className="tagline">
              Student (Computer Science)
            </p>
            <div className="cta-row">
              <button
                type="button"
                className="cta-btn icon-btn primary"
                aria-label="About me"
                onClick={() => setOpenPopup("about")}
              >
                <img src="/assets/iconPH.png" alt="" className="cta-icon" />
              </button>
              <button
                type="button"
                className="cta-btn icon-btn secondary"
                aria-label="See the work"
                onClick={() => setOpenPopup("projectsT")}
              >
                <img src="/assets/iconPH.png" alt="" className="cta-icon" />
              </button>
            </div>
          </div>
        </section>
      </div>

      <Modal
        isOpen={openPopup === "about"}
        onClose={() => setOpenPopup(null)}
        title="About me"
      >
        <About />
      </Modal>

      <Modal
        isOpen={openPopup === "projectsT"}
        onClose={() => setOpenPopup(null)}
        title="Projects"
      >
        <ProjectT />
      </Modal>
    </main>
  );
}