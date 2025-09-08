// Названия месяцев для отображения в шапке
const monthNames = [
  "январь", "февраль", "март", "апрель", "май", "июнь",
  "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь"
];

// Генерация таблицы
function generateTable() {
  const month = parseInt(document.getElementById("month").value); // выбранный месяц
  const year = parseInt(document.getElementById("year").value);   // выбранный год

  // Обновляем шапку отчета
  document.getElementById("currentMonth").textContent = monthNames[month];
  document.getElementById("currentYear").textContent = year;

  const tbody = document.querySelector("#reportTable tbody");
  tbody.innerHTML = ""; // очищаем старые строки

  const daysInMonth = new Date(year, month + 1, 0).getDate(); // количество дней

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dayOfWeek = date.getDay(); // день недели (0 - воскресенье, 6 - суббота)

    const row = document.createElement("tr");

    // Дата
    const dateCell = document.createElement("td");
    dateCell.textContent = day;
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      dateCell.classList.add("weekend"); // выходные красным
    }
    row.appendChild(dateCell);

    // Работа
    const workCell = document.createElement("td");
    workCell.textContent = "";
    row.appendChild(workCell);

    // Сумма компенсации
    const sumCell = document.createElement("td");
    sumCell.contentEditable = "true"; // редактируемое поле
    sumCell.addEventListener("input", updateTotal); // пересчет
    row.appendChild(sumCell);

    // Уволен / Наказан
    const statusCell = document.createElement("td");
    statusCell.textContent = "";
    row.appendChild(statusCell);

    tbody.appendChild(row);
  }

  updateTotal(); // считаем сумму
}

// Подсчет суммы
function updateTotal() {
  let total = 0;
  document.querySelectorAll("#reportTable tbody tr td:nth-child(3)").forEach(cell => {
    const value = parseFloat(cell.textContent) || 0;
    total += value;
  });
  document.getElementById("totalSum").textContent = total.toFixed(2);
}

// Экспорт в Excel
function exportToExcel() {
  const table = document.getElementById("reportTable"); // берем таблицу
  const wb = XLSX.utils.table_to_book(table, {sheet:"Отчет"}); // создаем книгу
  XLSX.writeFile(wb, "Отчет.xlsx"); // скачиваем
}

// При загрузке страницы сразу строим таблицу
window.onload = generateTable;
