// Находим таблицу
const table = document.getElementById("reportTable");

// Строка ИТОГО
const totalRow = document.getElementById("totalCell").closest("tr");

// Дней в сентябре 2025
const daysInSeptember = 30;

// Функция проверки выходного
function isWeekend(year, month, day) {
  const date = new Date(year, month - 1, day); // Создаём дату
  const weekday = date.getDay(); // 0 = воскресенье, 6 = суббота
  return weekday === 0 || weekday === 6;
}

// Генерация строк с 1 по 30 сентября
for (let day = 1; day <= daysInSeptember; day++) {
  const newRow = table.insertRow(totalRow.rowIndex); // Вставляем перед ИТОГО

  // 1. День
  const dayCell = newRow.insertCell();
  dayCell.textContent = day;
  dayCell.classList.add("narrow");

  // 2. Проделанная работа
  const workCell = newRow.insertCell();
  workCell.classList.add("wide");
  workCell.innerHTML = "";

  // 3. Сумма компенсации
  const sumCell = newRow.insertCell();
  sumCell.classList.add("money", "narrow");
  sumCell.innerHTML = "";

  // 4. Уволен, наказан...
  const firedCell = newRow.insertCell();
  firedCell.classList.add("narrow");
  firedCell.innerHTML = "";

  // Если выходной, подсветить красным
  if (isWeekend(2025, 9, day)) {
    dayCell.classList.add("red");
    workCell.classList.add("red");
    sumCell.classList.add("red");
    firedCell.classList.add("red");
  }
}
