// === 1. Добавляем пустые строки для пропущенных дат ===
const table = document.getElementById("reportTable");
const rows = table.querySelectorAll("tr");

// Находим строку TOTAL (последняя)
const totalRow = document.querySelector("#reportTable .total").closest("tr");

// Собираем все дни, которые уже есть
let existingDays = [];
rows.forEach(r => {
  const firstCell = r.querySelector("td:first-child");
  if (firstCell && !isNaN(parseInt(firstCell.textContent))) {
    existingDays.push(parseInt(firstCell.textContent));
  }
});

// Вставляем недостающие строки от 1 до 31
for (let day = 1; day <= 31; day++) {
  if (!existingDays.includes(day)) {
    const newRow = table.insertRow(totalRow.rowIndex);

    // 1 колонка — номер дня
    const dayCell = newRow.insertCell();
    dayCell.textContent = day;

    // 9 колонок — пустые (work done)
    const workCell = newRow.insertCell();
    workCell.colSpan = 9;
    workCell.textContent = "";

    // 2 колонки — пустая сумма
    const sumCell = newRow.insertCell();
    sumCell.colSpan = 2;
    sumCell.textContent = "";

    // последняя колонка
    const lastCell = newRow.insertCell();
    lastCell.textContent = "";
  }
}

// === 2. Подсчёт суммы ===
const moneyCells = document.querySelectorAll('#reportTable .money:not(.total)');

let total = 0;
moneyCells.forEach(cell => {
  let value = cell.textContent.replace(/[^\d,]/g, '').replace(',', '.');
  if (value) {
    total += parseFloat(value);
  }
});

const formattedTotal = total.toLocaleString('ru-RU', {minimumFractionDigits: 2, maximumFractionDigits: 2}) + " ₸";
document.getElementById('totalCell').textContent = formattedTotal;