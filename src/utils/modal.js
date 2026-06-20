let modalContainer = null;
let previousActiveElement = null;

/**
 * Ensures a single modal container exists in the body.
 * @returns {HTMLDivElement}
 */
function ensureModalContainer() {
  if (modalContainer) return modalContainer;
  modalContainer = document.createElement("div");
  modalContainer.id = "app-modal-container";
  document.body.appendChild(modalContainer);
  return modalContainer;
}

/**
 * Creates the modal DOM element.
 * @param {Object} options
 * @param {string} options.title
 * @param {string} options.body
 * @param {string} options.icon
 * @param {string} options.iconColor
 * @param {Array<{text: string, variant: string}>} options.buttons
 * @returns {HTMLDivElement}
 */
function createModalElement({ title, body, icon, iconColor, buttons }) {
  const overlay = document.createElement("div");
  overlay.className = "admin-modal-overlay open";
  overlay.setAttribute("aria-hidden", "false");

  const dialog = document.createElement("div");
  dialog.className = "admin-modal";
  dialog.setAttribute("role", "dialog");
  dialog.setAttribute("aria-modal", "true");
  dialog.setAttribute("aria-labelledby", "app-modal-title");

  const header = document.createElement("div");
  header.className = "admin-modal-header";

  const iconEl = document.createElement("span");
  iconEl.className = `material-symbols-outlined ${iconColor}`;
  iconEl.setAttribute("aria-hidden", "true");
  iconEl.textContent = icon;

  const titleEl = document.createElement("h3");
  titleEl.id = "app-modal-title";
  titleEl.textContent = title;

  header.appendChild(iconEl);
  header.appendChild(titleEl);

  const bodyEl = document.createElement("p");
  bodyEl.className = "admin-modal-body";
  bodyEl.textContent = body;

  const actions = document.createElement("div");
  actions.className = "admin-modal-actions";

  buttons.forEach((btn, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = btn.variant || "button";
    button.textContent = btn.text;
    button.dataset.index = String(index);
    actions.appendChild(button);
  });

  dialog.appendChild(header);
  dialog.appendChild(bodyEl);
  dialog.appendChild(actions);
  overlay.appendChild(dialog);

  return overlay;
}

/**
 * Displays a modal dialog.
 * @param {Object} options
 * @param {string} options.title - Modal title
 * @param {string} options.body - Modal body text
 * @param {string} [options.icon="info"] - Material Symbols icon name
 * @param {string} [options.iconColor="primary"] - CSS color class for the icon
 * @param {Array<{text: string, variant: string}>} [options.buttons=[{ text: "OK", variant: "button" }]]
 * @returns {Promise<number>} Resolves with the index of the clicked button, or -1 if dismissed.
 */
export function showModal({
  title,
  body,
  icon = "info",
  iconColor = "primary",
  buttons = [{ text: "OK", variant: "button" }],
}) {
  return new Promise((resolve) => {
    const container = ensureModalContainer();
    const overlay = createModalElement({ title, body, icon, iconColor, buttons });

    container.innerHTML = "";
    container.appendChild(overlay);

    previousActiveElement = document.activeElement;
    document.body.style.overflow = "hidden";

    const firstButton = overlay.querySelector(".admin-modal-actions button");
    firstButton?.focus();

    /**
     * @param {number} result
     */
    function cleanup(result) {
      overlay.classList.remove("open");
      overlay.setAttribute("aria-hidden", "true");
      container.innerHTML = "";
      document.body.style.overflow = "";
      previousActiveElement?.focus?.();
      resolve(result);
    }

    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) cleanup(-1);
    });

    overlay.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        cleanup(-1);
      }
    });

    const buttonEls = overlay.querySelectorAll(".admin-modal-actions button");
    buttonEls.forEach((button) => {
      button.addEventListener("click", () => {
        cleanup(Number(button.dataset.index));
      });
    });
  });
}

/**
 * Shows an error modal.
 * @param {string} body
 * @returns {Promise<number>}
 */
export function showErrorModal(body) {
  return showModal({
    title: "Erro",
    body,
    icon: "error",
    iconColor: "error",
    buttons: [{ text: "Fechar", variant: "button-outline" }],
  });
}

/**
 * Shows a warning modal.
 * @param {string} body
 * @returns {Promise<number>}
 */
export function showWarningModal(body) {
  return showModal({
    title: "Atenção",
    body,
    icon: "warning",
    iconColor: "warning",
    buttons: [{ text: "Fechar", variant: "button-outline" }],
  });
}

/**
 * Shows an informational modal.
 * @param {string} body
 * @returns {Promise<number>}
 */
export function showInfoModal(body) {
  return showModal({
    title: "Informação",
    body,
    icon: "info",
    iconColor: "primary",
    buttons: [{ text: "Fechar", variant: "button-outline" }],
  });
}

/**
 * Shows a confirmation modal.
 * @param {Object} options
 * @param {string} options.title
 * @param {string} options.body
 * @param {string} [options.confirmText="Confirmar"]
 * @param {string} [options.cancelText="Cancelar"]
 * @param {string} [options.confirmVariant="admin-button-danger"]
 * @returns {Promise<boolean>} Resolves true if confirmed, false otherwise.
 */
export function showConfirmModal({
  title,
  body,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  confirmVariant = "admin-button-danger",
}) {
  return showModal({
    title,
    body,
    icon: "warning",
    iconColor: "error",
    buttons: [
      { text: cancelText, variant: "button-outline" },
      { text: confirmText, variant: confirmVariant },
    ],
  }).then((index) => index === 1);
}
