import { getLang, setLang, subscribe } from "../state/store.js";
import { updateLanguageLinks } from "../i18n/index.js";

export function initHeader() {
  updateLanguageLinks();

  subscribe("lang", () => {
    updateLanguageLinks();
  });

  document.querySelectorAll(".language-option").forEach((link) => {
    link.addEventListener("click", () => {
      setLang(link.lang === "en" ? "en" : "pt");
    });
  });
}
