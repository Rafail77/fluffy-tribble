// Находим все ячейки с классом "money", кроме итоговой
    const moneyCells = document.querySelectorAll('#reportTable .money:not(.total)');

    let total = 0;
    moneyCells.forEach(cell => {
      // Убираем пробелы, ₸ и заменяем запятую на точку
      let value = cell.textContent.replace(/[^\d,]/g, '').replace(',', '.');
      if (value) {
        total += parseFloat(value);
      }
    });

    // Форматируем итог с разделением тысяч и двумя знаками
    const formattedTotal = total.toLocaleString('ru-RU', {minimumFractionDigits: 2, maximumFractionDigits: 2}) + " ₸";

    // Записываем результат в итоговую ячейку
    document.getElementById('totalCell').textContent = formattedTotal;