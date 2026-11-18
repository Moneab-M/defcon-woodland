/* @author Rakuzhuwo
/Add a functianility feature to allow the 
/button to be scaled to each page
/
*/
import React, { useState } from "react";
import AccessibilityTab from "./AccessibilityTab";
import { useText } from "../i18n/useText";
import { FiSettings } from "react-icons/fi"; // Using react-icons for a gear icon

const AccessibilityButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const t = useText();

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? t("common.accessibility.closeSettings") : t("common.accessibility.openSettings")}
        aria-expanded={isOpen}
        aria-controls="accessibility-panel"
        data-cy="settings-button"
        className="fixed bottom-4 right-4 z-50 inline-flex items-center justify-center min-h-[44px] min-w-[44px] bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition"
      >
        <FiSettings size={24} aria-hidden="true" />
      </button>

      {/* Accessibility Panel */}
      {isOpen && <AccessibilityTab />}
    </>
  );
};

export default AccessibilityButton;
