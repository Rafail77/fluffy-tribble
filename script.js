// -------------------- ЛОГИКА ВЫРАВНИВАНИЯ ТАБЛИЦЫ --------------------

  const table = document.getElementById("reportTable");          // Находим таблицу по id
  const rows = Array.from(table.querySelectorAll("tr"));         // Собираем все строки таблицы
  const totalRow = table.querySelector(".total").closest("tr");  // Находим строку "TOTAL", чтобы потом вставлять новые строки перед ней

  let dayData = {}; // Здесь будем хранить все данные по дням (например {5: {work:"...", sum:"...", last:"..."} })

  // -------------------- СБОР ДАННЫХ ИЗ ИСХОДНЫХ СТРОК --------------------
  rows.forEach(r => {
    const firstCell = r.querySelector("td:first-child");     // Берём первую ячейку (там обычно номер дня)
    if (firstCell && !isNaN(parseInt(firstCell.textContent))) {
      const day = parseInt(firstCell.textContent);           // Превращаем текст в число (номер дня)
      const cells = r.querySelectorAll("td");                // Все ячейки этой строки

      let work = "";   // Текст работы (середина, colspan=9)
      let sum = "";    // Сумма (colspan=2)
      let last = "";   // Последняя колонка (увольнения и пр.)

      // Перебираем все ячейки строки
      cells.forEach((c, i) => {
        if (i === 0) return;                // Первую ячейку (номер дня) пропускаем
        if (c.colSpan === 9) work = c.innerHTML;  // Если colspan=9 → это "работа"
        if (c.colSpan === 2) sum = c.innerHTML;   // Если colspan=2 → это "сумма"
        if (c.colSpan === 1) last = c.innerHTML;  // Если colspan=1 → последняя колонка
      });

      dayData[day] = { work, sum, last };  // Сохраняем собранные данные по этому дню
      r.remove();                          // Удаляем старую строку (потом пересоздадим заново по порядку)
    }
  });

  // -------------------- СОЗДАНИЕ НОВЫХ СТРОК 1–31 --------------------
  for (let day = 1; day <= 31; day++) {
    const newRow = table.insertRow(totalRow.rowIndex);   // Вставляем новую строку перед строкой TOTAL

    // Ячейка с номером дня
    const dayCell = newRow.insertCell();
    dayCell.textContent = day;

    // Ячейка "работа" (colspan=9)
    const workCell = newRow.insertCell();
    workCell.colSpan = 9;
    workCell.innerHTML = dayData[day]?.work || "";   // Если были данные → вставляем, иначе пусто

    // Ячейка "сумма" (colspan=2)
    const sumCell = newRow.insertCell();
    sumCell.colSpan = 2;
    sumCell.classList.add("money");                  // Добавляем класс "money", чтобы потом можно было посчитать
    if (dayData[day]?.sum) sumCell.innerHTML = dayData[day].sum;

    // Последняя ячейка
    const lastCell = newRow.insertCell();
    lastCell.innerHTML = dayData[day]?.last || "";
  }

  // -------------------- ПЕРЕСЧЁТ TOTAL --------------------
  const moneyCells = document.querySelectorAll('#reportTable .money:not(.total)'); // Все ячейки с деньгами, кроме итоговой
  let total = 0;
  moneyCells.forEach(cell => {
    let value = cell.textContent.replace(/[^\d,]/g, '').replace(',', '.'); // Очищаем строку от лишних символов
    if (value) total += parseFloat(value);                                 // Складываем сумму
  });
  const formattedTotal = total.toLocaleString('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }) + " ₸";                                                               // Красиво форматируем число
  document.getElementById('totalCell').textContent = formattedTotal;       // Записываем в итоговую ячейку