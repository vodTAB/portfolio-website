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
  const activeImage = activePiece ? fileUrl(activePiece.full_file_id) : null;

  return (
    <div className="about-content">
      <div className="about-scroll">
        <h4 className="about-scroll-heading">Featured Illustrations</h4>

        {loading ? (
          <p className="modal-desc">Loading…</p>
        ) : activePiece ? (
          <div className="artwork-view">
            {activeImage && (
              <div className="modal-image-wrap">
                <Image
                  src={activeImage}
                  alt={activePiece.title}
                  fill
                  sizes="320px"
                  className="modal-image"
                  priority
                />
              </div>
            )}

            <div className="modal-title-row">
              <p className="modal-primary">{activePiece.title}</p>
              {activePiece.date && (
                <span className="modal-date-inline">{activePiece.date}</span>
              )}
            </div>

            {activePiece.description && (
              <p className="modal-secondary">{activePiece.description}</p>
            )}

            {activePiece.tools?.length > 0 && (
              <p className="modal-secondary">{activePiece.tools.join(", ")}</p>
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
            {illustrations.map((piece, index) => {
              const thumb = fileUrl(piece.thumbnail_file_id);
              return (
                <button
                  key={piece.$id}
                  className="work-thumb"
                  onClick={() => openPiece(index)}
                  aria-label={`Open ${piece.title}`}
                >
                  {thumb && (
                    <Image
                      src={thumb}
                      alt={piece.title}
                      fill
                      sizes="(max-width: 768px) 33vw, 250px"
                      className="work-thumb-img"
                    />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {!activePiece && (
          <>
            <h4 className="about-scroll-heading">Tools/Software</h4>
            <ul className="about-skills">
              {tools.map((tool) => (
                <li key={tool}>{tool}</li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}