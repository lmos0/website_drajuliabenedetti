import { api } from "../services/api.js";
import { escapeHtml } from "../utils/sanitize.js";
import { formatDateKey, isSameDay, MONTHS, WEEKDAYS } from "../utils/date.js";
import { initAdminMenuToggle } from "../components/menu-toggle.js";

initAdminMenuToggle();

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

  let viewDate = new Date();
  let selectedDate = new Date();
  let availabilityByDate = {};
  let isLoading = false;
  let pendingDeleteSlotId = null;
  let pendingDeleteDateKey = null;
  let monthController = null;
  let detailController = null;

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

  function getDayData(key) {
    return availabilityByDate[key] || { is_available: true, slots: [] };
  }

  async function loadMonthAvailability() {
    monthController?.abort();
    monthController = new AbortController();

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth() + 1;

    try {
      isLoading = true;
      const days = await api(`/api/admin/availability?year=${year}&month=${month}`, {
        signal: monthController.signal,
      });
      availabilityByDate = {};
      days.forEach((day) => {
        availabilityByDate[day.date] = {
          ...day,
          slots: day.slots || [],
        };
      });
    } catch (error) {
      if (error.name === "AbortError") return;
      console.error("Erro ao carregar disponibilidade:", error);
      alert("Não foi possível carregar a disponibilidade.");
    } finally {
      isLoading = false;
      renderCalendar();
      await loadDayDetail(formatDateKey(selectedDate));
    }
  }

  async function loadDayDetail(dateKey) {
    detailController?.abort();
    detailController = new AbortController();

    try {
      const day = await api(`/api/admin/availability/${dateKey}`, {
        signal: detailController.signal,
      });
      availabilityByDate[dateKey] = {
        ...day,
        slots: day.slots || [],
      };
      renderSlots();
    } catch (error) {
      if (error.name === "AbortError") return;

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
      alert("Não foi possível carregar os detalhes do dia.");
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
      btn.dataset.dateKey = key;

      if (!data.is_available) btn.classList.add("unavailable");
      if (data.slots && data.slots.length > 0) btn.classList.add("has-slots");
      if (isSameDay(date, today)) btn.classList.add("today");
      if (isSameDay(date, selectedDate)) btn.classList.add("selected");

      adminCalendarGrid.appendChild(btn);
    }
  }

  adminCalendarGrid.addEventListener("click", async (e) => {
    const btn = e.target.closest(".admin-calendar-day");
    if (!btn || !btn.dataset.dateKey) return;

    const key = btn.dataset.dateKey;
    const [y, m, d] = key.split("-");
    selectedDate = new Date(+y, +m - 1, +d);
    renderCalendar();
    await loadDayDetail(key);
  });

  function renderSlots() {
    const key = formatDateKey(selectedDate);
    const data = getDayData(key);
    const isAvailable = data.is_available;

    if (dayToggleEl) dayToggleEl.checked = isAvailable;
    if (dayToggleLabelEl) {
      dayToggleLabelEl.textContent = isAvailable ? "Disponível" : "Indisponível";
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
      slotsContainerEl.innerHTML = `<div class="admin-empty-state">Dia marcado como indisponível.</div>`;
      return;
    }

    if (!data.slots || data.slots.length === 0) {
      slotsContainerEl.innerHTML = `<div class="admin-empty-state">Nenhum horário configurado para este dia.</div>`;
      return;
    }

    const sortedSlots = [...data.slots].sort((a, b) => a.start_time.localeCompare(b.start_time));

    sortedSlots.forEach((slot) => {
      const slotEl = document.createElement("div");
      slotEl.className = `admin-slot ${slot.is_booked ? "admin-slot-booked" : ""}`;
      slotEl.innerHTML = `
        <div class="admin-slot-time">
          <span class="material-symbols-outlined" aria-hidden="true">schedule</span>
          <span>${escapeHtml(slot.start_time)} - ${escapeHtml(slot.end_time)}</span>
        </div>
        <div class="admin-slot-actions">
          <span class="admin-slot-status ${slot.is_booked ? "booked" : "free"}">
            ${slot.is_booked ? "Agendado" : "Livre"}
          </span>
          ${!slot.is_booked ? `<button class="admin-slot-delete" type="button" aria-label="Remover horário" data-id="${escapeHtml(String(slot.id))}"><span class="material-symbols-outlined">delete</span></button>` : ""}
        </div>
      `;
      slotsContainerEl.appendChild(slotEl);
    });
  }

  slotsContainerEl.addEventListener("click", (e) => {
    const btn = e.target.closest(".admin-slot-delete");
    if (!btn || !btn.dataset.id) return;

    const key = formatDateKey(selectedDate);
    openDeleteModal(btn.dataset.id, key);
  });

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
        alert(error.message || "Não foi possível remover o horário.");
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
        alert(error.message || "Não foi possível atualizar o dia.");
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
        alert("O horário de fim deve ser depois do início.");
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
        alert(error.message || "Não foi possível adicionar o horário.");
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
        alert(error.message || "Não foi possível copiar os horários.");
      }
    });
  }

  loadMonthAvailability();
}
