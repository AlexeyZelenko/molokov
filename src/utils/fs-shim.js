// Шим (замена) для модуля fs в браузере
// Создаем пустую реализацию с именованными экспортами

// Функция для записи файла (мок)
export const writeFile = (path, data, options, callback) => {
  // В браузере ничего не записываем на диск
  if (typeof options === 'function') {
    options(null); // callback
  } else if (typeof callback === 'function') {
    callback(null);
  }
  return Promise.resolve();
};

// Синхронная запись файла (мок)
export const writeFileSync = () => {
  // Ничего не делаем
  return true;
};

// Чтение файла (мок)
export const readFile = (path, options, callback) => {
  if (typeof options === 'function') {
    options(null, ''); // callback
  } else if (typeof callback === 'function') {
    callback(null, '');
  }
  return Promise.resolve('');
};

// Синхронное чтение файла (мок)
export const readFileSync = () => {
  return '';
};

// Другие методы fs
export const existsSync = () => false;
export const mkdirSync = () => {};
export const readdirSync = () => [];
export const createWriteStream = () => ({
  write: () => {},
  end: () => {},
  on: () => {}
});
export const createReadStream = () => ({
  pipe: () => {},
  on: () => {}
});

// Добавляем подмодуль promises
export const promises = {
  writeFile: (path, data, options) => Promise.resolve(),
  readFile: () => Promise.resolve(''),
  access: () => Promise.resolve(),
  mkdir: () => Promise.resolve(),
  readdir: () => Promise.resolve([]),
  stat: () => Promise.resolve({ 
    isDirectory: () => false,
    isFile: () => true,
    size: 0,
    mtime: new Date()
  }),
  unlink: () => Promise.resolve()
};

// Для обратной совместимости также экспортируем все как default
export default {
  writeFile,
  writeFileSync,
  readFile,
  readFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  createWriteStream,
  createReadStream,
  promises
}; 