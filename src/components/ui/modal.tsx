"use client";

import { X } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  titleId: string;
  children: ReactNode;
  focusKey?: string;
};

export function Modal({ open, onClose, titleId, children, focusKey }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (!open) {
      if (dialog.open) dialog.close();
      return;
    }
    if (!dialog.open) dialog.showModal();
    const heading = dialog.querySelector<HTMLElement>(`[id="${titleId}"]`);
    if (heading) {
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
    }
    dialog.scrollTop = 0;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open, focusKey, titleId]);

  return (
    <dialog
      ref={ref}
      className="modal"
      aria-labelledby={titleId}
      onClose={onClose}
      onKeyDown={(event) => {
        if (event.key !== "Tab") return;
        const focusable = Array.from(
          event.currentTarget.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]',
          ),
        ).filter((element) => element.getClientRects().length > 0);
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        // The title receives initial focus; lazy content may not yet contain fields.
        if (!focusable.includes(document.activeElement as HTMLElement)) {
          event.preventDefault();
          (event.shiftKey ? last : first)?.focus();
          return;
        }
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="modal-inner">
        <button
          type="button"
          className="modal-close"
          onClick={onClose}
          aria-label="Закрыть окно"
        >
          <X size={22} />
        </button>
        {children}
      </div>
    </dialog>
  );
}
