// ==== Названия месяцев (нижний регистр для подстановки, можно капитализировать при нужде) ====
const monthNames = [ "январь","февраль","март","апрель","май","июнь","июль","август","сентябрь","октябрь","ноябрь","декабрь" ]; // Массив названий месяцев

// ==== Получаем элементы DOM ====
const table = document.getElementById('reportTable'); // Таблица по id
const tbody = table.querySelector('tbody'); // Тело таблицы (куда будут вставляться строки)
const totalCell = document.getElementById('totalCell'); // Ячейка итоговой суммы
const monthSelect = document.getElementById('month'); // Селект для месяца
const yearSelect = document.getElementById('year'); // Селект для года
const headerMonth = document.getElementById('headerMonth'); // Элемент в заголовке для месяца
const headerYear = document.getElementById('headerYear'); // Элемент в заголовке для года
const downloadBtn = document.getElementById('downloadExcel'); // Кнопка скачивания Excel
const clearBtn = document.getElementById('clearBtn'); // Кнопка очистки месяца

// ==== Утилиты: форматирование и парсинг сумм ====
function formatMoneyKZT(value) { // Форматируем число в вид "1 234,00 ₸"
  return value.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ₸'; // Возвращаем строку с символом валюты
}
function parseMoney(str) { // Парсим строку (возможно с пробелами, NBSP, ₸, запятыми) в число
  if (!str) return 0; // Пустая строка → 0
  // Убираем NBSP и пробелы, удаляем символ ₸, заменяем запятые на точки и оставляем цифры, точку и минус
  const s = String(str)
    .replace(/\u00A0/g, '') // Удаляем непереносимый пробел
    .replace(/\s/g, '')      // Удаляем обычные пробелы
    .replace(/₸/g, '')       // Удаляем символ тенге если есть
    .replace(/,/g, '.')      // Заменяем запятую на точку (десятичный разделитель)
    .replace(/[^\d.\-]/g, ''); // Оставляем только цифры, точку и минус
  const num = parseFloat(s); // Парсим в число
  return isNaN(num) ? 0 : num; // Если NaN → 0
}

// ==== Проверка выходных (суббота/воскресенье) ====
function isWeekend(date) { // Принимаем объект Date
  const day = date.getDay(); // 0 — воскресенье, 6 — суббота
  return day === 0 || day === 6; // true если weekend
}

// ==== Работа с localStorage: ключ для текущего месяца/года ====
function storageKey() { // Формируем ключ localStorage для выбранного месяца и года
  return `report_${monthSelect.value}_${yearSelect.value}`; // Например report_8_2025
}
function saveTableData() { // Сохраняем содержимое таблицы (строки) в localStorage
  const data = []; // Массив для строк
  tbody.querySelectorAll('tr').forEach(tr => { // Проходим по каждой строке
    const row = []; // Массив для ячеек строки
    tr.querySelectorAll('td').forEach(td => row.push(td.textContent)); // Сохраняем текст каждой ячейки
    data.push(row); // Добавляем строку
  });
  localStorage.setItem(storageKey(), JSON.stringify(data)); // Сохраняем сериализованный массив
}
function loadTableData() { // Подгружаем данные из localStorage
  const saved = localStorage.getItem(storageKey()); // Получаем по ключу
  return saved ? JSON.parse(saved) : null; // Возвращаем распарсенный объект или null
}

// ==== Генерация таблицы для выбранного месяца/года ====
function generateTable() {
  const month = parseInt(monthSelect.value, 10); // Текущий месяц (0-11)
  const year = parseInt(yearSelect.value, 10); // Текущий год

  // Обновляем шапку с месяцем и годом
  headerMonth.textContent = monthNames[month]; // Вставляем название месяца
  headerYear.textContent = year; // Вставляем год

  tbody.innerHTML = ''; // Очищаем текущее тело таблицы

  const daysInMonth = new Date(year, month + 1, 0).getDate(); // Количество дней в месяце

  const savedData = loadTableData(); // Пытаемся загрузить ранее сохранённые данные для этого месяца/года

  // Создаём строки по дням
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day); // Объект даты для проверки выходных
    const tr = document.createElement('tr'); // Создаём строку
    if (isWeekend(date)) tr.classList.add('weekend-row'); // Помечаем выходные строкой

    // --- Колонка с датой ---
    const tdDate = document.createElement('td'); // Ячейка даты
    tdDate.textContent = day; // Записываем номер дня
    tr.appendChild(tdDate); // Вставляем в строку

    // --- Колонка "Проделанная работа" ---
    const tdWork = document.createElement('td'); // Ячейка работы
    tdWork.contentEditable = 'true'; // Делаем редактируемой
    tdWork.classList.add('editable'); // Класс для стилей
    tr.appendChild(tdWork); // Вставляем в строку

    // --- Колонка "Сумма компенсации" ---
    const tdSum = document.createElement('td'); // Ячейка суммы
    tdSum.contentEditable = 'true'; // Делаем редактируемой
    tdSum.classList.add('editable'); // Класс для стилей

    // При вводе — просто пересчитываем итого и сохраняем (не форматируем чтобы не мешать печати)
    tdSum.addEventListener('input', () => { updateTotal(); saveTableData(); }); // Input: пересчёт и сохранение

    // При фокусе — показываем «сырой» числовой ввод (удаляем форматирование), чтобы легче редактировать
    tdSum.addEventListener('focus', (e) => {
      const v = parseMoney(e.target.textContent); // Парсим текущую строку
      if (v) { e.target.textContent = (v % 1 === 0) ? String(Math.trunc(v)) : String(v); } // Показ целого или дробного числа без разделителей
    });

    // При потере фокуса — форматируем значение в красивый вид "1 234,00 ₸" и сохраняем
    tdSum.addEventListener('blur', (e) => {
      const v = parseMoney(e.target.textContent); // Парсим введённую строку
      if (v) { e.target.textContent = formatMoneyKZT(v); } else { e.target.textContent = ''; } // Форматируем или очищаем
      updateTotal(); // Обновляем итог
      saveTableData(); // Сохраняем в localStorage
    });

    tr.appendChild(tdSum); // Вставляем ячейку суммы в строку

    // --- Колонка "Уволен/наказан" ---
    const tdStatus = document.createElement('td'); // Ячейка статуса
    tdStatus.contentEditable = 'true'; // Можно редактировать
    tdStatus.classList.add('editable'); // Класс
    tr.appendChild(tdStatus); // Вставляем в строку

    tbody.appendChild(tr); // Вставляем готовую строку в tbody
  }

  // Если были сохранённые данные, то восстанавливаем их (кроме колонки даты)
  if (savedData) {
    tbody.querySelectorAll('tr').forEach((tr, i) => {
      if (!savedData[i]) return; // Если нет данных для этой строки — пропускаем
      tr.querySelectorAll('td').forEach((td, j) => {
        if (j === 0) return; // Не перезаписываем колонку даты
        td.textContent = savedData[i][j] || ''; // Восстанавливаем значение
      });
    });
  }

  updateTotal(); // После генерации пересчитываем итог
}

// ==== Пересчёт итоговой суммы (без изменения содержимого ячеек) ====
function updateTotal() {
  let total = 0; // Накопитель
  const sumCells = table.querySelectorAll('tbody td:nth-child(3)'); // Все ячейки сумм (3-я колонка)
  sumCells.forEach(cell => {
    total += parseMoney(cell.textContent); // Суммируем парсенные значения
  });
  totalCell.textContent = formatMoneyKZT(total); // Записываем красиво форматированный итог
  // НЕ меняем формат ячеек здесь — форматирование ячеек делается на blur событиях
}

// ==== Экспорт в Excel с автоматическим именем файла ====
function capitalizeFirst(s) { // Помощник для капитализации первой буквы
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function exportToExcel() {
  const wb = XLSX.utils.table_to_book(table, { sheet: "Отчёт" }); // Преобразуем таблицу в книгу
  const month = capitalizeFirst(monthNames[parseInt(monthSelect.value, 10)]); // Капитализируем месяц
  const year = yearSelect.value; // Год
  const filename = `Отчет_${month}_${year}.xlsx`; // Формируем имя файла
  XLSX.writeFile(wb, filename); // Сохраняем файл
}

// ==== Очистка таблицы для выбранного месяца (с подтверждением) ====
function clearMonthData() {
  const month = capitalizeFirst(monthNames[parseInt(monthSelect.value, 10)]); // Текущий месяц
  const year = yearSelect.value; // Текущий год

  // Показываем стандартный confirm — если пользователь подтвердил, очищаем
  const confirmMsg = `Вы уверены, что хотите очистить все записи за ${month} ${year}? Это действие нельзя отменить.`; // Текст подтверждения
  if (!confirm(confirmMsg)) return; // Если отменил — ничего не делаем

  // Удаляем данные из localStorage
  localStorage.removeItem(storageKey());

  // Очищаем все редактируемые ячейки (кроме даты)
  tbody.querySelectorAll('tr').forEach(tr => {
    tr.querySelectorAll('td').forEach((td, i) => {
      if (i === 0) return; // не трогаем дату
      td.textContent = ''; // очищаем текст
    });
  });

  updateTotal(); // Обновляем итог после очистки
  saveTableData(); // Сохраняем (пустую) таблицу
  alert(`Данные за ${month} ${year} успешно очищены.`); // Уведомление пользователю
}

// ==== Слушатели событий ====
monthSelect.addEventListener('change', generateTable); // При смене месяца — перестраиваем таблицу
yearSelect.addEventListener('change', generateTable); // При смене года — перестраиваем таблицу
downloadBtn.addEventListener('click', exportToExcel); // Скачивание Excel
clearBtn.addEventListener('click', clearMonthData); // Кнопка очистки — обработчик

// ==== Инициализация при загрузке страницы ====
window.addEventListener('DOMContentLoaded', generateTable); // При загрузке DOM генерируем таблицу
