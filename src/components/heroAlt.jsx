'use client';

import React from "react";
import LogoMorph from "./logoMorph";
import Modal from "./modal";


export default function HeroAlt({ onSwitchPage }) {
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
              <LogoMorph
                logoA="/assets/artIcon.png"
                logoB="/assets/techIcon.png"
                alt="Vod"
                onClick={onSwitchPage}
              />
            </div>

            <h1 className="hero-name">
              <span className="hero-name-muted">hi! </span>
              <span className="hero-name-accent">i'm vod</span>
            </h1>
            <p className="tagline">
              Illustrator, Character Designer
            </p>
            <div className="cta-row">
              <a className="cta-btn primary" href="#work">
                View portfolio
              </a>
              <a className="cta-btn secondary" href="#contact">
                Get in touch
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}