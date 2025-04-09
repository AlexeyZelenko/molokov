<template>
    <Dialog
        :visible="visible"
        @update:visible="(val) => emit('update:visible', val)"
        :modal="true"
        :closable="true"
        :dismissableMask="true"
        class="image-preview-dialog"
        :style="{ width: '90vw', maxWidth: '1200px' }"
    >
        <template #header>
            <div class="flex justify-between items-center w-full">
                <h2 class="text-xl font-semibold">Перегляд фото</h2>
                <div class="flex gap-2">
                    <Button
                        v-if="filesToUpload.length > 0"
                        icon="pi pi-upload"
                        label="Завантажити всі"
                        @click="uploadAllFiles"
                        class="p-button-success"
                    />
                    <Button
                        icon="pi pi-times"
                        @click="closeDialog"
                        class="p-button-text p-button-rounded"
                        aria-label="Закрити"
                    />
                </div>
            </div>
        </template>

        <div class="flex flex-col gap-4">
            <div v-if="filesToUpload.length === 0" class="text-center py-8">
                <i class="pi pi-image text-5xl text-gray-300 mb-3"></i>
                <p class="text-gray-500">Немає фото для перегляду</p>
            </div>

            <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div
                    v-for="(file, index) in filesToUpload"
                    :key="index"
                    class="preview-item border rounded-lg overflow-hidden relative group"
                >
                    <img
                        :src="file.preview"
                        :alt="`Превью ${file.name}`"
                        class="w-full h-48 object-cover"
                    />

                    <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div class="flex gap-2">
                            <Button
                                icon="pi pi-search-plus"
                                @click="enlargeImage(file.preview)"
                                class="p-button-rounded p-button-text p-button-sm"
                                aria-label="Збільшити"
                            />
                            <Button
                                icon="pi pi-trash"
                                @click="removeFile(index)"
                                class="p-button-rounded p-button-text p-button-danger p-button-sm"
                                aria-label="Видалити"
                            />
                        </div>
                    </div>

                    <div class="p-2 bg-white border-t">
                        <p class="text-sm truncate">{{ file.name }}</p>
                        <p class="text-xs text-gray-500">{{ formatFileSize(file.size) }}</p>
                    </div>
                </div>
            </div>
        </div>

        <Dialog v-model:visible="enlargedImageVisible" modal class="enlarged-image-dialog" :style="{ width: '90vw', maxWidth: '1200px' }">
            <div class="flex justify-center">
                <img :src="enlargedImageSrc" alt="Збільшене зображення" class="max-w-full max-h-[80vh] object-contain" />
            </div>
        </Dialog>
    </Dialog>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';

const props = defineProps({
    visible: {
        type: Boolean,
        default: false
    },
    files: {
        type: Array,
        default: () => []
    }
});

const emit = defineEmits(['update:visible', 'upload', 'close']);

const filesToUpload = ref([]);
const enlargedImageVisible = ref(false);
const enlargedImageSrc = ref('');

// Создаем URL для предпросмотра изображений
const createPreviews = (files) => {
    return Array.from(files).map(file => ({
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        preview: URL.createObjectURL(file)
    }));
};

// Форматирование размера файла
const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Показать увеличенное изображение
const enlargeImage = (src) => {
    enlargedImageSrc.value = src;
    enlargedImageVisible.value = true;
};

// Удалить файл из списка
const removeFile = (index) => {
    const fileToRemove = filesToUpload.value[index];

    // Освобождаем URL объекта
    if (fileToRemove && fileToRemove.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
    }

    filesToUpload.value = filesToUpload.value.filter((_, i) => i !== index);
};

// Загрузить все файлы
const uploadAllFiles = () => {
    if (filesToUpload.value.length === 0) return;

    // Создаем FileList-подобный объект из оригинальных файлов
    const files = filesToUpload.value.map(item => item.file);

    // Отправляем файлы родительскому компоненту
    emit('upload', files);

    // Закрываем диалог
    closeDialog();
};

// Закрыть диалог
const closeDialog = () => {
    emit('update:visible', false);
    emit('close');
};

// Очистка URL предпросмотра при закрытии
const cleanupPreviews = () => {
    filesToUpload.value.forEach(fileObj => {
        if (fileObj.preview) {
            URL.revokeObjectURL(fileObj.preview);
        }
    });
    filesToUpload.value = [];
};

// Отслеживаем изменение видимости диалога
watch(() => props.visible, (newValue) => {
    if (!newValue) {
        cleanupPreviews();
    }
});

// Отслеживаем изменение файлов
watch(() => props.files, (newFiles) => {
    if (newFiles && newFiles.length > 0 && props.visible) {
        // Очищаем предыдущие превью
        cleanupPreviews();

        // Создаем новые превью
        filesToUpload.value = createPreviews(newFiles);
    }
});

// Очищаем URL при размонтировании компонента
onUnmounted(() => {
    cleanupPreviews();
});
</script>

<style scoped>
.preview-item {
    transition: all 0.2s ease;
}

.preview-item:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

:deep(.p-dialog-header) {
    padding-bottom: 0.5rem;
}

:deep(.p-dialog-content) {
    padding: 1.5rem;
}

:deep(.enlarged-image-dialog .p-dialog-header) {
    display: none;
}
</style>
