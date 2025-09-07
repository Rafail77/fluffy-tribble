// -------------------- НАСТРОЙКА ДАТЫ --------------------
const table = document.getElementById("reportTable"); // Находим таблицу по id
const totalRow = table.querySelector(".total").closest("tr"); // Находим строку TOTAL

const year = 2025; // Год отчета
const month = 8; // Сентябрь (январь = 0, поэтому 8 = 9-й месяц)
const daysInMonth = 30; // В сентябре 30 дней

// -------------------- СОЗДАНИЕ СТРОК С ДНЯМИ --------------------
for (let day = 1; day <= daysInMonth; day++) { // Цикл от 1 до 30
  const date = new Date(year, month, day); // Создаём объект даты
  const weekday = date.getDay(); // День недели (0=воскресенье, 6=суббота)

  const newRow = table.insertRow(totalRow.rowIndex); // Вставляем новую строку перед TOTAL

  // Если день суббота или воскресенье → выделяем красным
  if (weekday === 0 || weekday === 6) {
    newRow.classList.add("weekend"); // Добавляем класс weekend
  }

  // ---- Номер дня ----
  const dayCell = newRow.insertCell(); // Создаём ячейку
  dayCell.textContent = day; // Записываем число дня

  // ---- Проделанная работа ----
  const workCell = newRow.insertCell(); // Создаём ячейку
  workCell.colSpan = 9; // Задаём colspan = 9
  workCell.innerHTML = ""; // Пока оставляем пустым

  // ---- Сумма компенсации ----
  const sumCell = newRow.insertCell(); // Создаём ячейку
  sumCell.classList.add("money"); // Добавляем класс "money"
  sumCell.innerHTML = ""; // Пустое значение

  // ---- Уволен, наказан ----
  const lastCell = newRow.insertCell(); // Создаём ячейку
  lastCell.innerHTML = ""; // Пустое значение
}

// -------------------- ПЕРЕСЧЁТ TOTAL --------------------
function recalcTotal() {
  const moneyCells = document.querySelectorAll('#reportTable .money:not(.total)'); // Все ячейки с суммами кроме TOTAL
  let total = 0; // Начальное значение суммы

  moneyCells.forEach(cell => { // Перебираем ячейки
    let value = cell.textContent.replace(/[^\d,]/g, '').replace(',', '.'); // Очищаем строку от лишних символов
    if (value) total += parseFloat(value); // Складываем числа
  });

  const formattedTotal = total.toLocaleString('ru-RU', { // Форматируем число по-русски
    minimumFractionDigits: 2, // Минимум 2 знака после запятой
    maximumFractionDigits: 2  // Максимум 2 знака после запятой
  }) + " ₸"; // Добавляем знак валюты

  document.getElementById('totalCell').textContent = formattedTotal; // Записываем в ячейку TOTAL
}