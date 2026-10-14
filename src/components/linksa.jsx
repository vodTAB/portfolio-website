'use client';

import React from "react";
import instaIcon from "./icons/instagramIcon.svg";
import artStationIcon from "./icons/artStationIcon.svg";

export default function LinksA() {
  return (
    <div className="social-wrap">
      {/* Instagram */}
      <a
        href="https://instagram.com/onluckimii"
        target="_blank"
        rel="noopener noreferrer"
        className="social-btn"
        aria-label="Instagram"
      >
        <img src={instaIcon.src} alt="" className="social-icon" />
      </a>

      {/* ArtStation */}
      <a
        href="https://www.artstation.com/ohluckimii"
        target="_blank"
        rel="noopener noreferrer"
        className="social-btn"
        aria-label="ArtStation"
      >
        <img src={artStationIcon.src} alt="" className="social-icon" />
      </a>

      {/* Commission Footer */}

      <footer className="commission-footer">
        Want to commission?{" "}
        <a
          href="https://createhanabi.com/u/on_luckimii"
          target="_blank"
          rel="noopener noreferrer"
          className="commission-link"
        >
          Commission me here!
        </a>
      </footer>
    </div>
  );
}
