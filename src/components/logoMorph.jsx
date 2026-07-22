'use client';

import React, { useState } from "react";

/**
 * LogoMorph
 * Click the logo to crossfade it into a second logo.
 * Pass `onClick` to also trigger something else (e.g. switching pages)
 * at the same time as the fade.
 *
 * Usage:
 *   <LogoMorph
 *     logoA="/assets/logo-primary.png"
 *     logoB="/assets/logo-alt.png"
 *     alt="Wren Iyer"
 *     onClick={() => setPage("heroalt")}
 *   />
 */
export default function LogoMorph({ logoA, logoB, alt = "logo", onClick }) {
  const [showB, setShowB] = useState(false);

  const handleClick = () => {
    setShowB((prev) => !prev);
    if (onClick) onClick();
  };

  return (
    <button
      type="button"
      className="logo-morph-btn"
      onClick={handleClick}
      aria-label={`Switch ${alt} logo`}
    >
      <div className="logo-morph-stage">
        <img
          src={logoA}
          alt={alt}
          className={`logo-morph-img ${showB ? "is-hidden" : "is-visible"}`}
        />
        <img
          src={logoB}
          alt={alt}
          className={`logo-morph-img ${showB ? "is-visible" : "is-hidden"}`}
        />
      </div>
    </button>
  );
}