'use client';

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { databases, storage } from "@/lib/appwrite";
import { Query } from "appwrite";

const tools = [
  "Clip Studio Paint",
  "Blender",
];

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ILLUSTRATIONS_ID;
const BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID;

const fileUrl = (fileId) =>
  fileId ? storage.getFileView(BUCKET_ID, fileId) : null;

export default function PortfolioA() {
  const [illustrations, setIllustrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await databases.listDocuments(
          DATABASE_ID,
          COLLECTION_ID,
          [Query.orderAsc("sort_order")]
        );
        setIllustrations(res.documents);
      } catch (err) {
        console.error("Failed to load illustrations:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

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

        {loading ? (
          <p className="modal-desc">Loading…</p>
        ) : activePiece ? (
          <div className="artwork-view">
            <div className="modal-image-wrap">
              <Image
                src={fileUrl(activePiece.full_file_id)}
                alt={activePiece.title}
                fill
                sizes="320px"
                className="modal-image"
                priority
              />
            </div>
            <div className="modal-title-row">
              <p className="modal-primary">{activePiece.title}</p>
              <span className="modal-date-inline">{activePiece.date}</span>
            </div>
            <p className="modal-secondary">{activePiece.description}</p>
            <p className="modal-secondary">{activePiece.tools?.join(", ")}</p>
            <p className="modal-secondary">{activePiece.social_link}</p>
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
                key={piece.$id}
                className="work-thumb"
                onClick={() => openPiece(index)}
                aria-label={`Open ${piece.title}`}
              >
                <Image
                  src={fileUrl(piece.thumbnail_file_id)}
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