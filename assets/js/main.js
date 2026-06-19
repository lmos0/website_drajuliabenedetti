const params = new URLSearchParams(window.location.search);
const requestedLang = params.get("lang");
const readStoredLang = () => {
  try {
    return localStorage.getItem("siteLanguage");
  } catch (error) {
    return null;
  }
};
const writeStoredLang = (language) => {
  try {
    localStorage.setItem("siteLanguage", language);
  } catch (error) {
    // The URL parameter still carries the selected language when storage is unavailable.
  }
};
const currentLang =
  requestedLang === "en" || requestedLang === "pt"
    ? requestedLang
    : readStoredLang() === "en"
      ? "en"
      : "pt";

const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");

const pageName = (() => {
  const file = window.location.pathname.split("/").pop() || "index.html";
  return file === "" ? "index.html" : file;
})();

const withEnglish = (href) => {
  const [path, hash = ""] = href.split("#");
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}lang=en${hash ? `#${hash}` : ""}`;
};

const setText = (selector, text) => {
  const element = document.querySelector(selector);
  if (element) element.textContent = text;
};

const setHtml = (selector, html) => {
  const element = document.querySelector(selector);
  if (element) element.innerHTML = html;
};

const setAttr = (selector, attr, value) => {
  document.querySelectorAll(selector).forEach((element) => {
    element.setAttribute(attr, value);
  });
};

const API_BASE = "http://localhost:8082";

async function api(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const token = localStorage.getItem("adminToken");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    localStorage.removeItem("adminToken");
    window.location.href = "login.html";
    return;
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Erro inesperado" }));
    throw new Error(error.error || `Erro ${response.status}`);
  }

  if (response.status === 204) return null;
  return response.json();
}

const commonEnglish = () => {
  document.documentElement.lang = "en";

  setAttr(".brand", "aria-label", "Home page");
  setAttr(".language-switch", "aria-label", "Language selection");

  document.querySelectorAll(".nav a, .mobile-menu > a").forEach((link) => {
    const text = link.textContent.trim();
    const labels = {
      Sobre: "About",
      Tratamentos: "Treatments",
      Tecnologia: "Technology",
      Contato: "Contact",
      "Agendar Consulta": "Book an Appointment",
    };

    if (labels[text]) link.textContent = labels[text];

    const href = link.getAttribute("href");
    if (href && !href.startsWith("http") && !href.startsWith("mailto:") && !href.startsWith("#")) {
      link.setAttribute("href", withEnglish(href));
    }
  });

  setText(".header-cta", "Book an Appointment");
  setAttr(".header-cta", "href", "agendar.html?lang=en");

  document.querySelectorAll(".mobile-menu > a").forEach((link) => {
    if (link.textContent.trim() === "Book an Appointment") {
      link.setAttribute("href", "agendar.html?lang=en");
    }
  });

  setText(".footer-copy", "Dermatology focused on skin health, prevention, treatment, and individualized follow-up.");
  document.querySelectorAll(".footer .muted").forEach((element) => {
    if (element.textContent.includes("direitos reservados")) {
      element.textContent = "© 2026 Dra. Júlia Benedetti Dermatology. All rights reserved.";
    }
  });
};

const pageTranslations = {
  "index.html": () => {
    document.title = "Dra. Julia Benedetti | Dermatology and Skin Care";
    setAttr("meta[name='description']", "content", "Dermatology focused on skin health, prevention, diagnosis, treatment, and individualized follow-up.");

    setHtml(".hero-title", "Dra. Julia<br />Benedetti:<em>Dermatology with listening and care</em>");
    setText(".hero-copy .section-copy", "Dermatologic care focused on skin health, prevention, diagnosis, and treatment with clear guidance at every step.");
    setText(".hero-actions .button", "Book an Appointment");
    setAttr(".hero-actions .button", "href", "https://api.whatsapp.com/send/?phone=5519981096007&text=Hello%2C+I+would+like+to+book+an+appointment.&type=phone_number&app_absent=0");
    setAttr(".image-frame img", "alt", "Editorial portrait of Dra. Julia Benedetti.");

    setText(".specialist-grid .eyebrow", "The doctor");
    setText(".specialist-grid .section-title", "Dermatologic care with attention to the whole person");
    const specialistParagraphs = document.querySelectorAll(".specialist-grid p.body-large");
    if (specialistParagraphs[0]) {
      specialistParagraphs[0].textContent =
        "Each patient arrives with a story, a routine, and skin that is constantly changing. The consultation begins with listening and continues with clinical evaluation, preventive guidance, and individualized conduct.";
    }
    if (specialistParagraphs[1]) {
      specialistParagraphs[1].textContent =
        "The goal is to care for symptoms, concerns, and dermatologic conditions with safety, follow-up, and shared decisions.";
    }
    setAttr(".small-image img", "alt", "Dra. Julia Benedetti smiling in the office.");

    setText(".section:nth-of-type(3) .eyebrow", "Care");
    setText(".section:nth-of-type(3) .section-title", "Main areas of care");
    setText(".cards .card:nth-child(1) .card-title", "Face");
    setText(".cards .card:nth-child(1) .muted", "Evaluation of acne, dark spots, rosacea, moles, allergies, inflammatory diseases, and other skin changes.");
    setText(".cards .card:nth-child(2) .card-title", "Body");
    setText(".cards .card:nth-child(2) .muted", "Investigation and treatment of lesions, itching, infections, hair loss, nail changes, and recurring concerns.");
    setText(".cards .card:nth-child(3) .card-title", "Hair");
    setText(".cards .card:nth-child(3) .muted", "Follow-up for hair loss, thinning, sensitive scalp, and other conditions that affect hair health.");
    document.querySelectorAll(".card-link").forEach((link) => {
      if (link.textContent.includes("Explorar")) {
        link.textContent = "Explore →";
        link.setAttribute("href", withEnglish("tratamento.html"));
      }
    });

    setAttr(".feature-image img", "alt", "Dra. Julia Benedetti in a welcoming clinic setting.");
    setText(".overlay-card .eyebrow", "The environment");
    setText(".overlay-card .card-title", "A space to be heard calmly");
    setText(".overlay-card .muted", "The clinic was designed to welcome consultations with privacy, calm, and quality time to understand each concern.");

    setText(".section-alt:nth-of-type(5) .eyebrow", "Practice");
    setText(".section-alt:nth-of-type(5) .section-title", "Dermatologic care across different needs");
    setText(".section-alt:nth-of-type(5) .card:nth-child(1) .card-title", "Skin routine and procedures");
    setText(".section-alt:nth-of-type(5) .card:nth-child(1) .muted", "Guidance on skin routine, skin aging, dark spots, and procedures when medically indicated.");
    setText(".section-alt:nth-of-type(5) .card:nth-child(2) .card-title", "Clinical Dermatology");
    setText(".section-alt:nth-of-type(5) .card:nth-child(2) .muted", "Diagnosis and treatment of acne, dermatitis, psoriasis, rosacea, infections, allergies, and other skin diseases.");
    setText(".section-alt:nth-of-type(5) .card:nth-child(3) .card-title", "Skin cancer prevention");
    setText(".section-alt:nth-of-type(5) .card:nth-child(3) .muted", "Evaluation of moles and suspicious lesions, focused on prevention, early detection, and periodic follow-up.");
  },

  "sobre.html": () => {
    document.title = "About | Dra. Julia Benedetti";
    setAttr("meta[name='description']", "content", "Learn about Dra. Julia Benedetti's background, training, and dermatologic care approach.");

    setAttr(".about-image img", "alt", "Dra. Julia Benedetti seated in her office.");
    setText(".about-copy .section-title", "Caring for the skin is caring for health");
    setText(".about-copy p:nth-of-type(2)", "Skin reflects habits, environment, genetics, life stages, and health. That is why dermatologic care must go beyond the immediate complaint and consider the person as a whole.");
    setText(".about-copy p:nth-of-type(3)", "My practice is based on listening, clinical examination, diagnostic reasoning, and clear guidance. Technology and procedures are used as resources when they make sense for the patient's health and safety.");
    setText(".about-copy p:nth-of-type(4)", "My purpose is to follow each patient responsibly, whether in prevention, treatment of skin diseases, hair care, or the creation of a practical and effective routine.");

    setText(".section-alt .eyebrow", "Education");
    setText(".section-alt .section-title", "Academic Background");
    setText(".timeline-item:nth-child(1) h3", "Medical Degree");
    setText(".timeline-item:nth-child(1) .muted", "Medical training with a solid technical foundation and an integrated view of patient care.");
    setText(".timeline-item:nth-child(2) h3", "Specialization in Family Medicine");
    setText(".timeline-item:nth-child(2) .muted", "Clinical development focused on continued care, listening, and patient-centered attention.");
    setText(".timeline-item:nth-child(3) h3", "Postgraduate Specialization in Dermatology");
    setText(".timeline-item:nth-child(3) .muted", "In-depth technical training focused on diagnostic precision, clinical safety, and dermatologic treatments.");
    setText(".timeline-item:nth-child(4) h3", "Postgraduate Specialization in Aesthetic Dermatology");
    setText(".timeline-item:nth-child(4) .muted", "Development in cosmiatry, procedures, and technologies focused on appropriate indication, safety, and natural-looking results.");

    setText(".section > .container:nth-child(1) .eyebrow", "Clinical Experience");
    setText(".section > .container:nth-child(1) .section-title", "Professional Experience");
    setText(".experience-item:nth-child(1) h3", "Dermatology Consultations");
    setText(".experience-item:nth-child(1) .muted", "Clinical dermatology practice with continuous care and follow-up for different patient profiles.");
    setText(".experience-item:nth-child(2) h3", "Dermatology Consultations");
    setText(".experience-item:nth-child(2) .muted", "Experience in an urban care setting, combining diagnostic precision and individualized treatment plans.");
    setText(".experience-item:nth-child(3) h3", "Internship in the Department of Dermatology");
    setText(".experience-item:nth-child(3) li:nth-child(1)", "Psoriasis and Inflammatory Diseases Clinic");
    setText(".experience-item:nth-child(3) li:nth-child(2)", "Adolescent Dermatology");
    setText(".experience-item:nth-child(3) li:nth-child(3)", "Women's Dermatology");
    setText(".experience-item:nth-child(3) li:nth-child(4)", "Basic Dermatologic Procedures");
    setText(".experience-item:nth-child(4) h3", "Guest Professor");
    setText(".experience-item:nth-child(4) .muted", "Participation in teaching and academic exchange focused on dermatology training and updates.");
    setText(".experience-item:nth-child(5) h3", "Dermatology Consultations");
    setText(".experience-item:nth-child(5) .muted", "Dermatology practice in public care, expanding access to specialized care and clinical follow-up.");

    setText(".section > .two-col .eyebrow", "Philosophy");
    setText(".section > .two-col .section-title", "Listening, diagnosis, and follow-up.");
    setText(".section > .two-col .about-copy p:nth-of-type(2)", "Every consultation begins with listening. Understanding symptoms, history, routine, previous treatments, and expectations is the first step toward coherent and safe care.");
    setText(".section > .two-col .about-copy p:nth-of-type(3)", "This is not about ready-made formulas. The care plan should make sense for the clinical condition, the life stage, and each patient's reality.");
    setAttr(".panel-image img", "alt", "Portrait of Dra. Julia Benedetti against a light background.");
    setText(".footer-copy", "Dermatology focused on health, prevention, treatment, and responsible follow-up.");
  },

  "tratamento.html": () => {
    document.title = "Treatments | Dra. Julia Benedetti";
    setAttr("meta[name='description']", "content", "Dermatologic care for skin, hair, and nails, focused on diagnosis, prevention, treatment, and follow-up.");

    setText(".treatment-hero .section-title", "Dermatologic treatments");
    setText(".treatment-hero p", "A clinical approach to caring for the skin, hair, and nails with diagnosis, preventive guidance, and individualized treatment.");
    setAttr(".about-image img", "alt", "Dra. Julia Benedetti during a consultation in the office.");

    setText(".section .section-title", "Areas of care");
    setText(".section .eyebrow", "Skin · Hair · Nails");
    setText(".treatment-card:nth-child(1) .card-title", "Skin");
    setText(".treatment-card:nth-child(1) li:nth-child(1) strong", "Acne, rosacea, and dermatitis");
    setText(".treatment-card:nth-child(1) li:nth-child(1) .muted", "Diagnosis, flare-up control, and prevention of recurrence.");
    setText(".treatment-card:nth-child(1) li:nth-child(2) strong", "Dark spots and melasma");
    setText(".treatment-card:nth-child(1) li:nth-child(2) .muted", "Gradual treatment with photoprotection and maintenance guidance.");
    setText(".treatment-card:nth-child(1) li:nth-child(3) strong", "Moles and suspicious lesions");
    setText(".treatment-card:nth-child(1) li:nth-child(3) .muted", "Clinical evaluation, prevention, and periodic follow-up.");
    setText(".treatment-card:nth-child(2) .card-title", "Body");
    setText(".treatment-card:nth-child(2) li:nth-child(1) strong", "Allergies, itching, and irritations");
    setText(".treatment-card:nth-child(2) li:nth-child(1) .muted", "Investigation of the cause and treatment guided by clinical history.");
    setText(".treatment-card:nth-child(2) li:nth-child(2) strong", "Psoriasis and inflammatory diseases");
    setText(".treatment-card:nth-child(2) li:nth-child(2) .muted", "Continuous follow-up for control, comfort, and quality of life.");
    setText(".treatment-card:nth-child(3) .card-title", "Hair");
    setText(".treatment-card:nth-child(3) li:nth-child(1) strong", "Hair loss");
    setText(".treatment-card:nth-child(3) li:nth-child(1) .muted", "Investigation of causes and treatment definition according to the diagnosis.");
    setText(".treatment-card:nth-child(3) li:nth-child(2) strong", "Scalp and hair strands");
    setText(".treatment-card:nth-child(3) li:nth-child(2) .muted", "Care for flaking, oiliness, sensitivity, and hair thinning.");

    setAttr(".panel-image-tech img", "alt", "Close-up of dermatologic equipment used by Dra. Julia Benedetti.");
    setText(".tech-panel .eyebrow", "Technology used");
    setText(".tech-panel .section-title", "Resources in service of care.");
    setText(".tech-panel p:nth-of-type(2)", "Dermatologic technology is used to support evaluation and treatment, always with medical indication, safety criteria, and clear explanation of benefits, limits, and care.");
    setText(".tech-panel .card-link", "Ask your questions →");
    setAttr(".tech-panel .card-link", "href", withEnglish("contato.html"));
    setText(".footer-copy", "Dermatologic treatments focused on health, safety, and individualized follow-up.");
  },

  "contato.html": () => {
    document.title = "Contact | Dra. Julia Benedetti";
    setAttr("meta[name='description']", "content", "Contact Dra. Julia Benedetti for appointments, questions, and care information.");

    setText(".contact-copy .eyebrow", "Contact");
    setText(".contact-copy .section-title", "Feel free to get in touch.");
    setText(".contact-copy p:nth-of-type(2)", "Our team is available to schedule your appointment, provide care information, and answer your questions attentively.");
    setText(".detail:nth-child(1) h3", "Clinic");
    setText(".detail:nth-child(2) h3", "Email");
    setText(".social-actions .button", "WhatsApp");
    setAttr(".social-actions .button", "href", "https://api.whatsapp.com/send/?phone=5519981096007&text=Hello%2C+I+would+like+more+information.&type=phone_number&app_absent=0");

    setText("label[for='name']", "Full Name");
    setAttr("#name", "placeholder", "How would you like to be called?");
    setText("label[for='email']", "Email");
    setText("label[for='phone']", "Phone");
    setAttr("#phone", "placeholder", "+55 11 99999-9999");
    setText("label[for='subject']", "Subject");
    setAttr("#subject", "placeholder", "What would you like to talk about?");
    setText("label[for='message']", "Message");
    setAttr("#message", "placeholder", "How can we help?");
    setText(".form-card button", "Send Message");
  },

  "agendar.html": () => {
    document.title = "Book an Appointment | Dra. Julia Benedetti";
    setAttr("meta[name='description']", "content", "Book your appointment with Dra. Julia Benedetti quickly and easily.");

    setText(".contact-copy .eyebrow", "Booking");
    setText(".contact-copy .section-title", "Choose the best date for your appointment.");
    setText(".contact-copy p:nth-of-type(2)", "Select an available day and time, and fill in your information. We will contact you to confirm your appointment.");

    setText(".booking-form-card h2", "Appointment details");
    setText(".booking-form-card > p", "Fill in your information to reserve the time slot.");

    const selectedDateEl = document.getElementById("booking-selected-date");
    if (selectedDateEl && selectedDateEl.textContent.includes("Selecione uma data")) {
      selectedDateEl.textContent = "Select a date on the calendar.";
    }

    const emptyStateEl = document.querySelector(".booking-empty-state");
    if (emptyStateEl && emptyStateEl.textContent.includes("Selecione uma data")) {
      emptyStateEl.textContent = "Select a date to see available times.";
    }

    setText("label[for='booking-name']", "Full Name");
    setAttr("#booking-name", "placeholder", "How would you like to be called?");
    setText("label[for='booking-email']", "Email");
    setText("label[for='booking-phone']", "Phone");
    setAttr("#booking-phone", "placeholder", "+55 11 99999-9999");
    setText("label[for='booking-notes']", "Notes (optional)");
    setAttr("#booking-notes", "placeholder", "Any important information?");
    setText("#booking-submit", "Confirm Appointment");

    const formStatusEl = document.getElementById("booking-form-status");
    if (formStatusEl && formStatusEl.textContent.includes("Selecione um horário")) {
      formStatusEl.textContent = "Select a time slot.";
    }
  },
};

const updateLanguageLinks = () => {
  const hash = window.location.hash;
  const portugueseHref = `${pageName}?lang=pt${hash}`;
  const englishHref = `${pageName}?lang=en${hash}`;

  document.querySelectorAll(".language-option[lang='pt-BR']").forEach((link) => {
    link.setAttribute("href", portugueseHref);
    link.classList.toggle("active", currentLang === "pt");
    link.toggleAttribute("aria-current", currentLang === "pt");
  });

  document.querySelectorAll(".language-option[lang='en']").forEach((link) => {
    link.setAttribute("href", englishHref);
    link.classList.toggle("active", currentLang === "en");
    link.toggleAttribute("aria-current", currentLang === "en");
  });
};

updateLanguageLinks();
writeStoredLang(currentLang);

document.querySelectorAll(".language-option").forEach((link) => {
  link.addEventListener("click", () => {
    writeStoredLang(link.lang === "en" ? "en" : "pt");
  });
});

if (currentLang === "en") {
  commonEnglish();
  const translatePage = pageTranslations[pageName] || pageTranslations["index.html"];
  translatePage();
  updateLanguageLinks();
}

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const adminLoginForm = document.getElementById("adminLoginForm");
const adminLoginStatus = document.getElementById("admin-login-status");

if (adminLoginForm) {
  adminLoginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = adminLoginForm.querySelector("#admin-email")?.value.trim() || "";
    const password = adminLoginForm.querySelector("#admin-password")?.value || "";

    if (!email || !password) {
      if (adminLoginStatus) {
        adminLoginStatus.textContent =
          currentLang === "en" ? "Please fill in all fields." : "Preencha todos os campos.";
      }
      return;
    }

    if (adminLoginStatus) {
      adminLoginStatus.textContent =
        currentLang === "en" ? "Authenticating..." : "Autenticando...";
    }

    const endpoint = adminLoginForm.dataset.endpoint;

    try {
      if (endpoint) {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          throw new Error("Falha na autenticação.");
        }

        const data = await response.json();

        if (data.token) {
          localStorage.setItem("adminToken", data.token);
        }

        if (adminLoginStatus) {
          adminLoginStatus.textContent =
            currentLang === "en" ? "Redirecting..." : "Redirecionando...";
        }

        window.location.href = adminLoginForm.dataset.redirect || "dashboard.html";
      } else {
        await new Promise((resolve) => setTimeout(resolve, 600));

        if (adminLoginStatus) {
          adminLoginStatus.textContent =
            currentLang === "en" ? "Redirecting..." : "Redirecionando...";
        }

        window.location.href = adminLoginForm.dataset.redirect || "agenda.html";
      }
    } catch (error) {
      if (adminLoginStatus) {
        adminLoginStatus.textContent =
          currentLang === "en"
            ? "Invalid email or password."
            : "E-mail ou senha inválidos.";
      }
    }
  });
}

// Admin Agenda
const adminCalendarGrid = document.getElementById("admin-calendar-grid");

if (adminCalendarGrid) {
  const monthYearEl = document.getElementById("calendar-month-year");
  const selectedDateTitleEl = document.getElementById("selected-date-title");
  const selectedDateWeekdayEl = document.getElementById("selected-date-weekday");
  const dayToggleEl = document.getElementById("day-toggle");
  const dayToggleLabelEl = document.getElementById("day-toggle-label");
  const addSlotFormEl = document.getElementById("add-slot-form");
  const slotsContainerEl = document.getElementById("admin-slots");
  const copyNextDayBtn = document.getElementById("copy-next-day");
  const prevMonthBtn = document.getElementById("prev-month");
  const nextMonthBtn = document.getElementById("next-month");
  const deleteSlotModal = document.getElementById("delete-slot-modal");
  const deleteSlotCancel = document.getElementById("delete-slot-cancel");
  const deleteSlotConfirm = document.getElementById("delete-slot-confirm");

  const WEEKDAYS = [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
  ];
  const MONTHS = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  let viewDate = new Date();
  let selectedDate = new Date();
  let availabilityByDate = {};
  let isLoading = false;
  let pendingDeleteSlotId = null;
  let pendingDeleteDateKey = null;

  function openDeleteModal(slotId, dateKey) {
    pendingDeleteSlotId = slotId;
    pendingDeleteDateKey = dateKey;
    if (deleteSlotModal) {
      deleteSlotModal.classList.add("open");
      deleteSlotModal.setAttribute("aria-hidden", "false");
      deleteSlotConfirm?.focus();
    }
  }

  function closeDeleteModal() {
    pendingDeleteSlotId = null;
    pendingDeleteDateKey = null;
    if (deleteSlotModal) {
      deleteSlotModal.classList.remove("open");
      deleteSlotModal.setAttribute("aria-hidden", "true");
    }
  }

  function formatDateKey(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  function isSameDay(a, b) {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }

  function getDayData(key) {
    return availabilityByDate[key] || { is_available: true, slots: [] };
  }

  async function loadMonthAvailability() {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth() + 1;

    try {
      isLoading = true;
      const days = await api(`/api/admin/availability?year=${year}&month=${month}`);
      availabilityByDate = {};
      days.forEach((day) => {
        availabilityByDate[day.date] = {
          ...day,
          slots: day.slots || [],
        };
      });
    } catch (error) {
      console.error("Erro ao carregar disponibilidade:", error);
      alert(currentLang === "en" ? "Could not load availability." : "Não foi possível carregar a disponibilidade.");
    } finally {
      isLoading = false;
      renderCalendar();
      await loadDayDetail(formatDateKey(selectedDate));
    }
  }

  async function loadDayDetail(dateKey) {
    try {
      const day = await api(`/api/admin/availability/${dateKey}`);
      availabilityByDate[dateKey] = {
        ...day,
        slots: day.slots || [],
      };
      renderSlots();
    } catch (error) {
      const isNotFound = error.message && (
        error.message.toLowerCase().includes("not found") ||
        error.message.toLowerCase().includes("não encontrado")
      );

      if (isNotFound) {
        availabilityByDate[dateKey] = {
          ...(availabilityByDate[dateKey] || {}),
          date: dateKey,
          is_available: true,
          slots: [],
        };
        renderSlots();
        return;
      }

      console.error("Erro ao carregar detalhes do dia:", error);
      alert(currentLang === "en" ? "Could not load day details." : "Não foi possível carregar os detalhes do dia.");
    }
  }

  function renderCalendar() {
    adminCalendarGrid.innerHTML = "";
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    if (monthYearEl) {
      monthYearEl.textContent = `${MONTHS[month]} ${year}`;
    }

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();

    for (let i = 0; i < firstDay; i++) {
      const empty = document.createElement("div");
      empty.className = "admin-calendar-day-placeholder";
      adminCalendarGrid.appendChild(empty);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const key = formatDateKey(date);
      const data = getDayData(key);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "admin-calendar-day";
      btn.textContent = day;

      if (!data.is_available) btn.classList.add("unavailable");
      if (data.slots && data.slots.length > 0) btn.classList.add("has-slots");
      if (isSameDay(date, today)) btn.classList.add("today");
      if (isSameDay(date, selectedDate)) btn.classList.add("selected");

      btn.addEventListener("click", async () => {
        selectedDate = date;
        renderCalendar();
        await loadDayDetail(key);
      });

      adminCalendarGrid.appendChild(btn);
    }
  }

  function renderSlots() {
    const key = formatDateKey(selectedDate);
    const data = getDayData(key);
    const isAvailable = data.is_available;

    if (dayToggleEl) dayToggleEl.checked = isAvailable;
    if (dayToggleLabelEl) {
      dayToggleLabelEl.textContent =
        isAvailable
          ? currentLang === "en" ? "Available" : "Disponível"
          : currentLang === "en" ? "Unavailable" : "Indisponível";
    }

    if (selectedDateTitleEl) {
      selectedDateTitleEl.textContent = `${String(selectedDate.getDate()).padStart(2, "0")} ${MONTHS[selectedDate.getMonth()]}`;
    }
    if (selectedDateWeekdayEl) {
      selectedDateWeekdayEl.textContent = WEEKDAYS[selectedDate.getDay()];
    }

    if (!slotsContainerEl) return;
    slotsContainerEl.innerHTML = "";

    if (!isAvailable) {
      slotsContainerEl.innerHTML = `<div class="admin-empty-state">${
        currentLang === "en" ? "Day marked as unavailable." : "Dia marcado como indisponível."
      }</div>`;
      return;
    }

    if (!data.slots || data.slots.length === 0) {
      slotsContainerEl.innerHTML = `<div class="admin-empty-state">${
        currentLang === "en" ? "No time slots configured for this day." : "Nenhum horário configurado para este dia."
      }</div>`;
      return;
    }

    const sortedSlots = [...data.slots].sort((a, b) => a.start_time.localeCompare(b.start_time));

    sortedSlots.forEach((slot) => {
      const slotEl = document.createElement("div");
      slotEl.className = `admin-slot ${slot.is_booked ? "admin-slot-booked" : ""}`;
      slotEl.innerHTML = `
        <div class="admin-slot-time">
          <span class="material-symbols-outlined" aria-hidden="true">schedule</span>
          <span>${slot.start_time} - ${slot.end_time}</span>
        </div>
        <div class="admin-slot-actions">
          <span class="admin-slot-status ${slot.is_booked ? "booked" : "free"}">
            ${slot.is_booked ? (currentLang === "en" ? "Booked" : "Agendado") : (currentLang === "en" ? "Free" : "Livre")}
          </span>
          ${!slot.is_booked ? `<button class="admin-slot-delete" type="button" aria-label="${currentLang === "en" ? "Remove time slot" : "Remover horário"}" data-id="${slot.id}"><span class="material-symbols-outlined" style="font-size:18px">delete</span></button>` : ""}
        </div>
      `;
      slotsContainerEl.appendChild(slotEl);
    });

    slotsContainerEl.querySelectorAll(".admin-slot-delete").forEach((btn) => {
      btn.addEventListener("click", () => {
        const slotId = btn.dataset.id;
        openDeleteModal(slotId, key);
      });
    });
  }

  if (deleteSlotCancel) {
    deleteSlotCancel.addEventListener("click", closeDeleteModal);
  }

  if (deleteSlotConfirm) {
    deleteSlotConfirm.addEventListener("click", async () => {
      if (!pendingDeleteSlotId || !pendingDeleteDateKey) return;

      try {
        await api(`/api/admin/availability/${pendingDeleteDateKey}/slots/${pendingDeleteSlotId}`, { method: "DELETE" });
        closeDeleteModal();
        await loadMonthAvailability();
      } catch (error) {
        alert(error.message || (currentLang === "en" ? "Could not remove time slot." : "Não foi possível remover o horário."));
      }
    });
  }

  if (deleteSlotModal) {
    deleteSlotModal.addEventListener("click", (event) => {
      if (event.target === deleteSlotModal) {
        closeDeleteModal();
      }
    });
  }

  if (prevMonthBtn) {
    prevMonthBtn.addEventListener("click", () => {
      viewDate.setMonth(viewDate.getMonth() - 1);
      loadMonthAvailability();
    });
  }

  if (nextMonthBtn) {
    nextMonthBtn.addEventListener("click", () => {
      viewDate.setMonth(viewDate.getMonth() + 1);
      loadMonthAvailability();
    });
  }

  if (dayToggleEl) {
    dayToggleEl.addEventListener("change", async () => {
      const key = formatDateKey(selectedDate);
      try {
        await api(`/api/admin/availability/${key}`, {
          method: "PUT",
          body: JSON.stringify({ is_available: dayToggleEl.checked }),
        });
        await loadMonthAvailability();
      } catch (error) {
        alert(error.message || (currentLang === "en" ? "Could not update day." : "Não foi possível atualizar o dia."));
        dayToggleEl.checked = !dayToggleEl.checked;
      }
    });
  }

  if (addSlotFormEl) {
    addSlotFormEl.addEventListener("submit", async (event) => {
      event.preventDefault();
      const startEl = document.getElementById("slot-start");
      const endEl = document.getElementById("slot-end");
      const start_time = startEl?.value;
      const end_time = endEl?.value;

      if (!start_time || !end_time || start_time >= end_time) {
        alert(currentLang === "en" ? "End time must be after start time." : "O horário de fim deve ser depois do início.");
        return;
      }

      const key = formatDateKey(selectedDate);
      try {
        await api(`/api/admin/availability/${key}/slots`, {
          method: "POST",
          body: JSON.stringify({ start_time, end_time }),
        });
        await loadMonthAvailability();
      } catch (error) {
        alert(error.message || (currentLang === "en" ? "Could not add time slot." : "Não foi possível adicionar o horário."));
      }
    });
  }

  if (copyNextDayBtn) {
    copyNextDayBtn.addEventListener("click", async () => {
      const key = formatDateKey(selectedDate);
      try {
        await api(`/api/admin/availability/${key}/copy-next-day`, { method: "POST" });
        const nextDate = new Date(selectedDate);
        nextDate.setDate(nextDate.getDate() + 1);
        selectedDate = nextDate;
        viewDate = new Date(nextDate.getFullYear(), nextDate.getMonth(), 1);
        await loadMonthAvailability();
      } catch (error) {
        alert(error.message || (currentLang === "en" ? "Could not copy slots." : "Não foi possível copiar os horários."));
      }
    });
  }

  const adminMenuToggle = document.querySelector(".admin-menu-toggle");
  const adminMobileMenu = document.getElementById("admin-mobile-menu");
  if (adminMenuToggle && adminMobileMenu) {
    adminMenuToggle.addEventListener("click", () => {
      const isOpen = adminMobileMenu.classList.toggle("open");
      adminMenuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    adminMobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        adminMobileMenu.classList.remove("open");
        adminMenuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  loadMonthAvailability();
}

// Admin Messages
const messagesContainer = document.getElementById("admin-messages-items");

if (messagesContainer) {
  let messages = [];
  let selectedId = null;
  let currentFilter = "all";
  let searchTerm = "";

  const detailEmpty = document.getElementById("admin-message-empty");
  const detailContent = document.getElementById("admin-message-content");
  const searchInput = document.getElementById("message-search");
  const filterButtons = document.querySelectorAll(".admin-filter-button");
  const replyText = document.getElementById("reply-text");
  const sendReplyBtn = document.getElementById("send-reply-btn");
  const archiveBtn = document.getElementById("detail-archive-btn");
  const deleteBtn = document.getElementById("detail-delete-btn");
  const replyBtn = document.getElementById("detail-reply-btn");

  async function loadMessages() {
    try {
      const data = await api("/api/admin/contact-messages");
      messages = Array.isArray(data) ? data.map(mapMessage) : [];
    } catch (error) {
      console.error("Erro ao carregar mensagens:", error);
      messagesContainer.innerHTML = `<div class="admin-empty-state">${
        currentLang === "en" ? "Could not load messages." : "Não foi possível carregar as mensagens."
      }</div>`;
      return;
    }

    renderList();
    renderDetail();
  }

  function mapMessage(message) {
    return {
      ...message,
      receivedAt: message.created_at || message.receivedAt,
    };
  }

  function getInitials(name) {
    return name
      .split(" ")
      .map((part) => part[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }

  function formatMessageDate(isoString) {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return currentLang === "en" ? "Just now" : "Agora";
    if (diffMins < 60) return `${diffMins}min`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays === 1) return currentLang === "en" ? "Yesterday" : "Ontem";

    const options = { day: "numeric", month: "long", year: "numeric" };
    return date.toLocaleDateString(currentLang === "en" ? "en-US" : "pt-BR", options);
  }

  function getStatusLabel(status) {
    const labels = {
      new: currentLang === "en" ? "New" : "Nova",
      read: currentLang === "en" ? "Read" : "Lida",
      replied: currentLang === "en" ? "Replied" : "Respondida",
      archived: currentLang === "en" ? "Archived" : "Arquivada",
    };
    return labels[status] || status;
  }

  function getFilteredMessages() {
    let result = messages;

    if (currentFilter === "new") {
      result = result.filter((m) => m.status === "new");
    } else if (currentFilter === "read") {
      result = result.filter((m) => m.status === "read");
    } else if (currentFilter === "replied") {
      result = result.filter((m) => m.status === "replied");
    } else if (currentFilter === "archived") {
      result = result.filter((m) => m.status === "archived");
    } else {
      result = result.filter((m) => m.status !== "archived");
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(term) ||
          m.email.toLowerCase().includes(term) ||
          m.subject.toLowerCase().includes(term) ||
          m.body.toLowerCase().includes(term)
      );
    }

    return result.sort((a, b) => new Date(b.receivedAt) - new Date(a.receivedAt));
  }

  function renderList() {
    const filtered = getFilteredMessages();
    messagesContainer.innerHTML = "";

    if (filtered.length === 0) {
      messagesContainer.innerHTML = `<div class="admin-empty-state">${
        currentLang === "en" ? "No messages found." : "Nenhuma mensagem encontrada."
      }</div>`;
      return;
    }

    filtered.forEach((message) => {
      const item = document.createElement("article");
      item.className = `admin-message-item ${message.id === selectedId ? "active" : ""}`;
      item.dataset.id = message.id;

      let statusHtml = "";
      if (message.status === "new") {
        statusHtml = `<span class="admin-message-status new">${getStatusLabel("new")}</span>`;
      } else if (message.status === "replied") {
        statusHtml = `<span class="admin-message-status replied"><span class="material-symbols-outlined">reply</span>${getStatusLabel("replied")}</span>`;
      } else {
        statusHtml = `<span class="admin-message-status read">${getStatusLabel("read")}</span>`;
      }

      item.innerHTML = `
        <div class="admin-message-item-top">
          <span class="admin-message-item-name">${escapeHtml(message.name)}</span>
          <span class="admin-message-item-time">${formatMessageDate(message.receivedAt)}</span>
        </div>
        <h4 class="admin-message-item-subject">${escapeHtml(message.subject)}</h4>
        <p class="admin-message-item-preview">${escapeHtml(message.body)}</p>
        ${statusHtml}
      `;

      item.addEventListener("click", () => selectMessage(message.id));
      messagesContainer.appendChild(item);
    });
  }

  function renderDetail() {
    const message = messages.find((m) => m.id === selectedId);

    if (!message) {
      detailEmpty.classList.remove("hidden");
      detailContent.classList.add("hidden");
      return;
    }

    detailEmpty.classList.add("hidden");
    detailContent.classList.remove("hidden");

    document.getElementById("detail-subject").textContent = message.subject;
    document.getElementById("detail-avatar").textContent = getInitials(message.name);
    document.getElementById("detail-name").textContent = message.name;
    document.getElementById("detail-email").textContent = `<${message.email}>`;
    document.getElementById("detail-date").textContent = `${
      currentLang === "en" ? "Received on" : "Recebida em"
    } ${formatMessageDate(message.receivedAt)}`;
    document.getElementById("detail-phone").textContent = `${
      currentLang === "en" ? "Phone" : "Telefone"
    }: ${message.phone || (currentLang === "en" ? "Not provided" : "Não informado")}`;
    document.getElementById("detail-body").textContent = message.body;
    if (replyText) replyText.value = "";
  }

  async function updateMessageStatus(id, status) {
    try {
      await api(`/api/admin/contact-messages/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
      return true;
    } catch (error) {
      const isNotFound = error.message && error.message.toLowerCase().includes("not found");
      if (isNotFound) {
        alert(`O endpoint PUT /api/admin/contact-messages/{id}/status ainda não está disponível no backend.`);
      } else {
        alert(error.message || "Não foi possível atualizar a mensagem.");
      }
      return false;
    }
  }

  async function deleteMessage(id) {
    try {
      await api(`/api/admin/contact-messages/${id}`, { method: "DELETE" });
      return true;
    } catch (error) {
      const isNotFound = error.message && error.message.toLowerCase().includes("not found");
      if (isNotFound) {
        alert(`O endpoint DELETE /api/admin/contact-messages/{id} ainda não está disponível no backend.`);
      } else {
        alert(error.message || "Não foi possível excluir a mensagem.");
      }
      return false;
    }
  }

  async function selectMessage(id) {
    selectedId = id;
    const message = messages.find((m) => m.id === id);

    if (message && message.status === "new") {
      const updated = await updateMessageStatus(message.id, "read");
      if (updated) {
        message.status = "read";
      }
    }

    renderList();
    renderDetail();
  }

  function removeSelected() {
    selectedId = null;
    renderList();
    renderDetail();
  }

  function escapeHtml(text) {
    if (!text) return "";
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      searchTerm = searchInput.value;
      renderList();
    });
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((btn) => {
        btn.classList.remove("active", "button");
        btn.classList.add("button-outline");
      });
      button.classList.remove("button-outline");
      button.classList.add("active", "button");
      currentFilter = button.dataset.filter;
      renderList();
    });
  });

  if (sendReplyBtn) {
    sendReplyBtn.addEventListener("click", async () => {
      const text = replyText?.value.trim();
      if (!text) return;

      const message = messages.find((m) => m.id === selectedId);
      if (!message) return;

      const updated = await updateMessageStatus(message.id, "replied");
      if (updated) {
        message.status = "replied";
        replyText.value = "";
        renderList();
        renderDetail();
      }
    });
  }

  if (replyBtn) {
    replyBtn.addEventListener("click", () => {
      replyText?.focus();
    });
  }

  if (archiveBtn) {
    archiveBtn.addEventListener("click", async () => {
      const message = messages.find((m) => m.id === selectedId);
      if (!message) return;

      const updated = await updateMessageStatus(message.id, "archived");
      if (updated) {
        message.status = "archived";
        removeSelected();
      }
    });
  }

  if (deleteBtn) {
    deleteBtn.addEventListener("click", async () => {
      if (!selectedId) return;

      const confirmed = confirm(
        currentLang === "en"
          ? "Are you sure you want to delete this message?"
          : "Tem certeza de que deseja excluir esta mensagem?"
      );
      if (!confirmed) return;

      const deleted = await deleteMessage(selectedId);
      if (deleted) {
        messages = messages.filter((m) => m.id !== selectedId);
        removeSelected();
      }
    });
  }

  loadMessages();
}

const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("form-status");

if (contactForm) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const endpoint = contactForm.dataset.endpoint;
    const formData = new FormData(contactForm);
    const name = formData.get("name");
    const email = formData.get("email");
    const phone = formData.get("phone");
    const subject = formData.get("subject");
    const message = formData.get("message");
    const payload = {
      name,
      email,
      phone,
      subject: subject && subject.trim() ? subject.trim() : "Contato via Site",
      body: message,
    };

    if (formStatus) {
      formStatus.textContent = currentLang === "en" ? "Sending message..." : "Enviando mensagem...";
    }

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Falha ao enviar.");
      }

      contactForm.reset();

      if (formStatus) {
        formStatus.textContent = currentLang === "en" ? "Message sent successfully." : "Mensagem enviada com sucesso.";
      }
    } catch (error) {
      if (formStatus) {
        formStatus.textContent =
          currentLang === "en"
            ? "We could not send it right now. Please try again shortly or contact us via WhatsApp."
            : "Não foi possível enviar agora. Tente novamente em instantes ou fale conosco pelo WhatsApp.";
      }
    }
  });
}

//teste2
