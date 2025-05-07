
import flatpickr from "flatpickr";

import "flatpickr/dist/flatpickr.min.css";

import iziToast from "izitoast";

import "izitoast/dist/css/iziToast.min.css";

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    console.log(selectedDates[0]);
  },
};
// function convertMs(ms) {
//   // Number of milliseconds per unit of time
//   const second = 1000;
//   const minute = second * 60;
//   const hour = minute * 60;
//   const day = hour * 24;

//   // Remaining days
//   const days = Math.floor(ms / day);
//   // Remaining hours
//   const hours = Math.floor((ms % day) / hour);
//   // Remaining minutes
//   const minutes = Math.floor(((ms % day) % hour) / minute);
//   // Remaining seconds
//   const seconds = Math.floor((((ms % day) % hour) % minute) / second);

//   return { days, hours, minutes, seconds };
// }

// console.log(convertMs(2000)); // {days: 0, hours: 0, minutes: 0, seconds: 2}
// console.log(convertMs(140000)); // {days: 0, hours: 0, minutes: 2, seconds: 20}
// console.log(convertMs(24140000)); // {days: 0, hours: 6 minutes: 42, seconds: 20}

const refs = {
  input: document.querySelector("#datetime-picker"),
  startBtn: document.querySelector("[data-start]"),
  days: document.querySelector("[data-days]"),
  hours: document.querySelector("[data-hours]"),
  minutes: document.querySelector("[data-minutes]"),
  seconds: document.querySelector("[data-seconds]"),
};

let selectedDate = null;
let timerId = null;

// Изначально кнопка неактивна
refs.startBtn.disabled = true;

// Настройки flatpickr
flatpickr(refs.input, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const picked = selectedDates[0];
    if (picked <= new Date()) {
      iziToast.error({
        title: "Error",
        message: "Please choose a date in the future",
        position: "topRight",
      });
      refs.startBtn.disabled = true;
      return;
    }
    selectedDate = picked;
    refs.startBtn.disabled = false;
  },
});

// Функция для форматирования "0х"
function addLeadingZero(value) {
  return String(value).padStart(2, "0");
}

// Преобразуем миллисекунды в дни, часы, минуты, секунды
function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour   = minute * 60;
  const day    = hour * 24;

  const days    = Math.floor(ms / day);
  const hours   = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

// Обновление интерфейса
function updateTimer({ days, hours, minutes, seconds }) {
  refs.days.textContent    = addLeadingZero(days);
  refs.hours.textContent   = addLeadingZero(hours);
  refs.minutes.textContent = addLeadingZero(minutes);
  refs.seconds.textContent = addLeadingZero(seconds);
}

// Старт
refs.startBtn.addEventListener("click", () => {
  refs.startBtn.disabled = true;
  refs.input.disabled    = true;

  timerId = setInterval(() => {
    const delta = selectedDate - new Date();
    if (delta <= 0) {
      clearInterval(timerId);
      updateTimer({ days:0, hours:0, minutes:0, seconds:0 });
      refs.input.disabled = false;
      return;
    }
    updateTimer(convertMs(delta));
  }, 1000);
});
