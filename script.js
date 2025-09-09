// ====== Константы и элементы страницы ======
const months = [ "Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь" ]; // Названия месяцев с заглавной

const monthSelect = document.getElementById('monthSelect'); // Элемент селекта месяца
const yearSelect = document.getElementById('yearSelect'); // Элемент селекта года
const reportTable = document.getElementById('reportTable'); // Таблица отчёта
const tbody = reportTable.querySelector('tbody'); // Тело таблицы для вставки строк
const headerMonth = document.getElementById('headerMonth'); // В шапке — месяц
const headerYear = document.getElementById('headerYear'); // В шапке — год
const totalCell = document.getElementById('totalCell'); // Ячейка итоговой суммы
const downloadBtn = document.getElementById('downloadExcel'); // Кнопка скачивания
const resetBtn = document.getElementById('resetData'); // Кнопка сброса данных

// Текущая дата по умолчанию
let current = new Date(); // Текущая дата
let currentMonth = current.getMonth(); // Текущий месяц (0-11)
let currentYear = current.getFullYear(); // Текущий год (numeric)

// ====== Вспомогательные функции форматирования ======
function formatMoneyKZT(num) { // Форматирует число -> "1 234 567.00 ₸"
  if (isNaN(num) || num === null) return "0 ₸"; // Безопасность
  return num.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " ₸"; // Локаль ru-RU
}

function parseMoneyToNumber(text) { // Берёт строку вида "1 234,00 ₸" или "1234.5" -> возвращает Number
  if (!text) return 0; // Пустая строка -> 0
  // Удаляем всё, кроме цифр, минуса и разделителей точка/запятая
  const cleaned = String(text).replace(/[^\d\-,.]/g, '').replace(/\s/g, ''); // Убираем валюту и пробелы
  // Заменим запятую на точку (если есть)
  const normalized = cleaned.replace(',', '.');
  const n = parseFloat(normalized); // Парсим в число
  return isNaN(n) ? 0 : n; // Возвращаем число либо 0
}

// ====== Инициализация селектов месяца/года ======
function fillSelectors() {
  // Заполняем селект месяцев
  months.forEach((m, idx) => { // Для каждого месяца
    const opt = document.createElement('option'); // Создаём option
    opt.value = idx; // value = индекс месяца
    opt.textContent = m; // Текст = название месяца
    if (idx === currentMonth) opt.selected = true; // Выбираем текущий
    monthSelect.appendChild(opt); // Вставляем в DOM
  });

  // Заполняем селект годов (по желанию: 2020–2030)
  for (let y = 2020; y <= 2030; y++) {
    const opt = document.createElement('option'); // option
    opt.value = y; // значение = год
    opt.textContent = y; // текст = год
    if (y === currentYear) opt.selected = true; // выбираем текущий год
    yearSelect.appendChild(opt); // вставляем
  }
}

// ====== Проверка выходного дня (сб/вс) ======
function isWeekend(year, month, day) {
  const d = new Date(year, month, day); // создаём объект Date
  const wd = d.getDay(); // 0 — воскресенье, 6 — суббота
  return wd === 0 || wd === 6; // true для выходных
}

// ====== Генерация таблицы для выбранного месяца/года ======
function generateTable(month, year) {
  // Обновляем заголовок шапки
  headerMonth.textContent = months[month]; // Пишем месяц
  headerYear.textContent = year; // Пишем год

  tbody.innerHTML = ''; // Очищаем тело таблицы

  // Сколько дней в месяце
  const daysInMonth = new Date(year, month + 1, 0).getDate(); // Последний день месяца

  // Создаём строки 1..daysInMonth
  for (let day = 1; day <= daysInMonth; day++) {
    const tr = document.createElement('tr'); // Новая строка

    // Если выходной — добавляем класс для стилей
    if (isWeekend(year, month, day)) tr.classList.add('weekend'); // Красим выходные

    // --- ячейка даты ---
    const tdDate = document.createElement('td'); // td
    tdDate.textContent = day; // число дня
    tr.appendChild(tdDate); // добавляем в строку

    // --- ячейка "Проделанная работа" (редактируемая) ---
    const tdWork = document.createElement('td'); // td
    tdWork.contentEditable = 'true'; // можно редактировать
    tdWork.setAttribute('data-type', 'work'); // тип для сохранения
    tr.appendChild(tdWork); // вставляем в строку

    // --- ячейка "Сумма компенсации" (редактируемая; форматируется) ---
    const tdSum = document.createElement('td'); // td
    tdSum.contentEditable = 'true'; // можно редактировать
    tdSum.classList.add('col-money'); // класс для визуала (жирнее, объёмнее)
    tdSum.setAttribute('data-type', 'sum'); // тип для сохранения
    // События: фокус (убрать формат), blur (отформатировать), input (проверить ввод и пересчитать)
    tdSum.addEventListener('focus', (e) => {
      // При фокусе показываем "сырой" числовой вид без разделителей и без ₸, чтобы удобно редактировать
      const raw = parseMoneyToNumber(e.target.textContent); // парсим текущее содержимое
      e.target.textContent = raw === 0 ? '' : String(raw); // если 0 -> пустая строка
    });
    tdSum.addEventListener('blur', (e) => {
      // При уходе фокуса форматируем значение (и пересчитываем итог)
      const n = parseMoneyToNumber(e.target.textContent); // парсим введённое
      e.target.textContent = formatMoneyKZT(n); // форматируем красиво
      updateTotal(); // обновляем итоговую сумму
      saveData(); // сохраняем в localStorage
    });
    tdSum.addEventListener('input', (e) => {
      // Во время ввода можно фильтровать лишние символы: оставляем только цифры, точку и запятую и минус
      const cleaned = e.target.textContent.replace(/[^0-9\.,\-]/g, ''); // убираем всё лишнее
      if (cleaned !== e.target.textContent) e.target.textContent = cleaned; // если мусор был — удаляем
      placeCaretAtEnd(e.target); // ставим курсор в конец (если браузер съезжает)
    });
    tr.appendChild(tdSum); // вставляем сумму в строку

    // --- ячейка "Уволен/наказан" (редактируемая) ---
    const tdStatus = document.createElement('td'); // td
    tdStatus.contentEditable = 'true'; // редактируемая
    tdStatus.setAttribute('data-type', 'status'); // для сохранения
    tr.appendChild(tdStatus); // вставляем в строку

    // Добавляем готовую строку в tbody
    tbody.appendChild(tr);
  }

  // После создания строк загружаем сохранённые данные (если есть) и форматируем суммы
  loadData(month, year);
  updateTotal(); // пересчитываем итог
}

// ====== Установка курсора в конец содержимого contentEditable (маленькая утилита) ======
function placeCaretAtEnd(el) {
  // Работает для современных браузеров
  el.focus(); // фокус
  if (typeof window.getSelection != "undefined" && typeof document.createRange != "undefined") {
    const range = document.createRange(); // создаём диапазон
    range.selectNodeContents(el); // выбираем содержимое
    range.collapse(false); // в конец
    const sel = window.getSelection(); // получаем селекцию
    sel.removeAllRanges(); // очищаем
    sel.addRange(range); // добавляем наш диапазон
  }
}

// ====== Обновление итоговой суммы (суммирование колонки "sum") ======
function updateTotal() {
  let total = 0; // аккумулятор
  // Берём все td с data-type="sum"
  tbody.querySelectorAll('td[data-type="sum"]').forEach(td => {
    const n = parseMoneyToNumber(td.textContent); // парсим значение
    total += n; // суммируем
    // если текущее содержимое пустое — оставляем пустым; иначе форматируем (для единообразия)
    if (td.textContent.trim() !== '') td.textContent = formatMoneyKZT(n);
  });
  totalCell.textContent = formatMoneyKZT(total); // пишем итог красиво
}

// ====== Сохранение данных текущего месяца/года в localStorage ======
function saveData() {
  const month = Number(monthSelect.value); // текущий месяц
  const year = Number(yearSelect.value); // текущий год

  // Проходим по всем строкам и собираем данные
  const data = []; // массив строк
  tbody.querySelectorAll('tr').forEach(tr => {
    const work = tr.querySelector('td[data-type="work"]').textContent || ''; // работа
    const sum = tr.querySelector('td[data-type="sum"]').textContent || ''; // сумма (уже форматированная)
    const status = tr.querySelector('td[data-type="status"]').textContent || ''; // статус
    data.push({ work, sum, status }); // пушим объект с тремя полями
  });

  // Ключ в localStorage уникален по месяцу/году
  const key = `report-${year}-${month}`;
  localStorage.setItem(key, JSON.stringify(data)); // сохраняем JSON-строкой
}

// ====== Загрузка данных для указанного месяца/года из localStorage ======
function loadData(month, year) {
  const key = `report-${year}-${month}`; // тот же ключ
  const raw = localStorage.getItem(key); // читаем
  if (!raw) return; // если ничего нет — выходим

  try {
    const data = JSON.parse(raw); // парсим
    // Применяем данные по строкам (если длина совпадает с количеством дней — применим корректно)
    const rows = tbody.querySelectorAll('tr');
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      const obj = data[i] || {}; // объект с полями или пустой
      const tdWork = r.querySelector('td[data-type="work"]'); // работа
      const tdSum = r.querySelector('td[data-type="sum"]'); // сумма
      const tdStatus = r.querySelector('td[data-type="status"]'); // статус

      if (obj.work !== undefined) tdWork.textContent = obj.work; // ставим текст работы
      if (obj.sum !== undefined) {
        // если в сохранении уже был формат — оставляем; иначе форматируем
        const num = parseMoneyToNumber(obj.sum); // парсим
        tdSum.textContent = obj.sum.trim() === '' ? '' : formatMoneyKZT(num); // форматируем
      }
      if (obj.status !== undefined) tdStatus.textContent = obj.status; // ставим статус
    }
  } catch (e) {
    console.error('Ошибка чтения сохранённых данных', e); // лог в консоль при ошибке
  }
}

// ====== Сброс данных для текущего месяца/года (удаление из localStorage) ======
resetBtn.addEventListener('click', () => {
  const month = Number(monthSelect.value); // текущий месяц
  const year = Number(yearSelect.value); // текущий год
  if (!confirm(`Сбросить данные для ${months[month]} ${year}? Это действие необратимо.`)) return; // подтверждение
  const key = `report-${year}-${month}`; // ключ
  localStorage.removeItem(key); // удаляем
  generateTable(month, year); // перегенерируем таблицу (чистую)
});

// ====== Экспорт таблицы в Excel (SheetJS) ======
downloadBtn.addEventListener('click', () => {
  // Имя файла: Отчет_Месяц_Год.xlsx, месяц с заглавной
  const month = Number(monthSelect.value);
  const year = Number(yearSelect.value);
  const fileName = `Отчет_${months[month]}_${year}.xlsx`; // имя файла

  // Используем SheetJS для конвертации HTML-таблицы в книгу
  const workbook = XLSX.utils.table_to_book(reportTable, { sheet: "Отчёт" }); // table -> book
  XLSX.writeFile(workbook, fileName); // Сохраняем файл
});

// ====== Слушатели селектов: перегенерировать таблицу при смене месяца/года ======
monthSelect.addEventListener('change', () => {
  const m = Number(monthSelect.value);
  const y = Number(yearSelect.value);
  // обновляем current переменные
  currentMonth = m;
  currentYear = y;
  generateTable(m, y); // создаём таблицу
});
yearSelect.addEventListener('change', () => {
  const m = Number(monthSelect.value);
  const y = Number(yearSelect.value);
  currentMonth = m;
  currentYear = y;
  generateTable(m, y);
});

// ====== При загрузке страницы: инициализация селектов и генерация таблицы ======
document.addEventListener('DOMContentLoaded', () => {
  fillSelectors(); // заполняем month/year селекты
  // Пометим селекты на текущие значения
  monthSelect.value = currentMonth; // выбираем текущий месяц
  yearSelect.value = currentYear; // выбираем текущий год
  generateTable(currentMonth, currentYear); // генерируем таблицу по умолчанию
});