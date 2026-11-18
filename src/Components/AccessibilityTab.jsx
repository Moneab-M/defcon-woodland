/* @author Rakhuzuwo
/ Added functianilty to the button by allow for dark mode,
/line spacing, and font size inscrease
*/
import React, { useEffect, useState } from "react";
import { useText } from "../i18n/useText";

const AccessibilityTab = () => {
  const t = useText();
  // Load saved settings from localStorage or fallback to defaults
  const [textSize, setTextSize] = useState(localStorage.getItem("textSize") || "medium");
  const [contrast, setContrast] = useState(localStorage.getItem("contrast") || "default");
  const [lineSpace, setLineSpace] = useState(localStorage.getItem("lineSpace") || "default");

  useEffect(() => {
    const html = document.documentElement;

    //  Apply TEXT SIZE classes
    html.classList.remove("text-small", "text-medium", "text-large", "text-massive");
    html.classList.add(`text-${textSize}`);

    // ⚡ Apply CONTRAST classes
    html.classList.remove("contrast-default", "contrast-dark", "contrast-greyscale", "contrast-inverted");
    html.classList.add(`contrast-${contrast}`);

    // ⚡ Sync with Tailwind's built-in dark mode toggle
    if (contrast === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }

    // ⚡ Apply LINE SPACING classes
    html.classList.remove("linespace-default", "linespace-2", "linespace-3", "linespace-4");
    html.classList.add(`linespace-${lineSpace}`);

    // 💾 Save user preferences so they persist on reload
    localStorage.setItem("textSize", textSize);
    localStorage.setItem("contrast", contrast);
    localStorage.setItem("lineSpace", lineSpace);
  }, [textSize, contrast, lineSpace]); // Re-run effect whenever these change

  return (
    <div id="accessibility-panel" className="fixed bottom-20 right-4 p-4 bg-white dark:bg-gray-800 text-black dark:text-white shadow-lg rounded-lg z-50 w-64">
      <h3 className="font-bold mb-2">{t("common.accessibility.title")}</h3>

      {/* =======================
          TEXT SIZE SELECTOR
         ======================= */}
      <label className="block mb-1">{t("common.accessibility.textSize")}</label>
      <select
        value={textSize}
        onChange={(e) => setTextSize(e.target.value)}
        className="mb-2 border rounded p-1 w-full bg-white dark:bg-gray-700 text-black dark:text-white"
      >
        <option value="small">{t("common.accessibility.sizeSmall")}</option>
        <option value="medium">{t("common.accessibility.sizeMedium")}</option>
        <option value="large">{t("common.accessibility.sizeLarge")}</option>
        <option value="massive">{t("common.accessibility.sizeMassive")}</option>
      </select>

      {/* =======================
          CONTRAST SELECTOR
         ======================= */}
      <label className="block mb-1">{t("common.accessibility.contrast")}</label>
      <select
        value={contrast}
        onChange={(e) => setContrast(e.target.value)}
        className="mb-2 border rounded p-1 w-full bg-white dark:bg-gray-700 text-black dark:text-white"
      >
        <option value="default">{t("common.accessibility.contrastDefault")}</option>
        <option value="dark">{t("common.accessibility.contrastDark")}</option>
        <option value="greyscale">{t("common.accessibility.contrastGreyscale")}</option>
        <option value="inverted">{t("common.accessibility.contrastInverted")}</option>
      </select>

      {/* =======================
          LINE SPACING SELECTOR
         ======================= */}
      <label className="block mb-1">{t("common.accessibility.lineSpacing")}</label>
      <select
        value={lineSpace}
        onChange={(e) => setLineSpace(e.target.value)}
        className="mb-2 border rounded p-1 w-full bg-white dark:bg-gray-700 text-black dark:text-white"
      >
        <option value="default">{t("common.accessibility.spacingDefault")}</option>
        <option value="2">{t("common.accessibility.spacing2")}</option>
        <option value="3">{t("common.accessibility.spacing3")}</option>
        <option value="4">{t("common.accessibility.spacing4")}</option>
      </select>
    </div>
  );
};

export default AccessibilityTab;
