const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");

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
    const payload = {
      email: formData.get("email"),
      subject: formData.get("subject"),
      telephone: formData.get("phone"),
      message: `${formData.get("name")} (${formData.get("email")} / ${formData.get("phone")}) enviou: ${formData.get("message")}`,
    };

    if (formStatus) {
      formStatus.textContent = "Enviando mensagem...";
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
        formStatus.textContent = "Mensagem enviada com sucesso.";
      }
    } catch (error) {
      if (formStatus) {
        formStatus.textContent =
          "Não foi possível enviar agora. Tente novamente em instantes ou fale conosco pelo WhatsApp.";
      }
    }
  });
}
