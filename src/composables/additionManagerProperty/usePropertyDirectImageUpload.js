import { ref } from 'vue';
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import compressWithCompressor from '@/service/Compressor';
import convertHEICtoJPEG from '@/service/convertHEICtoJPEG';

export function usePropertyDirectImageUpload() {
    const uploadState = ref({
        isUploading: false,
        progress: 0,
        totalFiles: 0,
        completedFiles: 0,
        currentFile: null,
        errors: []
    });

    // Создаем уникальный путь для хранения изображений
    const createStoragePath = (userId, property) => {
        const path = property ? `properties/${userId}/${property.category.code}/${property.subcategory.code}` : `properties/${userId}/temp_${uuidv4()}`;
        return path;
    };

    const validateFiles = (files) => {
        const MAX_FILE_SIZE = 7 * 1024 * 1024;
        const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];

        return Array.from(files).every(file => {
            if (!ALLOWED_TYPES.includes(file.type)) {
                toast.add({
                    severity: 'error',
                    summary: 'Помилка',
                    detail: 'Дозволені формати: JPG, PNG, WEBP, HEIC, HEIF',
                    life: 3000
                });
                return false;
            }

            if (file.size > MAX_FILE_SIZE) {
                toast.add({
                    severity: 'error',
                    summary: 'Помилка',
                    detail: 'Максимальний розмір файлу: 5MB',
                    life: 3000
                });
                return true;
            }

            return true;
        });
    };

    // Загрузка изображений непосредственно в Firebase Storage
    const uploadImagesToFirebase = async (files, userId, property, existingImages = []) => {
        if (!files || files.length === 0) return existingImages;
        if (!validateFiles(files)) return existingImages;
        const storage = getStorage();
        const storagePath = createStoragePath(userId, property);

        uploadState.value = {
            isUploading: true,
            progress: 0,
            totalFiles: files.length,
            completedFiles: 0,
            currentFile: files[0]?.name || 'файл',
            errors: []
        };

        try {
            const uploadPromises = Array.from(files).map(async (file) => {
                // Преобразуем HEIC в JPEG, если необходимо
                const convertedFile = await convertHEICtoJPEG(file);

                // Сжимаем изображение
                const compressedFile = await compressWithCompressor(convertedFile);

                const fileExtension = compressedFile.name.split('.').pop();
                const fileName = `${uuidv4()}.${fileExtension}`;
                const fileRef = storageRef(storage, `${storagePath}/${fileName}`);

                // Создаем и контролируем задачу загрузки
                const uploadTask = uploadBytesResumable(fileRef, compressedFile);

                return new Promise((resolve, reject) => {
                    uploadTask.on(
                        'state_changed',
                        (snapshot) => {
                            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            uploadState.value.currentFile = file.name;
                            uploadState.value.progress = progress;
                        },
                        (error) => {
                            uploadState.value.errors.push({ file: file.name, error: error.message });
                            reject(error);
                        },
                        async () => {
                            // Загрузка завершена, получаем URL
                            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                            uploadState.value.completedFiles++;
                            resolve({
                                url: downloadURL,
                                path: fileRef.fullPath,
                                name: file.name,
                                size: file.size,
                                type: file.type,
                                createdAt: new Date().toISOString()
                            });
                        }
                    );
                });
            });

            const newImages = await Promise.all(uploadPromises);
            uploadState.value.isUploading = false;

            // Объединяем существующие и новые изображения
            return [...existingImages, ...newImages];
        } catch (error) {
            console.error('Ошибка загрузки изображений:', error);
            uploadState.value.isUploading = false;
            throw error;
        }
    };

    // Удаление изображения из Firebase Storage
    const deleteImageFromFirebase = async (imageToDelete, currentImages = []) => {
        if (!imageToDelete) return currentImages;

        const storage = getStorage();

        try {
            // Если у нас есть путь файла, используем его, иначе пытаемся получить путь из URL
            const path = imageToDelete.path || imageToDelete;

            if (path) {
                const fileRef = storageRef(storage, path);
                await deleteObject(fileRef);
            } else if (imageToDelete) {
                // Если нет пути, но есть URL, попробуем использовать URL напрямую
                const fileRef = storageRef(storage, imageToDelete);
                await deleteObject(fileRef);
            }

            // Удаляем изображение из массива
            return currentImages.filter(img =>
                img.url !== imageToDelete.url &&
                img.path !== imageToDelete.path
            );
        } catch (error) {
            console.error('Ошибка удаления изображения:', error);
            throw error;
        }
    };

    return {
        uploadState,
        uploadImagesToFirebase,
        deleteImageFromFirebase
    };
}
