import { api } from "../services/api.js";
import { escapeHtml } from "../utils/sanitize.js";
import { getInitials } from "../utils/string.js";
import { initAdminMenuToggle } from "../components/menu-toggle.js";

import { debounce } from "../utils/debounce.js";

initAdminMenuToggle();

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
      messagesContainer.innerHTML = `<div class="admin-empty-state">Não foi possível carregar as mensagens.</div>`;
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

  function formatMessageDate(isoString) {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "Agora";
    if (diffMins < 60) return `${diffMins}min`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays === 1) return "Ontem";

    const options = { day: "numeric", month: "long", year: "numeric" };
    return date.toLocaleDateString("pt-BR", options);
  }

  function getStatusLabel(status) {
    const labels = {
      new: "Nova",
      read: "Lida",
      replied: "Respondida",
      archived: "Arquivada",
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
      messagesContainer.innerHTML = `<div class="admin-empty-state">Nenhuma mensagem encontrada.</div>`;
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
    document.getElementById("detail-date").textContent = `Recebida em ${formatMessageDate(message.receivedAt)}`;
    document.getElementById("detail-phone").textContent = `Telefone: ${message.phone || "Não informado"}`;
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

  if (searchInput) {
    searchInput.addEventListener("input", debounce(() => {
      searchTerm = searchInput.value;
      renderList();
    }, 300));
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

      const confirmed = confirm("Tem certeza de que deseja excluir esta mensagem?");
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
