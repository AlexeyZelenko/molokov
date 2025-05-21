// Импортируем стандартную библиотеку UUID
import { v4 as uuidv4 } from 'uuid';

// Создаем функцию uuid() с интерфейсом, совместимым с uuid-random
function random() {
  return uuidv4();
}

// Добавляем метод bin() для совместимости
random.bin = function() {
  const hex = uuidv4().replace(/-/g, '');
  const bin = [];
  for (let i = 0; i < hex.length; i += 2) {
    bin.push(parseInt(hex.substr(i, 2), 16));
  }
  return bin;
};

// Добавляем остальные методы и свойства для полной совместимости
random.clearBuffer = function() { /* пустая функция */ };
random.test = function(uuidStr) {
  if (typeof uuidStr === 'string') {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuidStr);
  }
  return false;
};
random.BUFFER_SIZE = 4096;

export default random; 