// src/components/Navbar.jsx
// SCRUM-8: text moved to src/i18n (Moneab Milad)
// SCRUM-22: header usable from 320 px up (Menu button below 1024 px)
import { useEffect, useState } from "react";
import { Link, useResolvedPath, useMatch } from "react-router-dom";
import { FaMoon, FaSun, FaFacebook, FaYoutube } from "react-icons/fa";
import { FaSquareInstagram } from "react-icons/fa6";
import LanguageSelector from "./LanguageSelector"; // SCRUM-7: EN / FR / Mi'kmaq
import LanguageNotice from "./LanguageNotice"; // SCRUM-8: Mi'kmaq not available yet
import { BUTTON_CLASSES } from "./controlStyles"; // SCRUM-22: shared button look
import { useText } from "../i18n/useText"; // SCRUM-8: Page Text lookup

// ---- Navbar ----
export default function Navbar() {
  const [theme, setTheme] = useState(() => {
    // prefer saved theme, then system preference
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
  const text = useText(); // SCRUM-8
  const [menuOpen, setMenuOpen] = useState(false); // SCRUM-22: page links on narrow screens

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-black/10 dark:border-white/10">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-2">
        <Link to="/" className="font-semibold tracking-wide">
          Woodland
        </Link>

        {/* SCRUM-7: no gap-6 here; index.css "nav a" margins already space the links,
            and the freed width lets the Language Selector fit on laptop screens */}
        {/* SCRUM-22: below lg the links drop to their own row, shown by the Menu button */}
        <ul
          id="site-menu"
          className={`${menuOpen ? "flex" : "hidden"} order-last w-full flex-col items-start lg:order-none lg:w-auto lg:flex lg:flex-row lg:items-center text-sm`}
          data-cy="nav-links"
        >
          <NavItem to="/">{text("common.nav.home")}</NavItem>
          <NavItem to="/about">{text("common.nav.about")}</NavItem>
          <NavItem to="/ecosystem">{text("common.nav.ecosystem")}</NavItem>
          <NavItem to="/gallery">{text("common.nav.gallery")}</NavItem>
          <NavItem to="/naturalburial">{text("common.nav.naturalBurial")}</NavItem>
          <NavItem to="/map">{text("common.nav.map")}</NavItem>
          <NavItem to="/trees">{text("common.nav.trees")}</NavItem>
          <NavItem to="/contacts">{text("common.nav.contact")}</NavItem>
        </ul>

        {/* SCRUM-7: Language Selector and Light/Dark button share one right-hand group */}
        <div className="flex flex-wrap items-center gap-2 lg:ml-4">
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            className={`${BUTTON_CLASSES} lg:hidden`}
            data-cy="menu-button"
          >
            {menuOpen ? text("common.nav.closeMenu") : text("common.nav.menu")}
          </button>
          <LanguageSelector />
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={text("common.theme.toggleLabel")}
            className={BUTTON_CLASSES}
            title={text("common.theme.title")}
          >
            {theme === "dark" ? <FaSun /> : <FaMoon />}
            <span className="hidden sm:inline">{theme === "dark" ? text("common.theme.light") : text("common.theme.dark")}</span>
          </button>
        </div>
      </nav>
      <LanguageNotice />
    </header>
  );
}


// Helper to get active link styling that matches your Tailwind scheme
function NavItem({ to, children }) {
  const resolved = useResolvedPath(to);
  const isActive = useMatch({ path: resolved.pathname, end: true });
  return (
    <li>
      <Link
        to={to}
        className={`inline-flex min-h-[44px] items-center whitespace-nowrap hover:opacity-70 ${
          isActive ? "font-medium underline underline-offset-4" : ""
        }`}
      >
        {children}
      </Link>
    </li>
  );
}

/* ---- (Optional) Footer kept here so existing imports don't break ---- */
export function Footer() {
  const text = useText();
  return (
    <footer className="bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 transition-colors duration-300 border-t border-black/10 dark:border-white/10 w-screen">
      <div className="flex items-center justify-between pl-4 sm:px-6 py-4">
        {/* Socials */}
        <div className="flex gap-4">
          <a
            href="https://www.facebook.com/StMargaretsBayStewardshipAssociation/"
            aria-label={text("common.footer.facebook")}
            data-cy="footer-facebook"
            className="relative inline-flex items-center justify-center min-h-[44px] min-w-[44px] bg-white p-2 rounded-full hover:ring-2 hover:ring-gray-200 transition-all duration-200"
          >
            <FaFacebook className="fill-[#1c1f26]" size={25} aria-hidden="true" />
          </a>
          <a
            href="https://www.instagram.com/stmargaretsbaysa/"
            aria-label={text("common.footer.instagram")}
            data-cy="footer-instagram"
            className="relative inline-flex items-center justify-center min-h-[44px] min-w-[44px] bg-white p-2 rounded-full hover:ring-2 hover:ring-gray-200 transition-all duration-200"
          >
            <FaSquareInstagram className="fill-[#1c1f26]" size={25} aria-hidden="true" />
          </a>
          <a
            href="https://www.youtube.com/watch?v=hhed9dEyfVU&list=PLsIXMc3B__c2jg_yjIN1E9HMuRwEnMMuS&pp=iAQB"
            aria-label={text("common.footer.youtube")}
            data-cy="footer-youtube"
            className="relative inline-flex items-center justify-center min-h-[44px] min-w-[44px] bg-white p-2 rounded-full hover:ring-2 hover:ring-gray-200 transition-all duration-200"
          >
            <FaYoutube className="fill-[#1c1f26]" size={25} aria-hidden="true" />
          </a>
        </div>
        {/* Address / copyright */}
        <div className="flex flex-col sm:flex-row sm:justify-between gap-4 pr-[15px] w-[170px] sm:w-[900px]">
          <p className="text-[12px] sm:text-sm">{text("common.footer.address")}</p>
          <p className="text-[10px] sm:text-xs">{text("common.footer.copyright")}</p>
        </div>
      </div>
    </footer>
  );
}
