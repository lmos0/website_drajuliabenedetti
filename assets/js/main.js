const params = new URLSearchParams(window.location.search);
const currentLang = params.get("lang") === "en" ? "en" : "pt";

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
  setAttr(".header-cta", "href", "https://api.whatsapp.com/send/?phone=5519981096007&text=Hello%2C+I+would+like+to+book+an+appointment.&type=phone_number&app_absent=0");

  document.querySelectorAll(".mobile-menu > a").forEach((link) => {
    if (link.textContent.trim() === "Book an Appointment") {
      link.setAttribute("href", "https://api.whatsapp.com/send/?phone=5519981096007&text=Hello%2C+I+would+like+to+book+an+appointment.&type=phone_number&app_absent=0");
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
    setAttr("input[name='subject']", "value", "Contact via website");
    setText("label[for='message']", "Message");
    setAttr("#message", "placeholder", "How can we help?");
    setText(".form-card button", "Send Message");
  },
};

const updateLanguageLinks = () => {
  const hash = window.location.hash;
  const portugueseHref = `${pageName}${hash}`;
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
    const message = formData.get("message");
    const payload = {
      email,
      subject: formData.get("subject"),
      telephone: phone,
      message:
        currentLang === "en"
          ? `${name} (${email} / ${phone}) sent: ${message}`
          : `${name} (${email} / ${phone}) enviou: ${message}`,
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
