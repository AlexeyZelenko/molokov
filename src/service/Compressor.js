import Compressor from 'compressorjs';

export default function compressWithCompressor(file) {
    return new Promise((resolve, reject) => {
        new Compressor(file, {
            quality: 0.6, // Качество сжатия
            maxWidth: 800, // Максимальная ширина
            maxHeight: 800, // Максимальная высота
            useWebWorker: true,
            success(result) {
                resolve(result);
            },
            error(err) {
                console.error('Ошибка сжатия файла:', file.name, err);
                reject(err);
            }
        });
    });
}
