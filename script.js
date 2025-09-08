// Функция генерации таблицы
function generateTable() {
  const month = parseInt(document.getElementById("month").value); // Получаем выбранный месяц
  const year = parseInt(document.getElementById("year").value);   // Получаем выбранный год

  const tbody = document.querySelector("#reportTable tbody");
  tbody.innerHTML = ""; // Очищаем таблицу перед перегенерацией

  // Получаем количество дней в месяце
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day); // Создаем объект даты
    const dayOfWeek = date.getDay(); // День недели (0 = воскресенье, 6 = суббота)

    // Создаем строку таблицы
    const row = document.createElement("tr");

    // Ячейка с датой
    const dateCell = document.createElement("td");
    dateCell.textContent = day;
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      dateCell.classList.add("weekend"); // Красный цвет для сб/вс
    }
    row.appendChild(dateCell);

    // Ячейка "Проделанная работа"
    const workCell = document.createElement("td");
    workCell.textContent = ""; // Пользователь вписывает вручную
    row.appendChild(workCell);

    // Ячейка "Сумма компенсации"
    const sumCell = document.createElement("td");
    sumCell.contentEditable = "true"; // Можно редактировать прямо в таблице
    sumCell.addEventListener("input", updateTotal); // Пересчет при изменении
    row.appendChild(sumCell);

    // Ячейка "Уволен / Наказан"
    const statusCell = document.createElement("td");
    statusCell.textContent = "";
    row.appendChild(statusCell);

    tbody.appendChild(row);
  }

  updateTotal(); // Считаем сумму при генерации
}

// Функция подсчета суммы
function updateTotal() {
  let total = 0;
  document.querySelectorAll("#reportTable tbody tr td:nth-child(3)").forEach(cell => {
    const value = parseFloat(cell.textContent) || 0;
    total += value;
  });
  document.getElementById("totalSum").textContent = total.toFixed(2);
}

// При загрузке страницы сразу строим таблицу
window.onload = generateTable;
