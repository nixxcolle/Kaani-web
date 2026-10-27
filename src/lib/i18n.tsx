import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "fil";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, defaultText?: string) => string;
  isFilipino: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (key: string, defaultText?: string) => defaultText || key,
  isFilipino: false,
});

export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    // Nav
    "nav.home": "Home",
    "nav.market": "Kaani Market",
    "nav.learning": "Learning Hub",
    "nav.legal": "Legal Information",
    "nav.sustainability": "Sustainability",
    "nav.login": "Login",
    "nav.register": "Register",
    "nav.searchPlaceholder": "Search market or guides...",

    // Market General
    "market.title": "Kaani Market",
    "market.heroHeadline": "Fresh from our farms and waters.",
    "market.heroSub": "Discover local agricultural and fisheries products from farmers and fisherfolk. Supporting local livelihoods and sustainable food security.",
    "market.listHarvest": "List Your Harvest",
    "market.browseCatalog": "Browse Catalog",
    "market.supportLocal": "Support Local Farmers and Fisherfolk",
    "market.categories": "Categories",
    "market.location": "Location",
    "market.priceRange": "Price Range",
    "market.applyFilters": "Apply Filters",
    "market.resetFilters": "Reset",
    "market.searchPlaceholder": "Search for products (e.g. tilapia, tomatoes, rice...)",
    "market.searchBtn": "Search",
    "market.featuredProducts": "Featured Products",
    "market.all": "All",
    "market.farms": "Farms",
    "market.fisheries": "Fisheries",
    "market.sortBy": "Sort by",
    "market.contactSeller": "Contact Seller",
    "market.reportListing": "Report Listing",
    "market.reportSuccess": "Report Submitted Successfully",
    "market.reportSuccessDesc": "Thank you for helping keep Kaani Market safe. Our administrators will review this listing.",
    "market.statusAvailable": "Available",
    "market.statusOutOfStock": "Out of Stock",
    "market.statusUnavailable": "Unavailable",
    "market.rulesTitle": "Kaani Web Marketplace Rules",
    "market.rulesSubtitle": "Standards and community guidelines for transparent, honest, and sustainable trading.",
    "market.agreeRulesCheckbox": "I have read and agree to follow the Kaani Web Marketplace Rules.",
    "market.agreeRulesError": "Please read and agree to the Kaani Web Marketplace Rules to publish your listing.",

    // Educational / Learning Hub
    "learning.title": "Knowledge & Training Hub",
    "learning.subtitle": "Empowering coastal fisherfolk and smallholder farmers with science-backed sustainable practices.",
    "learning.translateButton": "Isalin sa Filipino",
    "learning.translateEnglish": "Switch to English",
    "learning.unit1Title": "Unit 1: Introduction to Fish Physiology",
    "learning.unit1Desc": "Fundamental concepts of fish anatomy, physiological adaptations, respiration, swimming locomotion, and aquatic biological systems.",
    "learning.objectivesTitle": "Learning Objectives",
    "learning.keyTakeaway": "Key Takeaway",
    "learning.quizPrompt": "Test your knowledge on this module with the interactive quiz!",
    "learning.takeQuiz": "Take Module Quiz",

    // Statuses
    "status.availableDesc": "The product is currently available for purchase or inquiry.",
    "status.outOfStockDesc": "The product has no remaining stock.",
    "status.unavailableDesc": "The product cannot currently be purchased or is temporarily unavailable.",
  },
  fil: {
    // Nav
    "nav.home": "Tahanan",
    "nav.market": "Pamilihan ng Kaani",
    "nav.learning": "Sentro ng Kaalaman",
    "nav.legal": "Impormasyong Legal",
    "nav.sustainability": "Pagpapanatili",
    "nav.login": "Mag-login",
    "nav.register": "Magpatala",
    "nav.searchPlaceholder": "Maghanap sa merkado o mga gabay...",

    // Market General
    "market.title": "Pamilihan ng Kaani",
    "market.heroHeadline": "Sariwa mula sa ating mga bukid at karagatan.",
    "market.heroSub": "Tuklasin ang mga lokal na produktong pang-agrikultura at pangisdaan mula sa ating mga magsasaka at mangingisda. Pagtataguyod sa kabuhayan at seguridad sa pagkain.",
    "market.listHarvest": "Ilista ang Iyong Ani o Huli",
    "market.browseCatalog": "Tingnan ang Katalogo",
    "market.supportLocal": "Suportahan ang mga Magsasaka at Mangingisda",
    "market.categories": "Mga Kategorya",
    "market.location": "Lokasyon",
    "market.priceRange": "Saklaw ng Presyo",
    "market.applyFilters": "Ilapat ang Filter",
    "market.resetFilters": "I-reset",
    "market.searchPlaceholder": "Maghanap ng produkto (hal. tilapia, kamatis, bigas...)",
    "market.searchBtn": "Hanapin",
    "market.featuredProducts": "Mga Tampok na Produkto",
    "market.all": "Lahat",
    "market.farms": "Sakahan",
    "market.fisheries": "Pangisdaan",
    "market.sortBy": "Isaayos ayon sa",
    "market.contactSeller": "Makipag-ugnayan sa Nagbebenta",
    "market.reportListing": "I-ulat ang Produkto",
    "market.reportSuccess": "Matagumpay na Naisumite ang Ulat",
    "market.reportSuccessDesc": "Salamat sa pagtulong na mapanatiling ligtas ang Pamilihan ng Kaani. Susuriin ng mga tagapangasiwa ang produktong ito.",
    "market.statusAvailable": "Mabibili (Available)",
    "market.statusOutOfStock": "Ubos Na (Out of Stock)",
    "market.statusUnavailable": "Hindi Magagamit (Unavailable)",
    "market.rulesTitle": "Mga Tuntunin sa Pamilihan ng Kaani Web",
    "market.rulesSubtitle": "Mga pamantayan at patakaran ng komunidad para sa tapat, malinis, at maayos na kalakalan.",
    "market.agreeRulesCheckbox": "Nabasa ko at sumasang-ayon ako sa Mga Tuntunin sa Pamilihan ng Kaani Web.",
    "market.agreeRulesError": "Mangyaring basahin at sang-ayunan ang mga tuntunin bago maglathala ng produkto.",

    // Educational / Learning Hub
    "learning.title": "Sentro ng Kaalaman at Pagsasanay",
    "learning.subtitle": "Pagpapalakas sa mga mangingisda at magsasaka gamit ang mga maka-agham at napapanatiling pamamaraan.",
    "learning.translateButton": "Isalin sa Filipino",
    "learning.translateEnglish": "Lumipat sa Ingles",
    "learning.unit1Title": "Yunit 1: Panimula sa Pisyolohiya ng Isda",
    "learning.unit1Desc": "Pangunahing konsepto ng anatomiya ng isda, mga pisyolohikal na pag-aangkop, paghinga, biomekanika ng paglangoy, at mga sistemang biyolohikal sa tubig.",
    "learning.objectivesTitle": "Mga Layunin sa Pagkatuto",
    "learning.keyTakeaway": "Pangunahing Aral",
    "learning.quizPrompt": "Subukan ang iyong natutunan sa modyul na ito gamit ang interactive na pagsusulit!",
    "learning.takeQuiz": "Kumuha ng Pagsusulit",

    // Statuses
    "status.availableDesc": "Kasalukuyang mabibili o maaaring ipagtanong ang produkto.",
    "status.outOfStockDesc": "Walang natitirang stock ang produkto sa ngayon.",
    "status.unavailableDesc": "Kasalukuyang hindi mabibili o pansamantalang hindi magagamit.",
  },
};

// Educational translation dictionary for modules & sustainability
export const FILIPINO_MODULE_DATA = {
  unit1: {
    title: "Yunit 1: PANIMULA SA PISYOLOHIYA NG ISDA",
    category: "Pangisdaan at Pandagat",
    description: "Pangunahing konsepto ng anatomiya ng isda, mga pisyolohikal na pag-aangkop, paghinga, biomekanika ng paglangoy, at mga sistemang biyolohikal sa tubig.",
    objectives: [
      "Tukuyin ang mga panlabas at panloob na anatomical system ng mga isda",
      "Unawain ang biomekanika ng BCF (body-caudal) at MPF (median-paired) na paglangoy",
      "Suriin ang mga pag-aangkop ng mga amphibious fish kabilang ang walking catfish ng Samar (Pantat)",
      "Pagaralan ang counter-current gill exchange, swim bladder buoyancy, at sirkulasyon ng puso"
    ],
    contentSections: [
      {
        heading: "1. Pangkalahatang-ideya ng Pisyolohiya ng Isda at mga Sistemang Anatomikal",
        body: "Sinasaklaw ng pisyolohiya ng isda ang mga biyolohikal na mekanismo na nagbibigay-daan sa mga organismo sa tubig upang mabuhay, huminga, mag-regulate ng presyon ng asin at tubig (osmotic balance), at mag-navigate sa sari-saring kapaligiran ng tabang at alat. Ang pag-unawa sa mga ito ay napakahalaga para sa napapanatiling pamamahala ng pangisdaan at palaisdaan (aquaculture).",
        keyTakeaway: "Ang kalusugan ng isda ay direktang nakaaapekto sa bilis ng paglaki, resistensya sa stress, at tagumpay sa pagpaparami."
      },
      {
        heading: "2. Pagkilos at Biomekanika ng Paglangoy",
        body: "Itinutulak ng isda ang sarili sa tubig gamit ang body-caudal fin (BCF) at median-paired fin (MPF) na mga paraan. Sa tubig, ang lapot (viscosity) at drag ang pangunahing puwersang kalaban, samantalang ang mga amphibious na isda na lumalabas sa lupa ay kailangang daigin ang gravity at friction sa pamamagitan ng axial, appendicular, o pinagsamang puwersa.",
        keyTakeaway: "Ang kahusayan sa paglangoy ang nagtatakda ng layo ng paghahanap ng pagkain, pag-iwas sa maninila, at pagkonsumo ng oxygen."
      },
      {
        heading: "3. Palitan ng Gas at Sirkulasyon ng Dugo",
        body: "Nagpapalitan ng oxygen at carbon dioxide ang isda gamit ang mga hasang (gill filaments) na pinoprotektahan ng operculum. Tinitiyak ng counter-current blood flow ang pinakamataas na pagsipsip ng oxygen mula sa tubig. Ang dugo ay dumadaloy sa apat na magkakasunod na bahagi ng puso (sinus venosus, atrium, ventricle, bulbus arteriosus).",
        keyTakeaway: "Ang counter-current capillary arrangement ay nagpapanatili ng gradient sa buong ibabaw ng lamellae ng hasang."
      }
    ]
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem("kaani_lang");
      return saved === "fil" ? "fil" : "en";
    } catch {
      return "en";
    }
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("kaani_lang", lang);
      window.dispatchEvent(new CustomEvent("language-change", { detail: lang }));
    } catch (e) {
      console.warn("Failed to persist language choice", e);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "fil" : "en");
  };

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "kaani_lang" && (e.newValue === "en" || e.newValue === "fil")) {
        setLanguageState(e.newValue);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const t = (key: string, defaultText?: string): string => {
    const table = TRANSLATIONS[language];
    if (table && table[key]) {
      return table[key];
    }
    // Fallback to English
    if (TRANSLATIONS.en[key]) {
      return TRANSLATIONS.en[key];
    }
    return defaultText || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        isFilipino: language === "fil",
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
