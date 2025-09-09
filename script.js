// ==== Настройки ====
const monthNames = [
  "январь","февраль","март","апрель","май","июнь",
  "июль","август","сентябрь","октябрь","ноябрь","декабрь"
];

// ==== Элементы ====
const table = document.getElementById('reportTable');
const tbody = table.querySelector('tbody');
const totalCell = document.getElementById('totalCell');
const monthSelect = document.getElementById('month');
const yearSelect = document.getElementById('year');
const headerMonth = document.getElementById('headerMonth');
const headerYear = document.getElementById('headerYear');
const downloadBtn = document.getElementById('downloadExcel');

// ==== Функции ====
function formatMoneyKZT(value) {
  return value.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ₸';
}
function parseMoney(str) {
  if (!str) return 0;
  const cleaned = str.replace(/[^\d,.\-]/g, '').replace(',', '.');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}
function isWeekend(date) {
  const day = date.getDay();
  return day === 0 || day === 6;
}

// ==== Генерация таблицы ====
function generateTable() {
  const month = parseInt(monthSelect.value, 10);
  const year = parseInt(yearSelect.value, 10);

  headerMonth.textContent = monthNames[month];
  headerYear.textContent = year;

  tbody.innerHTML = '';
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const tr = document.createElement('tr');
    if (isWeekend(date)) tr.classList.add('weekend-row');

    const tdDate = document.createElement('td');
    tdDate.textContent = day;
    tr.appendChild(tdDate);

    const tdWork = document.createElement('td');
    tr.appendChild(tdWork);

    const tdSum = document.createElement('td');
    tdSum.contentEditable = 'true';
    tdSum.classList.add('editable');
    tdSum.addEventListener('blur', () => {
      let val = parseMoney(tdSum.textContent);
      if (val > 0) {
        tdSum.textContent = formatMoneyKZT(val);
      } else {
        tdSum.textContent = "";
      }
      updateTotal();
    });
    tr.appendChild(tdSum);

    const tdStatus = document.createElement('td');
    tr.appendChild(tdStatus);

    tbody.appendChild(tr);
  }
  updateTotal();
}

// ==== Пересчёт итогов ====
function updateTotal() {
  let total = 0;
  const sumCells = table.querySelectorAll('tbody td:nth-child(3)');
  sumCells.forEach(cell => total += parseMoney(cell.textContent));
  totalCell.textContent = formatMoneyKZT(total);
}

// ==== Экспорт в Excel ====
function exportToExcel() {
  const wb = XLSX.utils.table_to_book(table, { sheet: "Отчёт" });
  const month = headerMonth.textContent.charAt(0).toUpperCase() + headerMonth.textContent.slice(1);
  const filename = `Отчет_${month}_${headerYear.textContent}.xlsx`;
  XLSX.writeFile(wb, filename);
}

// ==== Слушатели ====
monthSelect.addEventListener('change', generateTable);
yearSelect.addEventListener('change', generateTable);
downloadBtn.addEventListener('click', exportToExcel);

// ==== Старт ====
window.addEventListener('DOMContentLoaded', generateTable);
