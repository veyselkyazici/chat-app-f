import tr from "./tr.js";
import en from "./en.js";

const languages = { tr, en };
let currentLang =
  localStorage.getItem("lang") ||
  (navigator.language.startsWith("tr") ? "tr" : "en");

export const i18n = {
  t: (keyPath) => {
    const parts = keyPath.split(".");
    let value = languages[currentLang];
    for (const part of parts) value = value?.[part];
    return value || keyPath;
  },
  setLang: (lang) => {
    if (languages[lang]) {
      currentLang = lang;
      localStorage.setItem("lang", lang);
      window.dispatchEvent(new Event("languagechange"));
    }
  },
  getLang: () => currentLang,
};
