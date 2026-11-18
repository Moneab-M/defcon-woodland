/**
 * About Page Component
 * 
 * Description:
 * This component renders the About page for the St. Margaret’s Bay Woodland Conservation website.
 * Features include:
 *  - Grade-7 reading level text for accessibility
 *  - Theme-aware Calibri styling (light/dark mode)
 *  - Text-to-Speech (TTS) with spacebar play/pause support
 *  - Image description audio buttons
 *  - Responsive layout for desktop and mobile
 *  - Requirements IDs 401–410 fully implemented
 *
 * Author: Patrick Gosse (A00463761)
 * Course: CSCI 3428 – Software Engineering
 */


import { useEffect, useRef, useState } from "react";
import { useText } from "../i18n/useText";
import ImageAudioButton from "../Components/ImageAudioButton"; // SCRUM-9: Image Audio Button

// Text for these lists lives in the translation files under about.*; only ids, images and audio stay here.
const SECTIONS = [
  {
    id: "about",
    imgSrc: "fern-leaves.jpg"
  },
  {
    id: "mission",
    imgSrc: "ferns.jpg"
  },
  {
    id: "vision",
    imgSrc: "red-maple.jpg"
  }
];

// General nature info for species spotlight (ids for about.species.<id>.*)
const SPECIES_IDS = ["redMaple", "chickadee", "deer", "fern"];

// ids for about.timeline.<id>.*
const TIMELINE_IDS = ["early2000s", "tens", "today"];

// ids for about.faq.<id>.*
const FAQ_IDS = ["help", "purpose", "readAloud", "phone"];

const btnBase =
  "relative overflow-hidden inline-flex items-center gap-2 rounded-lg px-3 py-2 font-semibold border transition-colors " +
  "bg-neutral-200 text-neutral-900 border-neutral-500 hover:bg-neutral-300 hover:border-neutral-700 " +
  "dark:bg-neutral-700 dark:text-white dark:border-neutral-300 dark:hover:bg-neutral-600 dark:hover:border-white " +
  "focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-400/60 dark:focus-visible:ring-blue-300/60";

export default function About() {
  const t = useText();

  // Build the translated lists for the Selected Language
  const sections = SECTIONS.map((sec) => ({
    ...sec,
    title: t(`about.sections.${sec.id}.title`),
    text: t(`about.sections.${sec.id}.text`),
    imgAlt: t(`about.sections.${sec.id}.imgAlt`),
    caption: t(`about.sections.${sec.id}.caption`),
  }));
  const species = SPECIES_IDS.map((id) => ({
    id,
    name: t(`about.species.${id}.name`),
    type: t(`about.species.${id}.type`),
    note: t(`about.species.${id}.note`),
  }));
  const timeline = TIMELINE_IDS.map((id) => ({
    id,
    year: t(`about.timeline.${id}.year`),
    text: t(`about.timeline.${id}.text`),
  }));
  const faqItems = FAQ_IDS.map((id) => ({
    id,
    question: t(`about.faq.${id}.question`),
    answer: t(`about.faq.${id}.answer`),
  }));

  const [activeId, setActiveId] = useState(null);
  const speechRef = useRef({ utter: null, speakingFor: null });

  const [textSize, setTextSize] = useState("text-base sm:text-lg");
  const [dyslexic, setDyslexic] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [relaxedLines, setRelaxedLines] = useState(false);

  const [progress, setProgress] = useState(0);
  const [visibleSection, setVisibleSection] = useState(null);

  const [faqOpenIndex, setFaqOpenIndex] = useState(null);

  const [ambientOn, setAmbientOn] = useState(false);
  const ambientRef = useRef(null);

  const increaseText = () => setTextSize("text-lg sm:text-xl");
  const decreaseText = () => setTextSize("text-sm sm:text-base");

  const smoothScroll = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    // leaf animation
    const leaf = document.createElement("div");
    leaf.innerHTML = "🍃";
    leaf.style.position = "fixed";
    leaf.style.bottom = "50px";
    leaf.style.left = "50%";
    leaf.style.transform = "translateX(-50%)";
    leaf.style.fontSize = "24px";
    leaf.style.opacity = "1";
    leaf.style.transition = "all 1.2s ease-out";
    leaf.style.pointerEvents = "none";
    document.body.appendChild(leaf);

    setTimeout(() => {
      leaf.style.bottom = "320px";
      leaf.style.opacity = "0";
    }, 10);

    setTimeout(() => leaf.remove(), 1300);
  };

  // Ambient sound toggle (OFF by default)
  const toggleAmbient = () => {
    try {
      if (!ambientRef.current) {
        const audio = new Audio("/audio/forest-ambient.mp3");
        audio.loop = true;
        audio.volume = 0.15;
        ambientRef.current = audio;
      }
      if (!ambientOn) {
        ambientRef.current.play().catch(() => {
          // ignore playback errors (e.g., user gesture restrictions)
        });
        setAmbientOn(true);
      } else {
        ambientRef.current.pause();
        setAmbientOn(false);
      }
    } catch {
      // fail silently if audio not available
    }
  };

  // Button ripple effect
  const addRipple = (event) => {
    const target = event.currentTarget;
    if (!target) return;

    const rect = target.getBoundingClientRect();
    const circle = document.createElement("span");
    const diameter = Math.max(rect.width, rect.height);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.position = "absolute";
    circle.style.borderRadius = "50%";
    circle.style.left = `${event.clientX - rect.left - radius}px`;
    circle.style.top = `${event.clientY - rect.top - radius}px`;
    circle.style.backgroundColor = "rgba(255,255,255,0.35)";
    circle.style.transform = "scale(0)";
    circle.style.transition = "transform 450ms ease-out, opacity 450ms ease-out";
    circle.style.opacity = "1";
    circle.style.pointerEvents = "none";

    target.appendChild(circle);

    requestAnimationFrame(() => {
      circle.style.transform = "scale(1)";
      circle.style.opacity = "0";
    });

    setTimeout(() => {
      circle.remove();
    }, 500);
  };

  const handleButtonClick = (handler) => (event) => {
    addRipple(event);
    if (typeof handler === "function") handler(event);
  };

  // Reading progress bar
  useEffect(() => {
    const handleScroll = () => {
      const total =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scrolled = window.scrollY;
      const pct = Math.min(100, Math.max(0, (scrolled / total) * 100));
      setProgress(pct);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Active section highlight
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setVisibleSection(entry.target.id);
        });
      },
      { threshold: 0.5 }
    );

    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Spacebar TTS control
  useEffect(() => {
    const onKey = (e) => {
      if (e.code !== "Space") return;
      e.preventDefault();
      const synth = window.speechSynthesis;
      if (!synth || !speechRef.current.utter) return;

      if (synth.speaking && !synth.paused) synth.pause();
      else if (synth.paused) synth.resume();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
      if (ambientRef.current) {
        ambientRef.current.pause();
      }
    };
  }, []);

  const speak = (sectionId, text) => {
    const synth = window.speechSynthesis;
    if (!synth) return;
    synth.cancel();

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-CA";
    utter.rate = 1.0;
    utter.onend = () => {
      speechRef.current.utter = null;
      speechRef.current.speakingFor = null;
      setActiveId(null);
    };

    speechRef.current.utter = utter;
    speechRef.current.speakingFor = sectionId;
    setActiveId(sectionId);

    synth.speak(utter);
  };

  const handleRead = (sectionId, text) => {
    const synth = window.speechSynthesis;
    if (speechRef.current.speakingFor === sectionId) {
      if (synth.speaking && !synth.paused) synth.pause();
      else if (synth.paused) synth.resume();
      else speak(sectionId, text);
      return;
    }
    speak(sectionId, text);
  };

  const toggleFaq = (index) => {
    setFaqOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <main
      className={
        (dyslexic ? "font-[OpenDyslexic] " : "font-[Calibri] ") +
        "min-h-screen px-4 py-6 sm:px-6 lg:px-8 " +
        (highContrast
          ? "bg-white text-black dark:bg-black dark:text-yellow-50 "
          : "bg-transparent text-black dark:text-yellow-100 ") +
        "dark:[text-shadow:0_0_6px_#2f4f2f50]"
      }
    >
      {/* Reading Progress Bar */}
      <div
        className="fixed top-0 left-0 h-[4px] bg-green-600 dark:bg-green-400 z-50 transition-all"
        style={{ width: progress + "%" }}
      />

      {/* HEADER */}
      <header className="border-b border-neutral-300 dark:border-neutral-700 mb-6 pb-3 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold">
          {t("about.title")}
        </h1>
      </header>

      {/* NAVIGATION + TOGGLES */}
      <div className="flex justify-center gap-3 mb-4 flex-wrap">
        <button
          onClick={handleButtonClick(() => smoothScroll("about"))}
          className={btnBase}
        >
          {t("about.nav.about")}
        </button>
        <button
          onClick={handleButtonClick(() => smoothScroll("mission"))}
          className={btnBase}
        >
          {t("about.nav.mission")}
        </button>
        <button
          onClick={handleButtonClick(() => smoothScroll("vision"))}
          className={btnBase}
        >
          {t("about.nav.vision")}
        </button>
        <button
          onClick={handleButtonClick(increaseText)}
          className={btnBase}
        >
          A+
        </button>
        <button
          onClick={handleButtonClick(decreaseText)}
          className={btnBase}
        >
          A–
        </button>
        <button
          onClick={handleButtonClick(() => setDyslexic((d) => !d))}
          className={btnBase}
          title={t("about.tools.dyslexiaTitle")}
        >
          {t("about.tools.dyslexia")}
        </button>
        <button
          onClick={handleButtonClick(() => setHighContrast((c) => !c))}
          className={btnBase}
          title={t("about.tools.contrastTitle")}
        >
          {t("about.tools.contrast")}
        </button>
        <button
          onClick={handleButtonClick(() => setRelaxedLines((r) => !r))}
          className={btnBase}
          title={t("about.tools.spacingTitle")}
        >
          {t("about.tools.spacing")}
        </button>
        <button
          onClick={handleButtonClick(() => {
            if (navigator.share) {
              navigator.share({ url: window.location.href }).catch(() => {});
            }
          })}
          className={btnBase}
        >
          {t("about.tools.share")}
        </button>
        <button
          onClick={handleButtonClick(toggleAmbient)}
          className={btnBase}
        >
          {ambientOn ? t("about.tools.soundStop") : t("about.tools.soundPlay")}
        </button>
      </div>

      {/* MAIN CONTENT */}
      <section className="mx-auto max-w-5xl space-y-8">
        {sections.map((sec, index) => (
          <div key={sec.id}>
            <article
              id={sec.id}
              className={
                "grid grid-cols-1 md:grid-cols-[200px,1fr] gap-4 p-4 rounded-xl " +
                "border border-neutral-300 dark:border-neutral-700 transition-shadow " +
                "hover:shadow-md hover:border-green-700/60 dark:hover:border-green-400/70 " +
                (visibleSection === sec.id
                  ? "shadow-[0_0_12px_rgba(0,128,0,0.25)]"
                  : "")
              }
            >
              {/* IMAGE */}
              <div className="flex flex-col items-start gap-2">
                <img
                  src={sec.imgSrc}
                  alt={sec.imgAlt}
                  loading="lazy"
                  className="w-full md:w-[200px] h-[150px] object-cover rounded-lg border border-neutral-300 dark:border-neutral-600"
                />
                <p className="text-xs italic opacity-80">{sec.caption}</p>
                <ImageAudioButton
                  imageId={sec.id}
                />
              </div>

              {/* TEXT */}
              <div className="flex flex-col gap-3">
                <div className="inline-flex items-center gap-2">
                  <h2 className="text-xl font-bold">{sec.title}</h2>
                  <span className="h-[2px] flex-1 bg-green-700/50 dark:bg-green-300/60 rounded-full" />
                </div>

                <p
                  className={
                    textSize +
                    " " +
                    (relaxedLines ? "leading-relaxed" : "leading-snug")
                  }
                >
                  {sec.text}
                </p>
                <button
                  className={btnBase}
                  onClick={handleButtonClick(() =>
                    handleRead(sec.id, sec.text)
                  )}
                >
                  🗣️ {t("about.readAloud")}
                </button>
              </div>
            </article>

            {index < sections.length - 1 && (
              <div className="w-full h-[1px] bg-neutral-300 dark:bg-neutral-700 my-4 opacity-60" />
            )}
          </div>
        ))}
      </section>

      {/* IMPACT STATS */}
      <div className="mt-10 text-center text-sm opacity-90 space-y-1">
        <h3 className="font-bold text-lg">{t("about.stats.heading")}</h3>
        <p>{t("about.stats.trees")}</p>
        <p>{t("about.stats.hectares")}</p>
        <p>{t("about.stats.species")}</p>
      </div>

      {/* SPECIES SPOTLIGHT */}
      <section className="mt-10 mx-auto max-w-5xl">
        <h3 className="text-xl font-bold mb-3 text-center">{t("about.species.heading")}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {species.map((sp) => (
            <div
              key={sp.id}
              className="border border-neutral-300 dark:border-neutral-700 rounded-lg p-4 text-sm hover:shadow-md transition-shadow"
            >
              <div className="font-semibold">{sp.name}</div>
              <div className="text-xs opacity-80 mb-1">{sp.type}</div>
              <div>{sp.note}</div>
            </div>
          ))}
        </div>
      </section>

      {/* WOODLAND TIMELINE */}
      <section className="mt-10 mx-auto max-w-5xl">
        <h3 className="text-xl font-bold mb-3 text-center">{t("about.timeline.heading")}</h3>
        <div className="space-y-3 text-sm">
          {timeline.map((item) => (
            <div
              key={item.id}
              className="border-l-4 border-green-700/70 dark:border-green-400/80 pl-3 py-1"
            >
              <div className="font-semibold">{item.year}</div>
              <div>{item.text}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ ACCORDION */}
      <section className="mt-10 mx-auto max-w-5xl">
        <h3 className="text-xl font-bold mb-3 text-center">{t("about.faq.heading")}</h3>
        <div className="space-y-2">
          {faqItems.map((faq, index) => {
            const open = faqOpenIndex === index;
            return (
              <div
                key={faq.id}
                className="border border-neutral-300 dark:border-neutral-700 rounded-lg"
              >
                <button
                  className={
                    "w-full text-left px-4 py-2 flex justify-between items-center " +
                    "bg-neutral-100 dark:bg-neutral-800"
                  }
                  onClick={handleButtonClick(() => toggleFaq(index))}
                >
                  <span className="font-semibold text-sm sm:text-base">
                    {faq.question}
                  </span>
                  <span className="text-lg">{open ? "−" : "+"}</span>
                </button>
                {open && (
                  <div className="px-4 py-3 text-sm bg-white dark:bg-neutral-900">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* LEARN MORE */}
      <div className="mt-10 flex justify-center">
        <a
          href="/learn-more"
          className="px-6 py-3 rounded-lg font-bold bg-blue-600 text-white hover:bg-blue-700 shadow"
        >
          {t("about.learnMore")}
        </a>
      </div>

      {/* BACK TO TOP */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={handleButtonClick(scrollTop)}
          className="px-4 py-2 rounded-lg bg-neutral-300 dark:bg-neutral-700 text-black dark:text-white border border-neutral-500 hover:bg-neutral-400 dark:hover:bg-neutral-600"
        >
          ↑ {t("about.backToTop")}
        </button>
      </div>

      {/* ACCESSIBILITY STRIP */}
      <div className="mt-6 text-center text-sm opacity-80">
        {t("about.accessibilityStrip")}
      </div>
    </main>
  );
}
