let state = {
  lang: "pt",
};

const listeners = new Map();

export function getState() {
  return { ...state };
}

export function getLang() {
  return state.lang;
}

export function setLang(lang) {
  if (lang !== "pt" && lang !== "en") return;
  state.lang = lang;

  try {
    localStorage.setItem("siteLanguage", lang);
  } catch {}

  notify("lang", lang);
}

export function subscribe(event, fn) {
  if (!listeners.has(event)) {
    listeners.set(event, new Set());
  }
  listeners.get(event).add(fn);
  return () => listeners.get(event).delete(fn);
}

function notify(event, data) {
  const fns = listeners.get(event);
  if (fns) {
    fns.forEach((fn) => fn(data));
  }
}

(function init() {
  const params = new URLSearchParams(window.location.search);
  const urlLang = params.get("lang");

  let storedLang;
  try {
    storedLang = localStorage.getItem("siteLanguage");
  } catch {}

  state.lang = (urlLang === "en" || urlLang === "pt")
    ? urlLang
    : (storedLang === "en" ? "en" : "pt");
})();
