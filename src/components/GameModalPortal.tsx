import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface GameModalPortalProps {
  isOpen: boolean;
  onClose?: () => void;
  closeOnEsc?: boolean;
  closeOnBackdrop?: boolean;
  zIndex?: number;
  overlayClassName?: string;
  ariaLabel?: string;
  dataTestId?: string;
  children: React.ReactNode;
}

// Track open modal stack so Escape only closes the topmost modal
const openModalStack: symbol[] = [];

export const GameModalPortal: React.FC<GameModalPortalProps> = ({
  isOpen,
  onClose,
  closeOnEsc = true,
  closeOnBackdrop = true,
  zIndex = 1200,
  overlayClassName = '',
  ariaLabel,
  dataTestId,
  children,
}) => {
  const modalIdRef = useRef<symbol>(Symbol('game-modal'));
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!isOpen) return;
    const id = modalIdRef.current;
    openModalStack.push(id);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closeOnEsc && onCloseRef.current) {
        const topId = openModalStack[openModalStack.length - 1];
        if (topId === id) {
          e.stopPropagation();
          e.preventDefault();
          onCloseRef.current();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      const idx = openModalStack.lastIndexOf(id);
      if (idx !== -1) openModalStack.splice(idx, 1);
    };
  }, [isOpen, closeOnEsc]);

  if (!isOpen || typeof document === 'undefined') return null;

  return createPortal(
    <div
      className={`game-portal-backdrop ${overlayClassName}`.trim()}
      style={{ zIndex }}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      data-testid={dataTestId}
      onClick={(e) => {
        if (closeOnBackdrop && e.target === e.currentTarget && onCloseRef.current) {
          onCloseRef.current();
        }
      }}
    >
      {children}
    </div>,
    document.body
  );
};
