/**@author Rakhuzuwo
 * @file NaturalBurial.jsx
 * @description React component presenting Natural Burial information, including
 * interactive modals, text-to-speech accessibility, and image-based learning cards.
 * Handles modal state, speech synthesis, and structured content sections.
 */


import './NaturalBurial.css';
import burialImage from '../assets/use.png';
import coffinImage from '../assets/coffin.png';  
import markerImage from '../assets/Marker.png'; 
import gpsImage from '../assets/Gps.png';      
import React, { useState, useEffect } from 'react'; 
import { FaVolumeUp, FaPause } from 'react-icons/fa'
import { useText } from '../i18n/useText.js';
import { useLanguage, DEFAULT_LANGUAGE } from '../context/LanguageContext.jsx';
import { isLanguageVerified } from '../i18n/languageStatus.js';
import useDialogFocus from '../Components/useDialogFocus.js';

// Keeps the image button looking exactly like the bare image, with a visible focus ring
const CARD_IMAGE_BUTTON = "card-image-button block p-0 border-0 bg-transparent cursor-pointer";

// Voice locale per Selected Language, so read-aloud matches the text on screen (SCRUM-49 review)
const SPEECH_LOCALES = { en: "en-CA", fr: "fr-CA" };

const NaturalBurial = () => {
  const t = useText();
  const { language } = useLanguage();
  // useText shows English for a language that is not verified, so the spoken
  // locale has to follow the dictionary t() actually read from.
  const spokenLanguage = isLanguageVerified(language) ? language : DEFAULT_LANGUAGE;
  // Read-aloud text comes from the same dictionary as the text on screen, so the
  // page never speaks English while showing French (SCRUM-49 review).
  const speech = {
    description: t("naturalBurial.descriptionText"),
    types: t("naturalBurial.types.speech"),
    markers: t("naturalBurial.markers.speech"),
    locations: t("naturalBurial.locations.speech"),
  };
  const [speakingText, setSpeakingText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ img: '', titleKey: '', descriptionKey: '' });
  
  // Modal content: images plus translation keys (text is looked up with t when shown)
  const burialTypesInfo = {
    img: coffinImage,
    titleKey: "naturalBurial.types.modalTitle",
    descriptionKey: "naturalBurial.types.modalText"
  };

  const burialMarkersInfo = {
    img: markerImage,
    titleKey: "naturalBurial.markers.title",
    descriptionKey: "naturalBurial.markers.modalText"
  };

  const burialLocationsInfo = {
    img: gpsImage,
    titleKey: "naturalBurial.locations.title",
    descriptionKey: "naturalBurial.locations.modalText"
  };

  const closeModal = () => setShowModal(false);
  const dialogRef = useDialogFocus(showModal, closeModal);

  const openModal = (info) => {
    setModalContent(info);
    setShowModal(true);
  };

  // Load voices when component mounts
  useEffect(() => {
    const loadVoices = () => {
      // This ensures voices are loaded
      window.speechSynthesis.getVoices();
    };
    
    loadVoices();
    // Some browsers need this event listener
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  /**
   * Handles text-to-speech functionality.
   * Toggles speech synthesis for the provided text.
   */
  const handleSpeakText = (text) => {
    if (speakingText === text) {
      // Pause if the same text is being spoken
      window.speechSynthesis.cancel(); // Stop any ongoing speech immediately
      setSpeakingText(""); // Reset the speaking text
      return;
    }

    // Stop current speech and start new text
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Get available voices
    const voices = window.speechSynthesis.getVoices();
    
    // Find a voice for the Selected Language, exact locale first
    const localeTag = SPEECH_LOCALES[spokenLanguage] ?? SPEECH_LOCALES.en;
    const standardVoice =
      voices.find((voice) => voice.lang === localeTag) ??
      voices.find((voice) => voice.lang?.startsWith(`${spokenLanguage}-`));

    if (standardVoice) {
      utterance.voice = standardVoice;
    }
    
    // Most natural settings for standard voice
    utterance.rate = 0.95;    // Normal speed
    utterance.pitch = 1.05;   // Normal pitch
    utterance.volume = 1.0;  // Normal volume
    utterance.lang = localeTag; // Matches the Selected Language
    
    // Add event listeners
    utterance.onend = () => {
      setSpeakingText("");
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setSpeakingText("");
    };

    window.speechSynthesis.speak(utterance);
    setSpeakingText(text); // Update speaking text
  };

  return (
    <div className="natural-burial">
      <img 
        src={burialImage} 
        alt={t("naturalBurial.headerAlt")}
        className="header-image" 
      />

      {/* Main Content */}
      <main className="main-content">
        <div className="container">
          <section className="description-section">
            <div className="description-header"> 
              <h2>{t("naturalBurial.descriptionHeading")}</h2>
              {/* Sound icon button */}
              <button
                onClick={() => handleSpeakText(speech.description)}
                className="sound-button"
                aria-label={t("naturalBurial.readDescriptionLabel")}
                title={t("naturalBurial.listenToDescription")}
              >
                {speakingText === speech.description ? (
                  <FaPause className="icon" />
                ) : (
                  <FaVolumeUp className="icon" />
                )}
              </button>
            </div>
            <p> 
              {t("naturalBurial.descriptionText")}
            </p>
          </section>

          <section className="info-sections">
            <div className="info-card">
              <button
                type="button"
                className={CARD_IMAGE_BUTTON}
                aria-label={t("naturalBurial.moreAbout", { title: t("naturalBurial.types.title") })}
                data-cy="card-image-button"
                onClick={() => openModal(burialTypesInfo)}
              >
                <img
                  src={coffinImage}
                  alt={t("naturalBurial.types.alt")}
                  className="card-image"
                />
              </button>
      
              <button 
                onClick={() => handleSpeakText(speech.types)}
                className="sound-button small"
              >
                {speakingText === speech.types ? (
                  <FaPause className="icon" />
                ) : (
                  <FaVolumeUp className="icon" />
                )}
              </button>
              <h3>{t("naturalBurial.types.title")}</h3>
              <p>{t("naturalBurial.types.summary")}</p>
              <button onClick={() => openModal(burialTypesInfo)}>{t("naturalBurial.learnMore")}</button>
            </div>
            
            <div className="info-card">
              <button
                type="button"
                className={CARD_IMAGE_BUTTON}
                aria-label={t("naturalBurial.moreAbout", { title: t("naturalBurial.markers.title") })}
                data-cy="card-image-button"
                onClick={() => openModal(burialMarkersInfo)}
              >
                <img
                  src={markerImage}
                  alt={t("naturalBurial.markers.alt")}
                  className="card-image"
                />
              </button>
              <button 
                onClick={() => handleSpeakText(speech.markers)}
                className="sound-button small"
              >
                {speakingText === speech.markers ? (
                  <FaPause className="icon" />
                ) : (
                  <FaVolumeUp className="icon" />
                )}
              </button>
              <h3>🌿 {t("naturalBurial.markers.title")}</h3>
              <p>{t("naturalBurial.markers.summary")}</p>
              
              <button onClick={() => openModal(burialMarkersInfo)}> {t("naturalBurial.learnMore")} </button>
            </div>
            
            <div className="info-card">
              <button
                type="button"
                className={CARD_IMAGE_BUTTON}
                aria-label={t("naturalBurial.moreAbout", { title: t("naturalBurial.locations.title") })}
                data-cy="card-image-button"
                onClick={() => openModal(burialLocationsInfo)}
              >
                <img
                  src={gpsImage}
                  alt={t("naturalBurial.locations.alt")}
                  className="card-image"
                />
              </button>
              <button 
                onClick={() => handleSpeakText(speech.locations)}
                className="sound-button small"
              >
                {speakingText === speech.locations ? (
                  <FaPause className="icon" />
                ) : (
                  <FaVolumeUp className="icon" />
                )}
              </button>
              <h3>📍 {t("naturalBurial.locations.title")}</h3>
              <p>{t("naturalBurial.locations.summary")}</p>
              <button onClick={() => openModal(burialLocationsInfo)}>{t("naturalBurial.learnMore")}</button>
            </div>
            
          </section>
        </div>
      </main>

      {/* Modal */}
  {showModal && (
    <div className="modal-overlay" onClick={closeModal}>
      <div
        className="modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="natural-burial-dialog-title"
        tabIndex={-1}
        ref={dialogRef}
        data-cy="burial-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        <img src={modalContent.img} alt={t(modalContent.titleKey)} className="modal-image" />
        <h2 id="natural-burial-dialog-title">{t(modalContent.titleKey)}</h2>
        <p style={{ whiteSpace: "pre-wrap" }}>
          {t(modalContent.descriptionKey)}
        </p>
        <button className="close-button" onClick={closeModal}>{t("naturalBurial.close")}</button>
      </div>
    </div>
  )}


      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>{t("naturalBurial.footer")}</p>
        </div>
      </footer>
    </div>
  );
};

export default NaturalBurial;
