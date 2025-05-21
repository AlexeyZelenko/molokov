// Исправление ошибки импорта uuid-random
// Вместо проблемной библиотеки uuid-random используем uuid, которая уже добавлена в проект
import { v4 as uuidv4 } from 'uuid';

// Экспортируем функцию с тем же интерфейсом, что и uuid-random
const uuid = () => uuidv4();
uuid.bin = () => {
    // Преобразуем строку UUID в бинарный формат (массив байтов)
    const hex = uuidv4().replace(/-/g, '');
    const bin = [];
    for (let i = 0; i < hex.length; i += 2) {
        bin.push(parseInt(hex.substr(i, 2), 16));
    }
    return bin;
};

// Экспортируем как default и как named export для совместимости со всеми вариантами импорта
export default uuid;
export const generateUuid = uuid; 