// Получаем таблицу и элементы управления
const table = document.getElementById("reportTable");
const monthSelect = document.getElementById("monthSelect");
const yearSelect = document.getElementById("yearSelect");
const reportMonth = document.getElementById("reportMonth");
const reportYear = document.getElementById("reportYear");

// Названия месяцев для заголовка
const monthNames = [
  "январь","февраль","март","апрель","май","июнь",
  "июль","август","сентябрь","октябрь","ноябрь","декабрь"
];

// Функция генерации таблицы
function generateTable(year, month) {
  // Удаляем старые строки (кроме первых двух шапок)
  while (table.rows.length > 2) {
    table.deleteRow(2);
  }

  // Определяем число дней в месяце
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Обновляем текст в шапке
  reportMonth.textContent = monthNames[month];
  reportYear.textContent = year;

  // Генерируем строки с датами
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dayOfWeek = date.getDay(); // 0=вс, 6=сб

    const row = document.createElement("tr");

    // Ячейка даты
    const dateCell = document.createElement("td");
    dateCell.textContent = day;
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      dateCell.classList.add("weekend"); // Подсветка красным
    }
    row.appendChild(dateCell);

    // Ячейка работы
    const workCell = document.createElement("td");
    workCell.colSpan = 9;
    row.appendChild(workCell);

    // Ячейка компенсации
    const moneyCell = document.createElement("td");
    row.appendChild(moneyCell);

    // Ячейка уволен/наказан
    const punishCell = document.createElement("td");
    row.appendChild(punishCell);

    // Добавляем строку в таблицу
    table.appendChild(row);
  }
}

// Обработчики смены месяца и года
monthSelect.addEventListener("change", () => {
  generateTable(parseInt(yearSelect.value), parseInt(monthSelect.value));
});
yearSelect.addEventListener("change", () => {
  generateTable(parseInt(yearSelect.value), parseInt(monthSelect.value));
});

// Генерация таблицы при загрузке (сентябрь 2025)
generateTable(2025, 8);
