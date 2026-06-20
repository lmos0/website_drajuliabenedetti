import { initHeader } from "../components/header.js";
import { initMenuToggle } from "../components/menu-toggle.js";
import { applyTranslations, updateLanguageLinks } from "../i18n/index.js";
import { publicApi } from "../services/api.js";
import { escapeHtml } from "../utils/sanitize.js";
import { formatDateKey, isSameDay, MONTHS, WEEKDAYS } from "../utils/date.js";

initHeader();
initMenuToggle();
applyTranslations();
updateLanguageLinks();

const bookingCalendarGrid = document.getElementById("booking-calendar-grid");

if (bookingCalendarGrid) {
  const monthYearEl = document.getElementById("calendar-month-year");
  const prevMonthBtn = document.getElementById("prev-month");
  const nextMonthBtn = document.getElementById("next-month");
  const selectedDateEl = document.getElementById("booking-selected-date");
  const slotsContainerEl = document.getElementById("booking-slots");
  const bookingFormEl = document.getElementById("booking-form");
  const slotIdInputEl = document.getElementById("booking-slot-id");
  const submitBtnEl = document.getElementById("booking-submit");
  const formStatusEl = document.getElementById("booking-form-status");
  const formContainerEl = document.getElementById("booking-form-container");

  let viewDate = new Date();
  let selectedDate = null;
  let selectedSlotId = null;
  let availabilityByDate = {};
  let availabilityController = null;
  let slotsController = null;

  function formatPhone(input) {
    let digits = input.value.replace(/\D/g, "");
    if (digits.length > 11) digits = digits.slice(0, 11);

    if (digits.length <= 2) {
      input.value = digits.length ? `(${digits}` : "";
    } else if (digits.length <= 6) {
      input.value = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    } else if (digits.length <= 10) {
      input.value = `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    } else {
      input.value = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    }
  }

  const phoneInput = document.getElementById("booking-phone");
  if (phoneInput) {
    phoneInput.addEventListener("input", () => formatPhone(phoneInput));
  }

  async function loadAvailability() {
    availabilityController?.abort();
    availabilityController = new AbortController();

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth() + 1;

    try {
      const days = await publicApi(`/api/availability?year=${year}&month=${month}`, {
        signal: availabilityController.signal,
      });
      availabilityByDate = {};
      days.forEach((day) => {
        availabilityByDate[day.date] = day;
      });
    } catch (error) {
      if (error.name === "AbortError") return;
      availabilityByDate = {};
      console.error("Erro ao carregar disponibilidade:", error);
    }

    renderCalendar();
  }

  function renderCalendar() {
    bookingCalendarGrid.innerHTML = "";
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    if (monthYearEl) {
      monthYearEl.textContent = `${MONTHS[month]} ${year}`;
    }

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
      const empty = document.createElement("div");
      empty.className = "booking-calendar-day-placeholder";
      bookingCalendarGrid.appendChild(empty);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const key = formatDateKey(date);
      const dayData = availabilityByDate[key];
      const isAvailableDay = dayData && dayData.is_available;

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "booking-calendar-day";
      btn.textContent = day;
      btn.dataset.dateKey = key;

      if (isAvailableDay) {
        btn.classList.add("available");
      } else {
        btn.classList.add("empty");
        btn.disabled = true;
      }

      if (selectedDate && isSameDay(date, selectedDate)) {
        btn.classList.add("selected");
      }

      bookingCalendarGrid.appendChild(btn);
    }
  }

  bookingCalendarGrid.addEventListener("click", (e) => {
    const btn = e.target.closest(".booking-calendar-day");
    if (!btn || !btn.dataset.dateKey) return;

    const key = btn.dataset.dateKey;
    const [y, m, d] = key.split("-");
    selectedDate = new Date(+y, +m - 1, +d);
    selectedSlotId = null;
    slotIdInputEl.value = "";
    submitBtnEl.disabled = true;
    renderCalendar();
    renderSelectedDate();
    loadSlots(key);
  });

  function renderSelectedDate() {
    if (!selectedDateEl) return;

    if (!selectedDate) {
      selectedDateEl.innerHTML = "Selecione uma data no calendário.";
      return;
    }

    const dateStr = `${String(selectedDate.getDate()).padStart(2, "0")} de ${MONTHS[selectedDate.getMonth()]} de ${selectedDate.getFullYear()}`;
    const weekdayStr = WEEKDAYS[selectedDate.getDay()];
    selectedDateEl.innerHTML = `<strong>${dateStr}</strong>${weekdayStr}`;
  }

  async function loadSlots(dateKey) {
    slotsController?.abort();
    slotsController = new AbortController();

    if (!slotsContainerEl) return;
    slotsContainerEl.innerHTML = `<div class="booking-empty-state">Carregando horários...</div>`;

    try {
      const slots = await publicApi(`/api/availability/${dateKey}/slots`, {
        signal: slotsController.signal,
      });
      renderSlots(slots);
    } catch (error) {
      if (error.name === "AbortError") return;
      slotsContainerEl.innerHTML = `<div class="booking-empty-state">Não foi possível carregar os horários.</div>`;
      console.error("Erro ao carregar horários:", error);
    }
  }

  function renderSlots(slots) {
    slotsContainerEl.innerHTML = "";

    if (!slots || slots.length === 0) {
      slotsContainerEl.innerHTML = `<div class="booking-empty-state">Nenhum horário disponível para este dia.</div>`;
      return;
    }

    slots.forEach((slot) => {
      const slotEl = document.createElement("button");
      slotEl.type = "button";
      slotEl.className = "booking-slot";
      slotEl.textContent = slot.start_time;
      slotEl.dataset.id = slot.id;

      if (selectedSlotId === slot.id) {
        slotEl.classList.add("selected");
      }

      slotsContainerEl.appendChild(slotEl);
    });
  }

  slotsContainerEl.addEventListener("click", (e) => {
    const btn = e.target.closest(".booking-slot");
    if (!btn || !btn.dataset.id) return;

    selectedSlotId = Number(btn.dataset.id);
    slotIdInputEl.value = btn.dataset.id;
    submitBtnEl.disabled = false;

    slotsContainerEl.querySelectorAll(".booking-slot").forEach((el) => el.classList.remove("selected"));
    btn.classList.add("selected");
  });

  if (prevMonthBtn) {
    prevMonthBtn.addEventListener("click", () => {
      viewDate.setMonth(viewDate.getMonth() - 1);
      loadAvailability();
    });
  }

  if (nextMonthBtn) {
    nextMonthBtn.addEventListener("click", () => {
      viewDate.setMonth(viewDate.getMonth() + 1);
      loadAvailability();
    });
  }

  if (bookingFormEl) {
    bookingFormEl.addEventListener("submit", async (event) => {
      event.preventDefault();

      const name = bookingFormEl.querySelector("#booking-name").value.trim();
      const email = bookingFormEl.querySelector("#booking-email").value.trim();
      const phone = bookingFormEl.querySelector("#booking-phone").value.trim();
      const notes = bookingFormEl.querySelector("#booking-notes").value.trim();
      const slotId = slotIdInputEl.value;

      if (!slotId) {
        formStatusEl.textContent = "Selecione um horário.";
        formStatusEl.className = "booking-form-status error";
        return;
      }

      submitBtnEl.disabled = true;
      formStatusEl.textContent = "Processando agendamento...";
      formStatusEl.className = "booking-form-status";

      try {
        const appointment = await publicApi("/api/appointments", {
          method: "POST",
          body: JSON.stringify({
            slot_id: slotId,
            name,
            email,
            phone,
            notes,
          }),
        });

        renderConfirmation(appointment);
      } catch (error) {
        formStatusEl.textContent = error.message || "Não foi possível confirmar o agendamento. Tente novamente.";
        formStatusEl.className = "booking-form-status error";
        submitBtnEl.disabled = false;
      }
    });
  }

  function renderConfirmation(appointment) {
    if (!formContainerEl) return;

    const dateStr = selectedDate
      ? `${String(selectedDate.getDate()).padStart(2, "0")}/${String(selectedDate.getMonth() + 1).padStart(2, "0")}/${selectedDate.getFullYear()}`
      : "";

    const slotEl = slotsContainerEl.querySelector(`[data-id="${selectedSlotId}"]`);
    const timeStr = slotEl ? slotEl.textContent : "";

    formContainerEl.innerHTML = `
      <div class="booking-confirmation">
        <span class="material-symbols-outlined booking-confirmation-icon">check_circle</span>
        <h3>Agendamento confirmado</h3>
        <p>
          Obrigado, <strong>${escapeHtml(appointment.name)}</strong>.<br />
          Seu agendamento foi recebido para <strong>${escapeHtml(dateStr)}</strong> às <strong>${escapeHtml(timeStr)}</strong>.
        </p>
        <p class="muted booking-confirmation-note">
          Enviamos uma confirmação para <strong>${escapeHtml(appointment.email)}</strong>.<br />
          Código do agendamento: <code>${escapeHtml(String(appointment.id))}</code>
        </p>
        <a class="button" href="index.html">Voltar ao início</a>
      </div>
    `;
  }

  renderSelectedDate();
  loadAvailability();
}
