/**
 * @file GentleMessage.jsx
 * @description A calm on-page message that replaces browser pop-up alerts. It sits
 * in the normal page flow next to the control it belongs to, is announced to screen
 * readers, and stays until the Website Visitor acts again (no timer).
 *
 * Author: Moneab Milad (DEFCON)
 * Jira: SCRUM-71 | SRS: [ID 316], [ID 317]
 *
 * COTS (Commercial Off-The-Shelf Software):
 * - React: https://react.dev
 * - Tailwind CSS utility classes: https://tailwindcss.com
 *
 * Notes:
 * - Kind is shown with a text prefix, never by colour alone. Neutral tints only.
 * - "good" uses role="status" (polite); "careful" uses role="alert".
 */

import React from "react";
import { useText } from "../i18n/useText";
import { BUTTON_CLASSES } from "./controlStyles.js";

/**
 * Purpose: Show one gentle message.
 *
 * Props:
 * - kind: "good" | "careful"
 * - children: the message text
 * - onDismiss: optional; when given a close button is shown
 */
export default function GentleMessage({ kind = "good", children, onDismiss }) {
  const t = useText();
  const careful = kind === "careful";

  return (
    <div
      role={careful ? "alert" : "status"}
      data-cy="gentle-message"
      data-kind={careful ? "careful" : "good"}
      className="flex flex-wrap items-center gap-3 rounded-md border border-black/20 dark:border-white/30 bg-black/5 dark:bg-white/10 p-3 text-lg leading-[1.2]"
    >
      <p className="flex-1 min-w-[12rem]">
        <span data-cy="gentle-message-prefix">
          {careful ? t("common.message.careful") : t("common.message.good")}
        </span>{" "}
        {children}
      </p>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          data-cy="gentle-message-dismiss"
          className={BUTTON_CLASSES}
        >
          {t("common.message.dismiss")}
        </button>
      )}
    </div>
  );
}
