// ====== Конфигурация / Названия месяцев ======
const monthNames = [ // Массив с названиями месяцев (для шапки)
  "январь","февраль","март","апрель","май","июнь",
  "июль","август","сентябрь","октябрь","ноябрь","декабрь"
]; // Конец массива месяцев

// ====== Получаем элементы DOM ======
const table = document.getElementById('reportTable'); // Таблица отчёта по id
const tbody = table.querySelector('tbody'); // Тело таблицы (куда вставляем строки)
const totalCell = document.getElementById('totalCell'); // Ячейка итога по суммам
const monthSelect = document.getElementById('month'); // Селект месяца
const yearSelect = document.getElementById('year'); // Селект года
const headerMonth = document.getElementById('headerMonth'); // Элемент с месяцом в шапке
const headerYear = document.getElementById('headerYear'); // Элемент с годом в шапке
const downloadBtn = document.getElementById('downloadExcel'); // Кнопка скачивания Excel

// ====== Вспомогательные функции форматирования ======
function formatMoneyKZT(value) { // Форматируем число в вид "10 000.00 ₸"
  return value.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ₸'; // Возвращаем строку с ₽ (знак KZT)
} // Конец formatMoneyKZT

function parseMoney(str) { // Парсим из текста число (работает с "10 000,00 ₸" или "10000.00")
  if (!str) return 0; // Если пустая строка — возвращаем 0
  const cleaned = String(str).replace(/[^\d,.\-]/g, '').replace(',', '.'); // Оставляем цифры, точку/запятую, минус
  const num = parseFloat(cleaned); // Превращаем в число
  return isNaN(num) ? 0 : num; // Если NaN — 0, иначе число
} // Конец parseMoney

function isWeekend(date) { // Проверяем, суббота/воскресенье ли данная дата
  const day = date.getDay(); // 0 — вс, 6 — сб
  return day === 0 || day === 6; // true если выходной
} // Конец isWeekend

// ====== Удаляем форматирование (для удобства редактирования) ======
function unformatCellForEdit(cell) { // При фокусе переводим форматированную сумму в "чистую" цифру
  const value = parseMoney(cell.textContent); // Парсим текущее содержимое
  cell.textContent = value ? String(value).replace('.', ',') : ''; // Ставим значение без символов, с запятой как разделителем дробной части
} // Конец unformatCellForEdit

// ====== Генерация таблицы для выбранного месяца/года ======
function generateTable() {
  const month = parseInt(monthSelect.value, 10); // Получаем месяц из селекта (0-11)
  const year = parseInt(yearSelect.value, 10); // Получаем год из селекта

  headerMonth.textContent = monthNames[month]; // Устанавливаем название месяца в шапку
  headerYear.textContent = year; // Устанавливаем год в шапку

  tbody.innerHTML = ''; // Очищаем тело таблицы перед заполнением
  const daysInMonth = new Date(year, month + 1, 0).getDate(); // Вычисляем количество дней в месяце

  for (let day = 1; day <= daysInMonth; day++) { // Проходим по всем дням месяца
    const date = new Date(year, month, day); // Создаём объект Date для данного дня
    const tr = document.createElement('tr'); // Создаём строку таблицы

    if (isWeekend(date)) tr.classList.add('weekend-row'); // Добавляем класс weekend-row для подсветки выходных

    // ----- Колонка 1: Дата -----
    const tdDate = document.createElement('td'); // Создаём ячейку даты
    tdDate.textContent = day; // Вставляем номер дня
    tr.appendChild(tdDate); // Добавляем ячейку в строку

    // ----- Колонка 2: Проделанная работа (оставляем пустой для ввода вручную / можно вписать) -----
    const tdWork = document.createElement('td'); // Создаём ячейку для описания работы
    tdWork.contentEditable = 'true'; // Делаем содержимое редактируемым (чтобы можно было вручную заполнить)
    tdWork.classList.add('work-cell'); // Класс для возможной стилизации
    tr.appendChild(tdWork); // Добавляем ячейку в строку

    // ----- Колонка 3: Сумма компенсации (редактируемая) -----
    const tdSum = document.createElement('td'); // Создаём ячейку для суммы
    tdSum.contentEditable = 'true'; // Делаем её редактируемой
    tdSum.classList.add('editable'); // Добавляем класс editable (стили для фокуса)
    tdSum.classList.add('sum-cell'); // Доп. класс — удобно для выборки
    // При фокусе убираем форматирование, чтобы удобней редактировать
    tdSum.addEventListener('focus', (e) => { unformatCellForEdit(e.target); }); // На focus — показываем "сырое" число
    // При потере фокуса форматируем и пересчитываем итог
    tdSum.addEventListener('blur', (e) => { // На blur — форматируем значение
      const value = parseMoney(e.target.textContent); // Парсим число
      e.target.textContent = value ? formatMoneyKZT(value) : ''; // Форматируем в KZT или очищаем
      updateTotal(); // Пересчитываем итоговую сумму
    }); // Закрываем blur listener
    // При вставке (paste) вставляем только числа корректно
    tdSum.addEventListener('paste', (ev) => { // Обрабатываем вставку текста
      ev.preventDefault(); // Отменяем стандартную вставку
      const text = (ev.clipboardData || window.clipboardData).getData('text'); // Получаем текст из буфера
      const v = parseMoney(text); // Парсим вставленный текст
      ev.target.textContent = v ? String(v).replace('.', ',') : ''; // Вставляем "сырое" число для редактирования
    }); // Закрываем paste listener
    // Обработка Enter — при нажатии Enter завершаем редактирование
    tdSum.addEventListener('keydown', (ev) => { if (ev.key === 'Enter') { ev.preventDefault(); ev.target.blur(); } }); // Enter = сохранить и уйти из редактирования
    tr.appendChild(tdSum); // Добавляем ячейку суммы в строку

    // ----- Колонка 4: Уволен / наказан (редактируемая) -----
    const tdStatus = document.createElement('td'); // Создаём ячейку статуса
    tdStatus.contentEditable = 'true'; // Делаем её редактируемой (при необходимости заполнения)
    tr.appendChild(tdStatus); // Добавляем ячейку статуса в строку

    tbody.appendChild(tr); // Вставляем сформированную строку в тело таблицы
  } // Конец цикла по дням

  updateTotal(); // После создания всех строк пересчитываем итог
} // Конец функции generateTable

// ====== Функция пересчёта итоговой суммы ======
function updateTotal() {
  let total = 0; // Инициализируем сумму
  const sumCells = table.querySelectorAll('tbody td.sum-cell'); // Получаем все ячейки суммы в tbody
  sumCells.forEach(cell => { // Перебор всех ячеек суммы
    total += parseMoney(cell.textContent); // Добавляем распарсенное число в общий итог
  }); // Конец перебора
  totalCell.textContent = formatMoneyKZT(total); // Выводим отформатированную итоговую сумму
} // Конец updateTotal

// ====== Экспорт таблицы в Excel с автоматически сформированным именем ======
function exportToExcel() {
  // Формируем рабочую книгу из DOM-таблицы с помощью библиотеки SheetJS
  const wb = XLSX.utils.table_to_book(table, { sheet: "Отчёт" }); // Создаём книгу с листом "Отчёт"
  // Формируем имя файла: делаем первую букву месяца заглавной
  const monthName = headerMonth.textContent.charAt(0).toUpperCase() + headerMonth.textContent.slice(1); // Например "Сентябрь"
  const fileName = `Отчет_${monthName}_${headerYear.textContent}.xlsx`; // Итоговое имя файла
  XLSX.writeFile(wb, fileName); // Сохраняем файл у пользователя
} // Конец exportToExcel

// ====== Слушатели событий (интерактив) ======
monthSelect.addEventListener('change', generateTable); // При изменении месяца — перестраиваем таблицу автоматически
yearSelect.addEventListener('change', generateTable); // При изменении года — перестраиваем таблицу автоматически
downloadBtn.addEventListener('click', exportToExcel); // При клике на кнопку — экспортируем текущую таблицу в Excel

// ====== Инициализация при загрузке страницы ======
window.addEventListener('DOMContentLoaded', generateTable); // При загрузке DOM — генерируем таблицу сразу
