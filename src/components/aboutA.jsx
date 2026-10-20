'use client';

import React from "react";
import clipLogo from "./icons/clip_studio_logo.svg";
import blenderLogo from "./icons/blender_logo.svg";


export default function AboutA({ onOpenWorks, onOpenContact }) {
  return (
    <div className="about-wrap">
      <img src="/assets/about-portrait.png" alt="Vod" className="about-portrait" />

      <div className="about-text">
        <p>hi! I'm Vod! 2nd year College Student</p>

        <h3>i...</h3>
        <ul className="skill-list">
          <li>
            create hand-drawn{" "}
            <a
              href="#"
              className="inline-link"
              onClick={(e) => {
                e.preventDefault();
                onOpenWorks();
              }}
            >
              illustrations
            </a>
          </li>
          <li>create character designs</li>
        </ul>

        <h3>tools</h3>
        <div className="tool-list">
          <img src={clipLogo.src} alt="Clip Studio Paint" className="tool-logo" />
          <img src={blenderLogo.src} alt="Blender" className="tool-logo" />
        </div>
        <p>
          Interested? any questions for me?{" "}
          <a
            href="#"
            className="inline-link"
            onClick={(e) => {
              e.preventDefault();
              onOpenContact();
            }}
          >
            contact me
          </a>
          .
        </p>
      </div>
    </div>
  );
}