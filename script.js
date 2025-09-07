// -------------------- СОЗДАЁМ ДНИ СЕНТЯБРЯ 2025 --------------------
const table = document.getElementById("reportTable");               // Находим таблицу
const totalRow = table.querySelector(".total").closest("tr");       // Находим строку ИТОГО

const year = 2025;
const month = 8; // сентябрь (месяцы в JS считаются с 0 → январь=0, сентябрь=8)
const daysInMonth = 30; // в сентябре всегда 30 дней

for (let day = 1; day <= daysInMonth; day++) {
  const date = new Date(year, month, day);              // создаём дату
  const weekday = date.getDay();                        // 0=воскресенье, 6=суббота

  const newRow = table.insertRow(totalRow.rowIndex);    // вставляем перед строкой ИТОГО

  // --- Ячейка "День" ---
  const dayCell = newRow.insertCell();
  dayCell.textContent = day;

  // Если суббота (6) или воскресенье (0) → красным
  if (weekday === 0 || weekday === 6) {
    dayCell.classList.add("red");
  }

  // --- Ячейка "Работа" ---
  const workCell = newRow.insertCell();
  workCell.textContent = ""; // пока пустая

  // --- Ячейка "Сумма" ---
  const sumCell = newRow.insertCell();
  sumCell.classList.add("money");

  // --- Ячейка "Уволен, наказан..." ---
  const firedCell = newRow.insertCell();
  firedCell.textContent = "";
}

// -------------------- ПЕРЕСЧЁТ ИТОГО --------------------
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

recalcTotal(); // вызываем сразу

