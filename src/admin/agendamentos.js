import { api } from "../services/api.js";
import { escapeHtml } from "../utils/sanitize.js";
import { MONTHS } from "../utils/date.js";
import { initAdminMenuToggle } from "../components/menu-toggle.js";

import { debounce } from "../utils/debounce.js";
import { getInitials } from "../utils/string.js";

initAdminMenuToggle();

const appointmentsContainer = document.getElementById("admin-appointments-items");

if (appointmentsContainer) {
  const searchInput = document.getElementById("appointment-search");
  const dateFilterInput = document.getElementById("appointment-date-filter");
  const clearDateBtn = document.getElementById("clear-date-filter");
  const filterButtons = document.querySelectorAll(".admin-appointments-filters .admin-filter-button");
  const detailEmpty = document.getElementById("admin-appointment-empty");
  const detailContent = document.getElementById("admin-appointment-content");
  const cancelBtn = document.getElementById("detail-cancel-btn");
  const completeBtn = document.getElementById("detail-complete-btn");

  let appointments = [];
  let selectedId = null;
  let currentFilter = "all";
  let searchTerm = "";
  let dateFilter = "";
  let appointmentsController = null;

  async function loadAppointments() {
    appointmentsController?.abort();
    appointmentsController = new AbortController();

    try {
      appointmentsContainer.innerHTML = `<div class="admin-empty-state">Carregando agendamentos...</div>`;

      const params = new URLSearchParams();
      if (currentFilter !== "all") params.append("status", currentFilter);
      if (searchTerm.trim()) params.append("search", searchTerm.trim());
      if (dateFilter) params.append("date", dateFilter);

      const query = params.toString() ? `?${params.toString()}` : "";
      appointments = await api(`/api/admin/appointments${query}`, {
        signal: appointmentsController.signal,
      });

      if (!Array.isArray(appointments)) {
        appointments = [];
      }
    } catch (error) {
      if (error.name === "AbortError") return;
      console.error("Erro ao carregar agendamentos:", error);
      const isNotFound = error.message && error.message.toLowerCase().includes("not found");
      if (isNotFound) {
        appointmentsContainer.innerHTML = `
          <div class="admin-empty-state">
            O endpoint de listagem de agendamentos ainda não está disponível no backend.<br />
            Implemente <code>GET /api/admin/appointments</code> para visualizar os agendamentos.
          </div>
        `;
      } else {
        appointmentsContainer.innerHTML = `<div class="admin-empty-state">Não foi possível carregar os agendamentos.</div>`;
      }
      return;
    }

    renderList();
  }

  function getStatusLabel(status) {
    const labels = {
      scheduled: "Agendado",
      canceled: "Cancelado",
      completed: "Concluído",
    };
    return labels[status] || status;
  }

  function getStatusClass(status) {
    return ["scheduled", "canceled", "completed"].includes(status) ? status : "";
  }

  function formatDate(dateStr) {
    if (!dateStr) return "Data não informada";
    const [year, monthIndex, day] = dateStr.split("-");
    return `${day} de ${MONTHS[Number(monthIndex) - 1]} de ${year}`;
  }

  function getAppointmentDisplay(appointment) {
    const date = appointment.date || "";
    const start = appointment.start_time || "";
    const end = appointment.end_time || "";
    const time = start && end ? `${start} - ${end}` : start || "";
    return { date, time, displayDate: formatDate(date) };
  }

  function renderList() {
    appointmentsContainer.innerHTML = "";

    if (appointments.length === 0) {
      appointmentsContainer.innerHTML = `<div class="admin-empty-state">Nenhum agendamento encontrado.</div>`;
      return;
    }

    appointments.forEach((appointment) => {
      const { displayDate, time } = getAppointmentDisplay(appointment);
      const item = document.createElement("article");
      item.className = `admin-appointment-item ${appointment.id === selectedId ? "active" : ""}`;
      item.dataset.id = appointment.id;

      item.innerHTML = `
        <div class="admin-appointment-avatar">${getInitials(appointment.name)}</div>
        <div class="admin-appointment-info">
          <h3>${escapeHtml(appointment.name)}</h3>
          <p>${escapeHtml(appointment.email)} · ${escapeHtml(appointment.phone || "Telefone não informado")}</p>
        </div>
        <div class="admin-appointment-meta">
          <span class="admin-appointment-date">${displayDate}</span>
          ${time ? `<span class="admin-appointment-time">${time}</span>` : ""}
          <span class="admin-appointment-status ${appointment.status}">${getStatusLabel(appointment.status)}</span>
        </div>
      `;

      item.addEventListener("click", () => selectAppointment(appointment.id));
      appointmentsContainer.appendChild(item);
    });
  }

  function selectAppointment(id) {
    selectedId = id;
    renderList();
    renderDetail();
  }

  function renderDetail() {
    const appointment = appointments.find((a) => a.id === selectedId);

    if (!appointment) {
      detailEmpty.classList.remove("hidden");
      detailContent.classList.add("hidden");
      return;
    }

    detailEmpty.classList.add("hidden");
    detailContent.classList.remove("hidden");

    const { displayDate, time } = getAppointmentDisplay(appointment);

    document.getElementById("detail-name").textContent = appointment.name;
    document.getElementById("detail-contact").textContent = `${appointment.email} · ${appointment.phone || "Telefone não informado"}`;
    document.getElementById("detail-datetime").textContent = time
      ? `${displayDate} · ${time}`
      : displayDate;
    document.getElementById("detail-status").innerHTML = `<span class="admin-appointment-status ${getStatusClass(appointment.status)}">${escapeHtml(getStatusLabel(appointment.status))}</span>`;
    document.getElementById("detail-notes").textContent = appointment.notes || "-";
    document.getElementById("detail-id").textContent = appointment.id;

    cancelBtn.disabled = appointment.status !== "scheduled";
    completeBtn.disabled = appointment.status !== "scheduled";
  }

  async function updateStatus(status) {
    if (!selectedId) return;

    const endpoint = status === "canceled"
      ? `/api/admin/appointments/${selectedId}/cancel`
      : `/api/admin/appointments/${selectedId}/complete`;

    try {
      await api(endpoint, { method: "PUT" });
      await loadAppointments();
    } catch (error) {
      alert(error.message || "Não foi possível atualizar o agendamento.");
    }
  }

  if (searchInput) {
    searchInput.addEventListener("input", debounce(() => {
      searchTerm = searchInput.value;
      loadAppointments();
    }, 300));
  }

  if (dateFilterInput) {
    dateFilterInput.addEventListener("change", () => {
      dateFilter = dateFilterInput.value;
      loadAppointments();
    });
  }

  if (clearDateBtn) {
    clearDateBtn.addEventListener("click", () => {
      dateFilter = "";
      dateFilterInput.value = "";
      loadAppointments();
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
      loadAppointments();
    });
  });

  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => updateStatus("canceled"));
  }

  if (completeBtn) {
    completeBtn.addEventListener("click", () => updateStatus("completed"));
  }

  loadAppointments();
}
