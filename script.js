// === Функция генерации таблицы ===
function generateTable() {
  const tbody = document.getElementById("tableBody"); // Находим тело таблицы
  const totalCell = document.getElementById("totalCell"); // Ячейка для итога

  tbody.innerHTML = ""; // Очищаем тело таблицы (если уже что-то было)
  let total = 0; // Переменная для общей суммы компенсаций

  const year = 2025; // Год
  const month = 8; // Месяц (0 = январь → 8 = сентябрь)
  const daysInMonth = new Date(year, month + 1, 0).getDate(); // Кол-во дней в месяце

  // Цикл по всем дням месяца
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day); // Создаем дату
    const weekday = date.getDay(); // Определяем день недели (0=вс, 6=сб)

    const tr = document.createElement("tr"); // Создаем строку

    // === Ячейка "День" ===
    const tdDay = document.createElement("td");
    tdDay.textContent = day; // Записываем число месяца
    if (weekday === 0 || weekday === 6) tdDay.classList.add("red"); // Если суббота/воскресенье → красный
    tr.appendChild(tdDay); // Добавляем в строку

    // === Ячейка "Проделанная работа" ===
    const tdWork = document.createElement("td");
    tdWork.textContent = ""; // Оставляем пустым (для заполнения вручную)
    if (weekday === 0 || weekday === 6) tdWork.classList.add("red"); // Красим выходные
    tr.appendChild(tdWork);

    // === Ячейка "Сумма компенсации" ===
    const tdMoney = document.createElement("td");
    tdMoney.textContent = ""; // Сумма (пока пусто, можно вписывать вручную)
    tdMoney.classList.add("money"); // Стилизация для чисел
    if (weekday === 0 || weekday === 6) tdMoney.classList.add("red"); // Красим выходные
    tr.appendChild(tdMoney);

    // === Ячейка "Уволен, наказан..." ===
    const tdFired = document.createElement("td");
    tdFired.textContent = ""; // Пусто (для ручного заполнения)
    if (weekday === 0 || weekday === 6) tdFired.classList.add("red"); // Красим выходные
    tr.appendChild(tdFired);

    tbody.appendChild(tr); // Добавляем строку в таблицу
  }

  // === Итоговая сумма ===
  totalCell.textContent = total.toLocaleString("ru-RU") + " ₸"; // Вывод суммы (пока 0 ₸)
}

// === Запускаем функцию при загрузке страницы ===
generateTable();
