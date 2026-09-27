/**
 * paradu'l — Accessible Modal Dialog
 */

import { useEffect, useRef } from 'react';
import { IconX } from './Icons.jsx';

export default function Modal({ isOpen, onClose, title, children, maxWidth = '540px' }) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    // Handle ESC key press
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        onClose();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    // Prevent body scrolling while modal is open
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="presentation"
    >
      <div
        className="modal-container"
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        style={{ maxWidth }}
      >
        <header className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <IconX size={18} />
          </button>
        </header>

        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
