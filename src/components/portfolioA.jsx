'use client';

import React, { useEffect, useState } from "react";
import Image from "next/image";
import clipLogo from "./icons/icons8-clip-studio-paint-100.svg";
import blenderLogo from "./icons/icons8-blender-3d-100.svg";

const tools = [
  { name: "Clip Studio Paint", icon: clipLogo },
  { name: "Blender", icon: blenderLogo },
];

export default function PortfolioA() {
  const [illustrations, setIllustrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/illustrations");


        if (!res.ok) {
          const errorText = await res.text();

          console.error("Illustrations API status:", res.status);
          console.error("Illustrations API response:", errorText);

          throw new Error(`Request failed: ${res.status} - ${errorText}`);
        }


        const data = await res.json();
        setIllustrations(data);
      } catch (err) {
        console.error("Failed to load illustrations:", err);
        setError("Couldn't load illustrations right now — please try again later.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const openPiece = (index) => setActiveIndex(index);
  const closePiece = () => setActiveIndex(null);

  const showNext = () => {
    setActiveIndex((i) =>
      i === null ? null : (i + 1) % illustrations.length
    );
  };

  const showPrev = () => {
    setActiveIndex((i) =>
      i === null
        ? null
        : (i - 1 + illustrations.length) % illustrations.length
    );
  };

  const activePiece =
    activeIndex !== null ? illustrations[activeIndex] : null;

  const thumbnailUrl = (piece) =>
    piece?.id
      ? `/api/illustrations/${piece.id}/thumbnail`
      : null;

  const fullImageUrl = (piece) =>
    piece?.id
      ? `/api/illustrations/${piece.id}/full`
      : null;

  return (
    <div className="about-content">
      <div className="about-scroll">
        <h4 className="about-scroll-heading">Featured Illustrations</h4>

        {loading ? (
          <p className="modal-desc">Loading…</p>
        ) : error ? (
          <p className="modal-desc">{error}</p>
        ) : activePiece ? (
          <div className="artwork-view">
            <div className="modal-image-wrap">
              <Image
                src={fullImageUrl(activePiece)}
                alt={activePiece.title}
                fill
                sizes="(max-width: 768px) 90vw, 600px"
                className="modal-image"
                priority
                unoptimized
              />
            </div>

            <div className="modal-title-row">
              <p className="modal-primary">{activePiece.title}</p>

              {activePiece.date && (
                <span className="modal-date-inline">
                  {activePiece.date}
                </span>
              )}
            </div>

            {activePiece.description && (
              <p className="modal-secondary">
                {activePiece.description}
              </p>
            )}

            {activePiece.tools?.length > 0 && (
              <p className="modal-secondary">
                {activePiece.tools.join(", ")}
              </p>
            )}

            {activePiece.social_link && (
              <a
                className="modal-social-link"
                href={activePiece.social_link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {activePiece.social_link}
              </a>
            )}

            <div className="modal-nav">
              <button onClick={showPrev}>← prev</button>
              <button onClick={closePiece}>close</button>
              <button onClick={showNext}>next →</button>
            </div>
          </div>
        ) : illustrations.length === 0 ? (
          <p className="modal-desc">No pieces added yet.</p>
        ) : (
          <div className="work-grid">
            {illustrations.map((piece, index) => (
              <button
                key={piece.id}
                className="work-thumb"
                onClick={() => openPiece(index)}
                aria-label={`Open ${piece.title}`}
              >
                <Image
                  src={thumbnailUrl(piece)}
                  alt={piece.title}
                  fill
                  sizes="(max-width: 768px) 33vw, 250px"
                  className="work-thumb-img"
                  unoptimized
                />
              </button>
            ))}
          </div>
        )}

        {!activePiece && (
          <>
            <h4 className="about-scroll-heading">Tools/Software</h4>

            <ul className="about-skills">
              {tools.map((tool) => (
                <li key={tool.name}>
                  <img
                    src={tool.icon.src}
                    alt=""
                    className="tools-used-icon"
                  />
                  {tool.name}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}