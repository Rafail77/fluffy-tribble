// -------------------- НАСТРОЙКИ --------------------
const table = document.getElementById("reportTable");  // Находим таблицу
const totalRow = table.querySelector(".total").closest("tr"); // Находим строку TOTAL

// Месяц сентябрь 2025
const year = 2025;              
const month = 8;  // В JS месяцы начинаются с 0 (январь=0, сентябрь=8)
const daysInMonth = 30;          // В сентябре 30 дней

// -------------------- СОЗДАНИЕ СТРОК --------------------
for (let day = 1; day <= daysInMonth; day++) {
  const date = new Date(year, month, day);     // Создаём дату
  const weekday = date.getDay();               // День недели (0=вс, 6=сб)

  const newRow = table.insertRow(totalRow.rowIndex); // Вставляем строку перед TOTAL

  // Если суббота или воскресенье → добавляем класс weekend
  if (weekday === 0 || weekday === 6) {
    newRow.classList.add("weekend");
  }

  // ---- Первая ячейка (номер дня) ----
  const dayCell = newRow.insertCell();
  dayCell.textContent = day;  // вставляем число

  // ---- Ячейка "работа" (colspan=9) ----
  const workCell = newRow.insertCell();
  workCell.colSpan = 9;
  workCell.innerHTML = "";    // по умолчанию пусто

  // ---- Ячейка "сумма" (colspan=2) ----
  const sumCell = newRow.insertCell();
  sumCell.colSpan = 2;
  sumCell.classList.add("money");
  sumCell.innerHTML = "";     // пусто

  // ---- Последняя ячейка ----
  const lastCell = newRow.insertCell();
  lastCell.innerHTML = "";    // пусто
}

// -------------------- ПЕРЕСЧЁТ TOTAL --------------------
function recalcTotal() {
  const moneyCells = document.querySelectorAll('#reportTable .money:not(.total)');
  let total = 0;

  moneyCells.forEach(cell => {
    let value = cell.textContent.replace(/[^\d,]/g, '').replace(',', '.'); 
    if (value) total += parseFloat(value);
  });

  const formattedTotal = total.toLocaleString('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }) + " ₸";

  document.getElementById('totalCell').textContent = formattedTotal;
}