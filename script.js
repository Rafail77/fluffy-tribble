// ==== Настройки ====
// Названия месяцев в родительном падеже (для шапки)
const monthNames = [
  "январь","февраль","март","апрель","май","июнь",
  "июль","август","сентябрь","октябрь","ноябрь","декабрь"
];

// ==== Элементы DOM ====
const table = document.getElementById('reportTable');
const tbody = table.querySelector('tbody');
const totalCell = document.getElementById('totalCell');
const monthSelect = document.getElementById('month');
const yearSelect = document.getElementById('year');
const headerMonth = document.getElementById('headerMonth');
const headerYear = document.getElementById('headerYear');
const downloadBtn = document.getElementById('downloadExcel');

// ==== Вспомогательные функции ====

// Форматируем число в денежный вид: "10 000.00 ₸"
function formatMoneyKZT(value) {
  return value.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ₸';
}

// Преобразуем строку из ячейки в число
function parseMoney(str) {
  if (!str) return 0;
  const cleaned = str.replace(/[^\d,.\-]/g, '').replace(',', '.'); // убираем лишние символы
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

// Проверка на выходной день
function isWeekend(date) {
  const day = date.getDay();
  return day === 0 || day === 6; // 0 - воскресенье, 6 - суббота
}

// ==== Генерация таблицы ====
function generateTable() {
  const month = parseInt(monthSelect.value, 10);
  const year = parseInt(yearSelect.value, 10);

  // Обновляем заголовок
  headerMonth.textContent = monthNames[month];
  headerYear.textContent = year;

  // Очищаем тело таблицы
  tbody.innerHTML = '';
  const daysInMonth = new Date(year, month + 1, 0).getDate(); // количество дней

  // Заполняем строки по дням
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const tr = document.createElement('tr');
    if (isWeekend(date)) tr.classList.add('weekend-row'); // красный цвет выходным

    // 1. Дата
    const tdDate = document.createElement('td');
    tdDate.textContent = day;
    tr.appendChild(tdDate);

    // 2. Проделанная работа
    const tdWork = document.createElement('td');
    tr.appendChild(tdWork);

    // 3. Сумма компенсации (редактируемая)
    const tdSum = document.createElement('td');
    tdSum.contentEditable = 'true';
    tdSum.classList.add('editable');
    // При выходе из ячейки — автоформат
    tdSum.addEventListener('blur', () => {
      const value = parseMoney(tdSum.textContent);
      tdSum.textContent = value ? formatMoneyKZT(value) : '';
      updateTotal();
    });
    tr.appendChild(tdSum);

    // 4. Уволен/наказан
    const tdStatus = document.createElement('td');
    tr.appendChild(tdStatus);

    tbody.appendChild(tr);
  }

  updateTotal(); // сразу обновляем итог
}

// ==== Пересчёт итогов ====
function updateTotal() {
  let total = 0;
  const sumCells = table.querySelectorAll('tbody td:nth-child(3)');
  sumCells.forEach(cell => total += parseMoney(cell.textContent));
  totalCell.textContent = formatMoneyKZT(total); // выводим красиво
}

// ==== Экспорт в Excel ====
function exportToExcel() {
  const wb = XLSX.utils.table_to_book(table, { sheet: "Отчёт" });
  // Делаем первую букву месяца заглавной
  const monthName = headerMonth.textContent.charAt(0).toUpperCase() + headerMonth.textContent.slice(1);
  XLSX.writeFile(wb, `Отчет_${monthName}_${headerYear.textContent}.xlsx`);
}

// ==== Слушатели ====
monthSelect.addEventListener('change', generateTable); // перестраиваем при выборе месяца
yearSelect.addEventListener('change', generateTable);  // перестраиваем при выборе года
downloadBtn.addEventListener('click', exportToExcel);  // кнопка скачать Excel

// ==== Старт ====
window.addEventListener('DOMContentLoaded', generateTable);
