'use client';

import React, { useState } from "react";
import Image from "next/image";

const illustrations = [
  {
    id: "piece-1",
    title: "Example Piece",
    thumbnail: "/assets/placeholder.png",
    fullImage: "/assets/placeholder.png",
    description: "Short description or context for this piece.",
    date: "2024",
  },
  {
    id: "piece-2",
    title: "Another Piece",
    thumbnail: "/assets/placeholder.png",
    fullImage: "/assets/placeholder.png",
    description: "Short description or context for this piece.",
    date: "2024",
  },
  {
    id: "piece-3",
    title: "Third Piece",
    thumbnail: "/assets/placeholder.png",
    fullImage: "/assets/placeholder.png",
    description: "Short description or context for this piece.",
    date: "2023",
  },
];

const tools = [
  "Clip Studio Paint",
  "Blender",
];

export default function PortfolioA() {
  const [activeIndex, setActiveIndex] = useState(null);

  const openPiece = (index) => setActiveIndex(index);
  const closePiece = () => setActiveIndex(null);
  const showNext = () =>
    setActiveIndex((i) => (i + 1) % illustrations.length);
  const showPrev = () =>
    setActiveIndex((i) => (i - 1 + illustrations.length) % illustrations.length);

  const activePiece = activeIndex !== null ? illustrations[activeIndex] : null;

  return (
    <div className="about-content">
      <div className="about-top">
        <div className="about-portrait-wrap">
          <Image
            src="/assets/portrait.png"
            alt="Portrait of Vod"
            fill
            sizes="72px"
            className="about-portrait"
          />
        </div>
        <div className="header">
          <h3 className="about-name">Vod</h3>
          <p className="about-summary">
            Anime-inspired semi-realistic illustrations, character design, and concept art.
            I enjoy creating expressive characters and exploring different themes and ideas through fantastical or realistic settings.
          </p>
        </div>
      </div>

      <div className="about-scroll">
        <h4 className="about-scroll-heading">Illustration</h4>

        {activePiece ? (
          <div className="artwork-view">
            <div className="modal-image-wrap">
              <Image
                src={activePiece.fullImage}
                alt={activePiece.title}
                fill
                sizes="320px"
                className="modal-image"
                priority
              />
            </div>
            <p className="modal-desc">{activePiece.description}</p>
            <p className="modal-date">{activePiece.date}</p>
            <div className="modal-nav">
              <button onClick={showPrev}>← prev</button>
              <button onClick={closePiece}>close</button>
              <button onClick={showNext}>next →</button>
            </div>
          </div>
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
                  src={piece.thumbnail}
                  alt={piece.title}
                  fill
                  sizes="(max-width: 768px) 33vw, 250px"
                  className="work-thumb-img"
                />
              </button>
            ))}
          </div>
        )}

        <h4 className="about-scroll-heading">Tools/Software</h4>
        <ul className="about-skills">
          {tools.map((tool) => (
            <li key={tool}>{tool}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}