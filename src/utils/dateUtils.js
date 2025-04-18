// src/utils/dateUtils.js

import { Timestamp } from 'firebase/firestore';

export const formatFirebaseTimestamp = (timestamp) => {
    // Преобразуем в Date объект
    const date = new Date(timestamp.seconds * 1000); // Умножаем на 1000, потому что Firebase возвращает секунды, а JavaScript ожидает миллисекунды

    // Получаем день, месяц и год
    const day = String(date.getDate()).padStart(2, '0'); // Обеспечиваем двухзначный формат дня
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Месяцы начинаются с 0, поэтому добавляем 1
    const year = date.getFullYear();

    // Формируем дату в формате MM/DD/YYYY
    return `${month}/${day}/${year}`;
};

export const formatFirebaseTimestampToTime = (timestamp) => {
    return timestamp.toLocaleString('uk-UA', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

export const formatDateFromTimestamp = (createdAt, locale = undefined, options = undefined) => {
    if (!createdAt) {
        return '';
    }

    let date;
    try {
        date = createdAt instanceof Timestamp ? createdAt.toDate() : new Date(createdAt);
        if (isNaN(date.getTime())) {
            return 'Invalid date';
        }
    } catch (error) {
        console.error('Error formatting date:', error);
        return 'Invalid date';
    }

    return date.toLocaleDateString(locale, options);
}
