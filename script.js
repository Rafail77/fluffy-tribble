// === НАСТРОЙКИ МЕСЯЦА И ГОДА ===
const year = 2025; // Год
const month = 8;   // Месяц (0=январь → 8=сентябрь)

// === НАЗВАНИЯ МЕСЯЦЕВ ДЛЯ ВЫВОДА ===
const monthNames = [
  "январь", "февраль", "март", "апрель", "май", "июнь",
  "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь"
];

// === ВСТАВЛЯЕМ МЕСЯЦ И ГОД В ШАПКУ ===
document.getElementById("monthYear").textContent =
  `за ${monthNames[month]} ${year} года`;

// === ФУНКЦИЯ СОЗДАНИЯ ТАБЛИЦЫ ===
function generateTable(year, month) {
  const tbody = document.getElementById("tableBody"); // Находим <tbody>
  const totalCell = document.getElementById("totalCell"); // Ячейка итога
  tbody.innerHTML = ""; // Очищаем тело таблицы
  let total = 0; // Переменная для суммы

  const daysInMonth = new Date(year, month + 1, 0).getDate(); // Определяем количество дней

  // === Генерация строк ===
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day); // Создаем дату
    const weekday = date.getDay(); // День недели (0=вс, 6=сб)

    const tr = document.createElement("tr"); // Новая строка

    // --- Колонка День ---
    const tdDay = document.createElement("td");
    tdDay.textContent = day; // Число месяца
    if (weekday === 0 || weekday === 6) tdDay.classList.add("red"); // Красим выходные
    tr.appendChild(tdDay);

    // --- Колонка Работа ---
    const tdWork = document.createElement("td");
    tdWork.textContent = ""; // Пока пусто
    if (weekday === 0 || weekday === 6) tdWork.classList.add("red"); // Красим выходные
    tr.appendChild(tdWork);

    // --- Колонка Сумма компенсации ---
    const tdMoney = document.createElement("td");
    tdMoney.textContent = ""; // Пока пусто
    tdMoney.classList.add("money"); // Применяем класс для денег
    if (weekday === 0 || weekday === 6) tdMoney.classList.add("red"); // Красим выходные
    tr.appendChild(tdMoney);

    // --- Колонка Уволен, наказан... ---
    const tdFired = document.createElement("td");
    tdFired.textContent = ""; // Пока пусто
    if (weekday === 0 || weekday === 6) tdFired.classList.add("red"); // Красим выходные
    tr.appendChild(tdFired);

    tbody.appendChild(tr); // Добавляем строку в таблицу
  }

  // === Итог (сейчас = 0, пока нет сумм) ===
  totalCell.textContent = total.toLocaleString("ru-RU") + " ₸";
}

// === ЗАПУСК ФУНКЦИИ ===
generateTable(year, month);
