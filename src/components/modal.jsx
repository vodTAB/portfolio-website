'use client';

import React, { useEffect, useRef, useState } from "react";

/**
 * Modal
 * A lightweight, draggable popup — no external library needed.
 *
 * Drag it by clicking and holding the header (title bar) and moving
 * the pointer. Position resets each time the modal is reopened.
 *
 * By default it's a true modal: a dark overlay covers the page and
 * blocks interaction with everything behind it until closed.
 * Pass `blocking={false}` to make it a floating panel instead — no
 * overlay, rest of the page stays fully interactive.
 *
 * Usage:
 *   const [openPopup, setOpenPopup] = useState(null);
 *
 *   <Modal isOpen={openPopup === "work"} onClose={() => setOpenPopup(null)} title="My Work">
 *     <p>Some content...</p>
 *   </Modal>
 */
export default function Modal({ isOpen, onClose, title, children, blocking = true }) {
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, baseX: 0, baseY: 0 });

  // reset position every time the modal opens
  useEffect(() => {
    if (isOpen) setDragPos({ x: 0, y: 0 });
  }, [isOpen]);

  // close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  // drag tracking — only active while isDragging is true
  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (e) => {
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      setDragPos({
        x: dragStart.current.baseX + dx,
        y: dragStart.current.baseY + dy,
      });
    };
    const handleUp = () => setIsDragging(false);

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };
  }, [isDragging]);

  const startDrag = (e) => {
    dragStart.current = { x: e.clientX, y: e.clientY, baseX: dragPos.x, baseY: dragPos.y };
    setIsDragging(true);
  };

  if (!isOpen) return null;

  const box = (
    <div
      className={`modal-box ${!blocking ? "modal-floating" : ""} ${isDragging ? "is-dragging" : ""}`}
      role="dialog"
      aria-modal={blocking}
      aria-labelledby="modal-title"
      onClick={(e) => e.stopPropagation()}
      style={{ transform: `translate(${dragPos.x}px, ${dragPos.y}px)` }}
    >
      <div className="modal-header" onPointerDown={startDrag}>
        <h2 id="modal-title" className="modal-title">{title}</h2>
        <button
          type="button"
          className="modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
      </div>
      <div className="modal-content">{children}</div>
    </div>
  );

  if (!blocking) {
    return box;
  }

  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      {box}
    </div>
  );
}