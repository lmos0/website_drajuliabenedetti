import { initHeader } from "../components/header.js";
import { initMenuToggle } from "../components/menu-toggle.js";
import { applyTranslations, updateLanguageLinks } from "../i18n/index.js";
import { getLang } from "../state/store.js";
import { publicApi } from "../services/api.js";

initHeader();
initMenuToggle();
applyTranslations();
updateLanguageLinks();

const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("form-status");

if (contactForm) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitBtn = contactForm.querySelector("button[type='submit']");
    if (submitBtn) submitBtn.disabled = true;

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
      formStatus.textContent = getLang() === "en" ? "Sending message..." : "Enviando mensagem...";
    }

    try {
      if (endpoint) {
        const path = endpoint.replace(/^https?:\/\/[^/]+/, "");
        await publicApi(path, {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      contactForm.reset();

      if (formStatus) {
        formStatus.textContent = getLang() === "en" ? "Message sent successfully." : "Mensagem enviada com sucesso.";
      }
    } catch {
      console.error("Falha ao enviar formulário de contato.");
      if (formStatus) {
        formStatus.textContent =
          getLang() === "en"
            ? "We could not send it right now. Please try again shortly or contact us via WhatsApp."
            : "Não foi possível enviar agora. Tente novamente em instantes ou fale conosco pelo WhatsApp.";
      }
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}
