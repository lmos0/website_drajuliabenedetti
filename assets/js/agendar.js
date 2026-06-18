// Public Booking Page
const bookingCalendarGrid = document.getElementById("booking-calendar-grid");

if (bookingCalendarGrid) {
  const API_BASE = "http://localhost:8082";

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
  let selectedDate = null;
  let selectedSlotId = null;
  let availabilityByDate = {};

  async function publicApi(path, options = {}) {
    const url = `${API_BASE}${path}`;
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Erro inesperado" }));
      throw new Error(error.error || `Erro ${response.status}`);
    }

    if (response.status === 204) return null;
    return response.json();
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

  async function loadAvailability() {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth() + 1;

    try {
      const days = await publicApi(`/api/availability?year=${year}&month=${month}`);
      availabilityByDate = {};
      days.forEach((day) => {
        availabilityByDate[day.date] = day;
      });
    } catch (error) {
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

      if (isAvailableDay) {
        btn.classList.add("available");
      } else {
        btn.classList.add("empty");
        btn.disabled = true;
      }

      if (selectedDate && isSameDay(date, selectedDate)) {
        btn.classList.add("selected");
      }

      btn.addEventListener("click", () => {
        selectedDate = date;
        selectedSlotId = null;
        slotIdInputEl.value = "";
        submitBtnEl.disabled = true;
        renderCalendar();
        renderSelectedDate();
        loadSlots(key);
      });

      bookingCalendarGrid.appendChild(btn);
    }
  }

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
    if (!slotsContainerEl) return;
    slotsContainerEl.innerHTML = `<div class="booking-empty-state">Carregando horários...</div>`;

    try {
      const slots = await publicApi(`/api/availability/${dateKey}/slots`);
      renderSlots(slots);
    } catch (error) {
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
      slotEl.textContent = `${slot.start_time} - ${slot.end_time}`;
      slotEl.dataset.id = slot.id;

      if (selectedSlotId === slot.id) {
        slotEl.classList.add("selected");
      }

      slotEl.addEventListener("click", () => {
        selectedSlotId = slot.id;
        slotIdInputEl.value = slot.id;
        submitBtnEl.disabled = false;
        renderSlots(slots);
      });

      slotsContainerEl.appendChild(slotEl);
    });
  }

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
        <span class="material-symbols-outlined" style="font-size: 48px; color: var(--primary);">check_circle</span>
        <h3>Agendamento confirmado</h3>
        <p>
          Obrigado, <strong>${appointment.name}</strong>.<br />
          Seu agendamento foi recebido para <strong>${dateStr}</strong> às <strong>${timeStr}</strong>.
        </p>
        <p class="muted" style="font-size: 0.85rem;">
          Enviamos uma confirmação para <strong>${appointment.email}</strong>.<br />
          Código do agendamento: <code>${appointment.id}</code>
        </p>
        <a class="button" href="index.html">Voltar ao início</a>
      </div>
    `;
  }

  renderSelectedDate();
  loadAvailability();
}
