// ==== Настройки месяца ====
const year = 2025;      // Год
const month = 8;        // Месяц (0 = Январь, 8 = Сентябрь, 9 = Октябрь и т.д.)

// ==== Получаем таблицу ====
const table = document.getElementById("reportTable");
const totalRow = table.querySelector(".total").closest("tr");

// ==== Узнаём количество дней в месяце ====
const daysInMonth = new Date(year, month + 1, 0).getDate(); 
// new Date(year, month+1, 0) → последний день месяца

// ==== Названия месяцев ====
const monthNames = [
  "январь", "февраль", "март", "апрель", "май", "июнь",
  "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь"
];

// ==== Подставляем месяц и год в заголовок ====
document.getElementById("monthName").textContent = monthNames[month];
document.getElementById("year").textContent = year;

// ==== Генерация строк таблицы ====
for (let day = 1; day <= daysInMonth; day++) {
  const newRow = table.insertRow(totalRow.rowIndex);

  // Дата
  const dateCell = newRow.insertCell();
  dateCell.textContent = day;

  // Проверяем день недели (0 = вс, 6 = сб)
  const weekday = new Date(year, month, day).getDay();
  if (weekday === 0 || weekday === 6) {
    dateCell.classList.add("weekend"); // Красим выходные
  }

  // Проделанная работа
  const workCell = newRow.insertCell();
  workCell.classList.add("wide");
  workCell.innerHTML = ""; // Можно заполнять позже

  // Сумма
  const sumCell = newRow.insertCell();
  sumCell.classList.add("money");
  sumCell.innerHTML = ""; // Суммы добавляются вручную

  // Уволен/наказан
  const lastCell = newRow.insertCell();
  lastCell.innerHTML = ""; // Тоже можно заполнять позже
}

// ==== Подсчёт суммы TOTAL ====
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

// Считаем при загрузке
recalcTotal();