// src/utils/dateUtils.js

export const formatFirebaseTimestamp = (timestamp) => {
    console.log('timestamp', timestamp); // Выводим в консоль, чтобы увидеть, что приходит
    // Преобразуем в Date объект
    const date = new Date(timestamp.seconds * 1000); // Умножаем на 1000, потому что Firebase возвращает секунды, а JavaScript ожидает миллисекунды

    // Получаем день, месяц и год
    const day = String(date.getDate()).padStart(2, '0'); // Обеспечиваем двухзначный формат дня
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Месяцы начинаются с 0, поэтому добавляем 1
    const year = date.getFullYear();

    // Формируем дату в формате MM/DD/YYYY
    return `${month}/${day}/${year}`;
};
