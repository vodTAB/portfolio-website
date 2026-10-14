'use client';

import React, { useEffect, useRef, useState, useId } from "react";

// module-level stack shared by all Modal instances —
// tracks which modals are currently open, in open-order
const openModalStack = [];

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
 * Escape closes only the topmost open modal in a nested stack.
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
  const modalId = useId();

  // reset position every time the modal opens
  useEffect(() => {
    if (isOpen) setDragPos({ x: 0, y: 0 });
  }, [isOpen]);

  // register/unregister this modal on the shared open-stack
  useEffect(() => {
    if (isOpen) {
      openModalStack.push(modalId);
    }
    return () => {
      const idx = openModalStack.indexOf(modalId);
      if (idx !== -1) openModalStack.splice(idx, 1);
    };
  }, [isOpen, modalId]);

  // close on Escape key — only if this modal is topmost
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key !== "Escape") return;
      const topModalId = openModalStack[openModalStack.length - 1];
      if (topModalId === modalId) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose, modalId]);

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
      style={{ transform: `translate(${dragPos.x}px, ${dragPos.y}px)` }}
    >
      <div className="modal-header" onPointerDown={startDrag}>
        <span className="modal-title">{title}</span>
        <div
          className="modal-dots"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          role="button"
          aria-label="Close"
          style={{ cursor: "pointer" }}
        >
          <span className="dot dot-1" />
          <span className="dot dot-2" />
          <span className="dot dot-3" />
        </div>
      </div>
      <div className="modal-content">{children}</div>
    </div>
  );

  if (!blocking) {
    return box;
  }

  return (
    <div className="modal-overlay" role="presentation">
      {box}
    </div>
  );
}