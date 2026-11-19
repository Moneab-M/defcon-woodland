/**
 * @file App.js
 * @description The main application entry point that renders the Navbar and manages routes for various pages of the Woodland Conservation Site.
 * @author Raish Raj Joshi
 */

import React from "react";
import { Footer } from "./Components/navi"; // Footer and Navbarr from the Components folder.
import  Navbar  from "./Components/navi";
import Home from "./pages/Home"; // Home page component.
import About from "./pages/About"; // About page component.
import Ecosystem from "./pages/Ecosystem"; // Ecosystem page component.
import Gallery from "./pages/Gallery"; // Gallery page component.
import NaturalBurial from "./pages/NaturalBurial"; // Natural Burial page component.
import Contact from "./pages/Contact"; // Contact page component.
import MapView from "./pages/MapView";
import TalkingTrees from "./pages/TalkingTrees"; // SCRUM-54: list of Talking Trees
import TreePage from "./pages/TreePage"; // SCRUM-54: one Talking Tree
import { Route, Routes } from "react-router-dom"; // Routing utilities from react-router-dom.
import AccessibilityButton from "./Components/AccessibilityButton";
import NotFound from "./pages/NotFound"; // SCRUM-74: friendly page for unknown addresses
import PageTitle from "./Components/PageTitle"; // Sets the translated browser tab title per route.
import { BUTTON_CLASSES } from "./Components/controlStyles"; // SCRUM-69: shared button look
import { useText } from "./i18n/useText"; // SCRUM-69: skip link text
import LanguageChangeMessage from "./Components/LanguageChangeMessage"; // SCRUM-75
/**
 * @function App
 * @description The main React component that defines the structure of the application.
 * It includes a navigation bar, footer, and routing for various site pages.
 *
 * @returns {JSX.Element} - The rendered application structure.
 */
function App() {
  const t = useText();
  return (
    <div className="flex flex-col min-h-screen font-sans">
      {" "}
      {/* Container for the entire application */}
      <PageTitle />
      {/* SCRUM-69: first tab stop; visible only when focused */}
      <a
        href="#main-content"
        data-cy="skip-link"
        className={`${BUTTON_CLASSES} sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] bg-white dark:bg-gray-900`}
      >
        {t("common.skipToContent")}
      </a>
      {/* Navbar */}
      <Navbar />
       {/* Displays the navigation bar */}
      {/* Main Content */}
      <main id="main-content" tabIndex={-1} className="flex-grow focus:outline-none">
        <LanguageChangeMessage />
        {" "}
        {/* Main area for routing different pages */}
        <Routes>
          {" "}
          {/* Define application routes */}
          <Route path="/" element={<Home />} /> 
          {/* Route for the Home page */}
          <Route path="/about" element={<About />} />{" "}
          {/* Route for the About page */}
          <Route path="/gallery" element={<Gallery />} />{" "}
          {/* Route for the Gallery page */}
          <Route path="/ecosystem" element={<Ecosystem />} />{" "}
          {/* Route for the Ecosystem page */}
          <Route path="/NaturalBurial" element={<NaturalBurial />} />{" "}
          {/* Route for the Natural Burial page */}
          <Route path="/contacts" element={<Contact />} />{" "}
          {/* Route for the Contact page */}
          <Route path="/map" element={<MapView />} />{" "}
          {/* Route for the Map page */}
          <Route path="/trees" element={<TalkingTrees />} />
          <Route path="/trees/:treeId" element={<TreePage />} />
          {/* SCRUM-54: Talking Trees list and one page per tree */}
          <Route path="*" element={<NotFound />} />
          {/* SCRUM-74: any other address */}
        </Routes>
      </main>
      <AccessibilityButton/>
      {/* Footer */}
      <Footer /> {/* Displays the footer */}
    </div>
  );
}

export default App;
