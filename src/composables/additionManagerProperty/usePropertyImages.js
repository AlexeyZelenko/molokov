import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';

export function usePropertyImages(propertyManager) {
    const toast = useToast();

    const imageState = ref({
        isUploading: false,
        error: null
    });

    const validateFiles = (files) => {
        const MAX_FILE_SIZE = 5 * 1024 * 1024;
        const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

        return Array.from(files).every(file => {
            if (!ALLOWED_TYPES.includes(file.type)) {
                toast.add({
                    severity: 'error',
                    summary: 'Помилка',
                    detail: 'Дозволені формати: JPG, PNG, WEBP',
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
                return false;
            }

            return true;
        });
    };

    const uploadImages = async (files, currentImages) => {
        if (!validateFiles(files)) return currentImages;

        try {
            imageState.value.isUploading = true;
            await propertyManager.uploadImages(files);

            const newImages = Array.isArray(propertyManager.property.images)
                ? propertyManager.property.images
                : [];

            return [...new Set([...currentImages, ...newImages])];
        } catch (error) {
            console.error('Помилка завантаження:', error);
            imageState.value.error = error;
            toast.add({
                severity: 'error',
                summary: 'Помилка',
                detail: 'Не вдалося завантажити зображення',
                life: 3000
            });
            return currentImages;
        } finally {
            imageState.value.isUploading = false;
        }
    };

    const deleteImage = async (imageUrl, currentImages) => {
        if (!imageUrl) return currentImages;

        try {
            imageState.value.isUploading = true;
            await propertyManager.removeImage(imageUrl);
            return currentImages.filter(img => img !== imageUrl);
        } catch (error) {
            console.error('Помилка видалення:', error);
            toast.add({
                severity: 'error',
                summary: 'Помилка',
                detail: 'Не вдалося видалити зображення',
                life: 3000
            });
            return currentImages;
        } finally {
            imageState.value.isUploading = false;
        }
    };

    return {
        imageState,
        uploadImages,
        deleteImage
    };
}
