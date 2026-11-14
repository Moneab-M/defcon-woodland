/**@author xavier Mcdonald
 * @file Home.jsx
 * @description Main landing page featuring hero image rotation, theme persistence,
 * text-to-speech, weather widget integration, featured species modal, and
 * accessible UI elements for the Woodland Conservation website.
 */


import React, { useEffect, useState } from "react";
import { useText } from "../i18n/useText";
import {
  FaVolumeUp,
  FaPause,
  FaSun,
  FaMoon,
  FaMapMarkerAlt,
} from "react-icons/fa";

import image from "../assets/Light BG Image.jpg";        // Background hero image
import image1 from "../assets/F-Spec-home.png";          // Featured species image
import image2 from "../assets/second-image.jpg";         // Rotating hero images
import image3 from "../assets/third-image.png";
import image4 from "../assets/fourth-image.png";

// -----------------------------------------------------------------------------
// Theme helpers
// -----------------------------------------------------------------------------
const THEME_KEY = "wc_theme_pref";
// Persist for ~1 year
const YEAR_MS = 365 * 24 * 60 * 60 * 1000;

function getStoredTheme() {
  try {
    const raw = localStorage.getItem(THEME_KEY);
    if (!raw) return null;
    const { theme, ts } = JSON.parse(raw);
    if (!theme || !ts || Date.now() - ts > YEAR_MS) return null;
    return theme; // "light" | "dark"
  } catch {
    return null;
  }
}

function storeTheme(theme) {
  try {
    localStorage.setItem(
      THEME_KEY,
      JSON.stringify({ theme, ts: Date.now() })
    );
  } catch {
    // ignore
  }
}

function applyTheme(theme) {
  const root = document.documentElement; // Tailwind dark mode via class
  if (theme === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
}

// Rotating hero images
const heroImages = [image2, image3, image4];

// -----------------------------------------------------------------------------
// Weather widget (H4)
// -----------------------------------------------------------------------------
function WeatherWidget() {
  const t = useText();
  // Halifax-ish fallback
  const DEFAULT = { lat: 44.6511, lon: -63.582, labelKey: "home.weather.localWoodland" };

  const [coords, setCoords] = useState(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [errKey, setErrKey] = useState("");
  const [data, setData] = useState(null);

  async function loadWeather(lat, lon) {
    try {
      setLoading(true);
      setErrKey("");
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m&timezone=auto`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Weather unavailable");
      const json = await res.json();
      setData({
        temp: json?.current?.temperature_2m,
        wind: json?.current?.wind_speed_10m,
        tz: json?.timezone ?? "local",
      });
    } catch (e) {
      setErrKey("home.weather.unavailable");
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadWeather(coords.lat, coords.lon);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coords.lat, coords.lon]);

  const requestLocation = () => {
    if (!("geolocation" in navigator)) {
      setErrKey("home.weather.notSupported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          labelKey: "home.weather.yourLocation",
        });
      },
      () => {
        setErrKey("home.weather.permissionDenied");
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  return (
    <section className="w-full fade-in">
      <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-gray-800/60 backdrop-blur p-5 transition-all transform hover:scale-105 duration-300">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <FaMapMarkerAlt className="opacity-80" />
            {t("home.weather.title")} — <span className="opacity-80">{t(coords.labelKey)}</span>
          </h3>
          <button
            onClick={requestLocation}
            className="text-sm px-3 py-1 rounded-md border border-black/10 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/10 transition"
          >
            {t("home.weather.useMyLocation")}
          </button>
        </div>

        <div className="mt-4 text-sm opacity-80">
          {loading && <p>{t("home.weather.loading")}</p>}
          {!loading && errKey && <p>{t(errKey)}</p>}
          {!loading && !errKey && data && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-base">
              <div>
                <div className="text-xs opacity-60">{t("home.weather.temperature")}</div>
                <div className="text-lg font-medium">
                  {Math.round(data.temp)}°C
                </div>
              </div>
              <div>
                <div className="text-xs opacity-60">{t("home.weather.wind")}</div>
                <div className="text-lg font-medium">
                  {Math.round(data.wind)} {t("home.weather.windUnit")}
                </div>
              </div>
              <div>
                <div className="text-xs opacity-60">{t("home.weather.timezone")}</div>
                <div className="text-lg font-medium">{data.tz}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// Modal for Featured Species
// -----------------------------------------------------------------------------
const Modal = ({ isOpen, onClose, speciesInfo }) => {
  const t = useText();
  if (!isOpen || !speciesInfo) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <img
          src={speciesInfo.img}
          alt={speciesInfo.title}
          className="modal-image"
        />
        <h2>{speciesInfo.title}</h2>
        <p>{speciesInfo.description}</p>
        <button onClick={onClose} className="close-button">
          {t("home.modal.close")}
        </button>
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// Home page
// -----------------------------------------------------------------------------
export default function Home() {
  const t = useText();
  // Text-to-speech
  const [speakingText, setSpeakingText] = useState("");

  // Theme state
  const [theme, setTheme] = useState(() => {
    const stored = getStoredTheme();
    if (stored) return stored;
    const prefersDark =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  });

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSpecies, setSelectedSpecies] = useState(null);

  // Hero image rotation
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    applyTheme(theme);
    storeTheme(theme);
    
  }, [theme]);

  // Rotate hero images every 6 seconds
  useEffect(() => {
    const id = setInterval(
      () => setHeroIndex((prev) => (prev + 1) % heroImages.length),
      6000
    );
    return () => clearInterval(id);
  }, []);

  const toggleTheme = () =>
    setTheme((t) => (t === "dark" ? "light" : "dark"));

  const handleSpeakText = (text) => {
    if (speakingText === text) {
      window.speechSynthesis.pause();
      window.speechSynthesis.cancel();
      setSpeakingText("");
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-CA";
      utterance.onend = () => setSpeakingText("");
      window.speechSynthesis.speak(utterance);
      setSpeakingText(text);
    }
  };

  // Species info for modal
  const featuredSpeciesInfo = {
    img: image1,
    title: t("home.featured.name"),
    description: t("home.featured.longDescription"),
  };

  const openModal = () => {
    setSelectedSpecies(featuredSpeciesInfo);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      {/* ============================= [H1] NAV ============================= */}
      

      {/* Murf AI embed */}
      <iframe
        className="murf-embed w-full"
        height="102"
        src="https://murf.ai/embeds/index.html?embedId=m4nccss4"
        allowFullScreen
        title="Murf Embed Player"
        style={{ border: "none" }}
      ></iframe>
      <script src="https://murf.ai/embeds/widget.js"></script>

      {/* ============================ [H3] HERO ============================ */}
      <div
        className="relative w-full bg-cover bg-center fade-in"
        style={{ backgroundImage: `url(${image})` }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between px-6 py-12 mx-auto max-w-7xl">
          {/* Left: text */}
          <div className="w-full lg:w-1/2 text-left text-white">
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-4 flex flex-col">
              {t("home.hero.welcome")}{" "}
              <span className="text-light-primary dark:text-dark-primary">
                {t("home.hero.siteName")}
              </span>
            </h1>
            <p className="text-lg lg:text-2xl max-w-3xl mx-auto flex items-start">
              <button
                onClick={() =>
                  handleSpeakText(
                    t("home.hero.intro")
                  )
                }
                className="mr-4 mt-1 p-2 bg-transparent text-blue-300 hover:text-white rounded-full shadow-lg hover:bg-white/10 transition"
                aria-label={t("home.readAloud")}
              >
                {speakingText ===
                t("home.hero.intro") ? (
                  <FaPause className="text-xl" />
                ) : (
                  <FaVolumeUp className="text-xl" />
                )}
              </button>
              {t("home.hero.intro")}
            </p>
          </div>

          {/* Right: rotating hero images */}
          <div className="w-full lg:w-1/2 mt-8 lg:mt-0">
            <div className="relative w-full h-64 sm:h-80 lg:h-96">
              {heroImages.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={t("home.hero.imageAlt")}
                  className={`absolute inset-0 w-full h-full object-cover rounded-lg shadow-xl transition-opacity duration-1000 ${
                    heroIndex === idx ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ======================= What We Do Section ======================== */}
      <div className="px-4 py-10 lg:px-20">
        <h2 className="text-3xl font-semibold mb-6 text-center">{t("home.whatWeDo.heading")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Conservation Projects Card */}
          <div className="bg-light-background text-black dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:scale-105 transition">
            <h3 className="text-xl font-semibold mb-4">
              {t("home.whatWeDo.conservation.title")}
            </h3>
            <p>
              {t("home.whatWeDo.conservation.text")}
            </p>
            <button
              onClick={() =>
                handleSpeakText(
                  t("home.whatWeDo.conservation.text")
                )
              }
              className="mt-3 p-2 bg-transparent text-blue-500 rounded-full shadow-lg hover:bg-light-primary transition"
              aria-label={t("home.readAloud")}
            >
              {speakingText ===
              t("home.whatWeDo.conservation.text") ? (
                <FaPause className="text-xl" />
              ) : (
                <FaVolumeUp className="text-xl" />
              )}
            </button>
          </div>

          {/* Sustainable Practices Card */}
          <div className="bg-light-background text-black dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:scale-105 transition">
            <h3 className="text-xl font-semibold mb-4">
              {t("home.whatWeDo.sustainable.title")}
            </h3>
            <p>
              {t("home.whatWeDo.sustainable.text")}
            </p>
            <button
              onClick={() =>
                handleSpeakText(
                  t("home.whatWeDo.sustainable.text")
                )
              }
              className="mt-3 p-2 bg-transparent text-blue-500 rounded-full shadow-lg hover:bg-light-primary transition"
              aria-label={t("home.readAloud")}
            >
              {speakingText ===
              t("home.whatWeDo.sustainable.text") ? (
                <FaPause className="text-xl" />
              ) : (
                <FaVolumeUp className="text-xl" />
              )}
            </button>
          </div>

          {/* Wildlife Protection Card */}
          <div className="bg-light-background text-black dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:scale-105 transition">
            <h3 className="text-xl font-semibold mb-4">
              {t("home.whatWeDo.wildlife.title")}
            </h3>
            <p>
              {t("home.whatWeDo.wildlife.text")}
            </p>
            <button
              onClick={() =>
                handleSpeakText(
                  t("home.whatWeDo.wildlife.text")
                )
              }
              className="mt-3 p-2 bg-transparent text-blue-500 rounded-full shadow-lg hover:bg-light-primary transition"
              aria-label={t("home.readAloud")}
            >
              {speakingText ===
              t("home.whatWeDo.wildlife.text") ? (
                <FaPause className="text-xl" />
              ) : (
                <FaVolumeUp className="text-xl" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ===================== Relevant Articles Section ==================== */}
      <div className="px-4 py-10 lg:px-20">
        <h2 className="text-3xl font-semibold mb-6 text-center">
          {t("home.articles.heading")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Article 1 */}
          <div className="bg-light-background text-black dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:scale-105 transition">
            <h3 className="text-xl font-semibold mb-4">
              {t("home.articles.article1.title")}
            </h3>
            <p>
              {t("home.articles.article1.text")}
            </p>
            <a
              href="https://ca.news.yahoo.com/proposed-conservation-area-bring-closer-090000532.html"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block p-2 bg-transparent text-blue-500 rounded-full shadow-lg hover:bg-light-primary transition"
            >
              {t("home.articles.readMore")}
            </a>
          </div>

          {/* Article 2 */}
          <div className="bg-light-background text-black dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:scale-105 transition">
            <h3 className="text-xl font-semibold mb-4">
              {t("home.articles.article2.title")}
            </h3>
            <p>
              {t("home.articles.article2.text")}
            </p>
            <a
              href="https://www.climatestoriesatlantic.ca/stories/a-final-footprint"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block p-2 bg-transparent text-blue-500 rounded-full shadow-lg hover:bg-light-primary transition"
            >
              {t("home.articles.readMore")}
            </a>
          </div>

          {/* Article 3 */}
          <div className="bg-light-background text-black dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:scale-105 transition">
            <h3 className="text-xl font-semibold mb-4">
              {t("home.articles.article3.title")}
            </h3>
            <p>
              {t("home.articles.article3.text")}
            </p>
            <a
              href="https://www.awakeashes.com/blog/stpaulsnovascotia"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block p-2 bg-transparent text-blue-500 rounded-full shadow-lg hover:bg-light-primary transition"
            >
              {t("home.articles.readMore")}
            </a>
          </div>
        </div>
      </div>

      {/* ========== Weather + Featured Species row (H4 + modal) ========== */}
      <div className="px-4 py-10 lg:px-20">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Weather column */}
          <div className="w-full md:w-1/2">
            <WeatherWidget />
          </div>

          {/* Featured species column */}
          <div className="w-full md:w-1/2">
            <section className="w-full">
              <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-gray-800/60 backdrop-blur p-5 transition-all transform hover:scale-105 duration-300">
                <h2 className="text-2xl font-semibold text-center mb-4">
                  {t("home.featured.heading")}
                </h2>

                <div className="mt-2 max-w-xs mx-auto bg-light-background text-black dark:bg-gray-900/80 p-4 rounded-lg shadow-lg transition-all transform hover:scale-105 duration-300">
                  <h3 className="text-lg font-semibold mb-3 text-center">
                    {t("home.featured.name")}
                  </h3>
                  <div className="flex justify-center mb-3">
                    <img
                      src={image1}
                      alt={t("home.featured.name")}
                      className="max-w-full h-auto rounded-lg"
                    />
                  </div>
                  <p className="text-sm text-center mb-3">
                    {t("home.featured.shortDescription")}
                  </p>
                  <button
                    onClick={openModal}
                    className="mt-1 px-4 py-2 text-sm bg-transparent text-blue-500 rounded-full shadow-lg hover:bg-light-primary transition mx-auto block"
                  >
                    {t("home.featured.learnMore")}
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        speciesInfo={selectedSpecies}
      />
    </div>
  );
}
