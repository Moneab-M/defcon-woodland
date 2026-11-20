/**@author Dejuan
 * @file Ecosystem.jsx
 * @description Component displaying ecosystem information through images, text,
 * and prerecorded section audio. Includes interactive flip-cards for flora and fauna with
 * accessibility-focused narration.
 */


import { useText } from "../i18n/useText";
import { IoPaw } from "react-icons/io5";
import { PiPlantFill } from "react-icons/pi";
import { TbMushroomFilled } from "react-icons/tb";
import { TbTrees } from "react-icons/tb";
import SectionAudioButton from "../Components/SectionAudioButton";
import deer from "../assets/deer.jpg";
import fern from "../assets/fern.png";
import lake from "../assets/lake.jpg";
import heron from "../assets/heron.jpg";
import coyote from "../assets/coyote.jpg";

/**
 * Ecosystem Component
 * @returns {JSX.Element} Component rendering the ecosystem information.
 */
const Ecosystem = () => {
  const t = useText();
  // Displayed text for the Selected Language; the same strings go to the read-aloud button.
  const ecosystemText = {
    intro: t("ecosystem.intro"),
    heron: t("ecosystem.heron"),
    deer: t("ecosystem.deer"),
    coyote: t("ecosystem.coyote"),
    floraText: t("ecosystem.floraText"),
    faunaText: t("ecosystem.faunaText"),
    fungiText: t("ecosystem.fungiText"),
  };
  return (
    <div className="min-h-screen">
      {/* Ecosystem Section */}
      <main className="container mx-auto px-4 py-8">
        <section className="mb-12 sm:pl-20">
          {/* Ecosystem heading and prerecorded introduction audio */}
          <div className="flex items-center mb-4 pt-20">
            <TbTrees className="text-green-700 dark:text-green-300 text-8xl mr-3" />
            <h2 className="text-7xl font-semibold text-blue-500 pl-2 pr-2">
              {t("ecosystem.heading")}
            </h2>
            <SectionAudioButton
              audioId="ecosystem:intro"
              pageId="ecosystem"
              sectionId="intro"
              sectionTitle={t("ecosystem.heading")}
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {/* Ecosystem Decscriptive Text and Lake Image */}
            <div className="flex flex-col justify-center items-center">
              <p className="text-1g sm:text-2xl leading-relaxed pt-5 pb-10 w-full sm:w-[650px]">{ecosystemText.intro}</p>
              <div className="flex gap-4">
                <div className="flex flex-col gap-4">
                  <div className="flex relative pt-10 px-auto justify-center items-center">
                    <img
                      src={lake}
                      alt={t("ecosystem.lakeAlt")}
                      className="sm:pr-0 h-auto rounded shadow-md"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Flipping animal cards with independent audio controls */}
            <div className="flex gap-4 justify-center sm:pl-20">
              <div className="flex flex-col gap-4">
                <div className="relative w-64 h-64 group [transform-style:preserve-3d] perspective">
                  <div className="absolute top-2 right-2 z-20 rounded-full bg-white/90 dark:bg-gray-900/90">
                    <SectionAudioButton
                      audioId="ecosystem:heron"
                      pageId="ecosystem"
                      sectionId="heron"
                      sectionTitle={t("ecosystem.heron")}
                    />
                  </div>
                  <div className="absolute inset-0 transform transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">



                    {/* Heron Image */}

                    <div
                      className="absolute inset-0 rounded-full shadow-md bg-cover bg-center [backface-visibility:hidden]"
                      style={{ backgroundImage: `url(${heron})` }}
                    >
                      {/* <img src={imageURLs?.find((img) => img?.title === 'heron')?.url || ''} /> */}

                    </div>

                    {/* Text on back side of image */}
                    <div className="absolute inset-0 flex items-center justify-center bg-light-background text-black dark:bg-gray-800 dark:text-dark-text text-center rounded-full [backface-visibility:hidden] [transform:rotateY(180deg)]">
                      <p className="px-10">{ecosystemText.heron}</p>
                    </div>
                  </div>
                </div>
                <div className="relative w-64 h-64 group ml-[190px] sm:ml-64 [transform-style:preserve-3d] perspective">
                  <div className="absolute top-2 right-2 z-20 rounded-full bg-white/90 dark:bg-gray-900/90">
                    <SectionAudioButton
                      audioId="ecosystem:deer"
                      pageId="ecosystem"
                      sectionId="deer"
                      sectionTitle={t("ecosystem.deer")}
                    />
                  </div>
                  <div className="absolute inset-0 transform transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                    {/* Deer Image */}
                    <div
                      className="absolute inset-0 rounded-full shadow-md bg-cover bg-center [backface-visibility:hidden]"
                      style={{ backgroundImage: `url(${deer})` }}
                    ></div>




                    {/* Text on back side of image */}
                    <div className="absolute inset-0 flex items-center justify-center bg-light-background text-black dark:bg-gray-800 dark:text-dark-text text-center rounded-full [backface-visibility:hidden] [transform:rotateY(180deg)]">
                      <p className="px-10">{ecosystemText.deer}</p>
                    </div>
                  </div>
                </div>
                <div className="relative w-64 h-64 group [transform-style:preserve-3d] perspective">
                  <div className="absolute top-2 right-2 z-20 rounded-full bg-white/90 dark:bg-gray-900/90">
                    <SectionAudioButton
                      audioId="ecosystem:coyote"
                      pageId="ecosystem"
                      sectionId="coyote"
                      sectionTitle={t("ecosystem.coyote")}
                    />
                  </div>
                  <div className="absolute inset-0 transform transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                    {/* Coyote Image */}
                    <div
                      className="absolute inset-0 rounded-full shadow-md bg-cover bg-center [backface-visibility:hidden]"
                      style={{ backgroundImage: `url(${coyote})` }}
                    ></div>


                    {/* Text on back side of image */}
                    <div className="absolute inset-0 flex items-center justify-center bg-light-background text-black dark:bg-gray-800 dark:text-dark-text text-center rounded-full [backface-visibility:hidden] [transform:rotateY(180deg)]">
                      <p className="px-10 text-sm">{ecosystemText.coyote}</p>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Fern Background Image */}
      <section
        className="relative bg-cover bg-center bg-no-repeat bg-opacity-50 py-8 shadow-md"
        style={{ backgroundImage: `url(${fern})` }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gray-600 bg-opacity-60"></div>
        <div className="relative z-10 p-8">
          {/* Key Features introduction */}
          <div className="flex items-start">
            <p className="light-disc leading-relaxed text-xl text-white pl-20 pb-10">
              {t("ecosystem.keyFeatures.intro")}
            </p>



          </div>
          {/* Key Features Dotted List */}
          <ul className="list-disc list-inside text-lg text-white sm:px-40">
            <li className="pb-5">
              <b className="text-xl">{t("ecosystem.keyFeatures.birch.title")}</b>{" "}
              {t("ecosystem.keyFeatures.birch.text")}
              <div className="inline-block align-middle ml-2">
                <SectionAudioButton
                  audioId="ecosystem:birch"
                  pageId="ecosystem"
                  sectionId="birch"
                  sectionTitle={t("ecosystem.keyFeatures.birch.title")}
                />
              </div>
            </li>
            <li>
              <b className="text-xl">{t("ecosystem.keyFeatures.wetlands.title")}</b>{" "}
              {t("ecosystem.keyFeatures.wetlands.text")}
              <div className="inline-block align-middle ml-2">
                <SectionAudioButton
                  audioId="ecosystem:wetlands"
                  pageId="ecosystem"
                  sectionId="wetlands"
                  sectionTitle={t("ecosystem.keyFeatures.wetlands.title")}
                />
              </div>
            </li>
            <li className="pt-5">
              <b className="text-xl">{t("ecosystem.keyFeatures.artifacts.title")}</b>{" "}
              {t("ecosystem.keyFeatures.artifacts.text")}
              <div className="inline-block align-middle ml-2">
                <SectionAudioButton
                  audioId="ecosystem:artifacts"
                  pageId="ecosystem"
                  sectionId="artifacts"
                  sectionTitle={t("ecosystem.keyFeatures.artifacts.title")}
                />
              </div>
            </li>
          </ul>
        </div>
      </section>

      {/* Padding between list section and Flora/Fauna/Fungi section */}
      <div className="py-8"></div>

      {/* Flora, Fauna, and Fungi Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
          <div className="bg-light-background text-light-text dark:bg-gray-800 dark:text-dark-text p-4 rounded-lg shadow-lg hover:scale-105 transition-all duration-300">
            {/* Flora Section */}
            <div className="pt-6 pb-6">
              <div className="flex flex-col items-center mb-4">
                <PiPlantFill className="text-green-700 text-6xl mb-2" />
                <div className="flex items-center">
                  {/* Flora Heading */}
                  <h3 className="text-3xl font-semibold pl-10 pr-2 text-blue-500">
                    {t("ecosystem.floraHeading")}
                  </h3>

                  <SectionAudioButton
                    audioId="ecosystem:flora"
                    pageId="ecosystem"
                    sectionId="flora"
                    sectionTitle={t("ecosystem.floraHeading")}
                  />
                </div>
              </div>
              {/* Flora Descriptive Text */}
              <p className="text-lg leading-relaxed text-center mx-20">{ecosystemText.floraText}</p>
            </div>
          </div>

          <div className="bg-light-background text-light-text dark:bg-gray-800 dark:text-dark-text p-4 rounded-lg shadow-lg hover:scale-105 transition-all duration-300">
            {/* Fauna Section */}
            <div className="pt-6 pb-6">
              <div className="flex flex-col items-center mb-4">
                <IoPaw className="text-orange-700 text-6xl mb-2" />
                <div className="flex items-center">
                  {/* Fauna Heading */}
                  <h3 className="text-3xl font-semibold pl-10 pr-2 text-blue-500">
                    {t("ecosystem.faunaHeading")}
                  </h3>

                  <SectionAudioButton
                    audioId="ecosystem:fauna"
                    pageId="ecosystem"
                    sectionId="fauna"
                    sectionTitle={t("ecosystem.faunaHeading")}
                  />
                </div>
              </div>
              {/* Fauna Descriptive Text */}
              <p className="text-lg leading-relaxed text-center mx-20">{ecosystemText.faunaText}</p>
            </div>
          </div>

          <div className="bg-light-background text-light-text dark:bg-gray-800 dark:text-dark-text p-4 rounded-lg shadow-lg hover:scale-105 transition-all duration-300">
            {/* Fungi Section */}
            <div className="pt-6 pb-6">
              <div className="flex flex-col items-center mb-4">
                <TbMushroomFilled className="text-purple-700 text-6xl mb-2" />
                <div className="flex items-center">
                  {/* Fungi Heading */}
                  <h3 className="text-3xl font-semibold pl-10 pr-2 text-blue-500">
                    {t("ecosystem.fungiHeading")}
                  </h3>

                  <SectionAudioButton
                    audioId="ecosystem:fungi"
                    pageId="ecosystem"
                    sectionId="fungi"
                    sectionTitle={t("ecosystem.fungiHeading")}
                  />
                </div>
              </div>
              {/* Fauna Descriptive Text */}
              <p className="text-lg leading-relaxed text-center mx-20">{ecosystemText.fungiText}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ecosystem;
