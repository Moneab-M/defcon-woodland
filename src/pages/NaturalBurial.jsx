/**@author Rakhuzuwo
 * @file NaturalBurial.jsx
 * @description React component presenting Natural Burial information, including
 * interactive modals, prerecorded section audio, and image-based learning cards.
 * Handles modal state, focus management, and structured content sections.
 */


import './NaturalBurial.css';
import burialImage from '../assets/use.png';
import coffinImage from '../assets/coffin.png';  
import markerImage from '../assets/Marker.png'; 
import gpsImage from '../assets/Gps.png';      
import React, { useState } from 'react';
import { useText } from '../i18n/useText.js';
import SectionAudioButton from '../Components/SectionAudioButton.jsx';
import { usePrerecordedAudio } from '../context/PrerecordedAudioContext.jsx';
import useDialogFocus from '../Components/useDialogFocus.js';

// Keeps the image button looking exactly like the bare image, with a visible focus ring
const CARD_IMAGE_BUTTON = "card-image-button block p-0 border-0 bg-transparent cursor-pointer";

const NaturalBurial = () => {
  const t = useText();
  const { playingId, stop } = usePrerecordedAudio();
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ img: '', titleKey: '', descriptionKey: '', audioSectionId: '' });
  
  // Modal content: images plus translation keys (text is looked up with t when shown)
  const burialTypesInfo = {
    img: coffinImage,
    titleKey: "naturalBurial.types.modalTitle",
    descriptionKey: "naturalBurial.types.modalText",
    audioSectionId: "modal_types"
  };

  const burialMarkersInfo = {
    img: markerImage,
    titleKey: "naturalBurial.markers.title",
    descriptionKey: "naturalBurial.markers.modalText",
    audioSectionId: "modal_markers"
  };

  const burialLocationsInfo = {
    img: gpsImage,
    titleKey: "naturalBurial.locations.title",
    descriptionKey: "naturalBurial.locations.modalText",
    audioSectionId: "modal_locations"
  };

  const closeModal = () => {
    // Closing a Learn More popup stops its recording, including on Escape.
    // Do not interrupt unrelated audio if the popup itself is not playing.
    if (playingId?.startsWith("naturalburial:modal_")) stop();
    setShowModal(false);
  };
  const dialogRef = useDialogFocus(showModal, closeModal);

  const openModal = (info) => {
    setModalContent(info);
    setShowModal(true);
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
              <SectionAudioButton
                audioId="naturalburial:description"
                pageId="naturalburial"
                sectionId="description"
                sectionTitle={t("naturalBurial.descriptionHeading")}
              />
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
      
              <SectionAudioButton
                audioId="naturalburial:types"
                pageId="naturalburial"
                sectionId="types"
                sectionTitle={t("naturalBurial.types.title")}
              />
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
              <SectionAudioButton
                audioId="naturalburial:markers"
                pageId="naturalburial"
                sectionId="markers"
                sectionTitle={t("naturalBurial.markers.title")}
              />
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
              <SectionAudioButton
                audioId="naturalburial:locations"
                pageId="naturalburial"
                sectionId="locations"
                sectionTitle={t("naturalBurial.locations.title")}
              />
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
        <div className="modal-audio-heading">
          <h2 id="natural-burial-dialog-title">{t(modalContent.titleKey)}</h2>
          <SectionAudioButton
            audioId={`naturalburial:${modalContent.audioSectionId}`}
            pageId="naturalburial"
            sectionId={modalContent.audioSectionId}
            sectionTitle={t(modalContent.titleKey)}
          />
        </div>
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
