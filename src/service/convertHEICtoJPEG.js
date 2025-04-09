import * as heic2any from 'heic2any';

export default async function convertHEICtoJPEG(file) {
    if (file.type === 'image/heic' || file.type === 'image/heif') {
        try {
            const blob = await heic2any.default({ blob: file, toType: 'image/jpeg' }); // Access default function through heic2any.default
            return new File([blob], file.name.replace(/\.heic|\.heif$/i, '.jpg'), { type: 'image/jpeg' });
        } catch (error) {
            console.error('Ошибка преобразования HEIC:', error);
            return file;
        }
    }
    return file;
};
