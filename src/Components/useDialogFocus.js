/**
 * @file useDialogFocus.js
 * @description Keyboard focus helper for pop-up dialogs: moves focus into the
 * dialog when it opens, keeps Tab inside it, closes it on Escape and gives
 * focus back to the control that opened it.
 *
 * Author: Moneab Milad (DEFCON)
 * Jira: SCRUM-67 | SRS: WCAG 2.1.1, 2.4.3, 4.1.2
 *
 * Usage:
 *   const dialogRef = useDialogFocus(isOpen, onClose);
 *   <div role="dialog" aria-modal="true" tabIndex={-1} ref={dialogRef}>...</div>
 */

import { useEffect, useRef } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Purpose: Manage focus for one dialog.
 *
 * Parameters:
 * - isOpen: true while the dialog is showing
 * - onClose: function that closes the dialog
 *
 * Returns: a ref to put on the dialog container (give it tabIndex={-1})
 */
export default function useDialogFocus(isOpen, onClose) {
  const dialogRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!isOpen) return undefined;
    const opener = document.activeElement;
    const dialog = dialogRef.current;
    if (dialog) dialog.focus();

    // Escape closes; Tab and Shift+Tab wrap around inside the dialog.
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const items = Array.from(dialogRef.current.querySelectorAll(FOCUSABLE));
      if (items.length === 0) {
        event.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && (active === first || active === dialogRef.current)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      } else if (!dialogRef.current.contains(active)) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      if (opener && typeof opener.focus === "function" && document.contains(opener)) {
        opener.focus();
      }
    };
  }, [isOpen]);

  return dialogRef;
}
