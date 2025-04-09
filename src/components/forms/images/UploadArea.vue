<template>
    <div>
        <div
            class="upload-area border-2 border-dashed border-primary p-6 rounded-lg mb-4"
            :class="{ 'bg-gray-100': isDragging, 'opacity-60 cursor-not-allowed': isUploading }"
            @dragover.prevent="handleDragOver"
            @dragleave.prevent="handleDragLeave"
            @drop.prevent="handleDrop"
        >
            <div class="flex flex-col items-center justify-center" :class="{ 'pointer-events-none': isUploading }">
                <i class="pi pi-cloud-upload text-5xl text-primary mb-2"></i>
                <h3 class="font-semibold">
                    {{ isDragging ? 'Відпустіть файли тут' : 'Перетягніть фотографії сюди' }}
                </h3>
                <p class="text-gray-600 text-center my-2">або</p>
                <Button
                    type="button"
                    icon="pi pi-images"
                    label="Вибрати фотографії"
                    :disabled="isUploading"
                    @click="triggerFileInput"
                    class="p-button-outlined"
                />
                <input
                    type="file"
                    ref="fileInput"
                    multiple
                    accept="image/*"
                    class="hidden"
                    @change="handleFileSelect"
                    :disabled="isUploading"
                />
                <p class="text-sm text-gray-500 mt-3">
                    Можна вибрати декілька файлів одночасно
                </p>
                <p class="text-sm text-gray-500">
                    Підтримувані формати: JPG, PNG, WEBP, HEIC, HEIF (макс. 7MB на файл)
                </p>
            </div>
        </div>

        <!-- Компонент предпросмотра -->
        <ImagePreviewModal
            v-model:visible="showPreviewModal"
            :files="selectedFiles"
            @upload="handleUpload"
            @close="clearSelectedFiles"
        />
    </div>
</template>

<script setup>
import { ref } from 'vue';
import Button from 'primevue/button';
import ImagePreviewModal from './ImagePreviewModal.vue';

const props = defineProps({
    isUploading: {
        type: Boolean,
        default: false
    },
    maxFileSize: {
        type: Number,
        default: 7 * 1024 * 1024 // 7MB в байтах
    },
    maxFiles: {
        type: Number,
        default: 20
    },
    enablePreview: {
        type: Boolean,
        default: true
    }
});

const emit = defineEmits(['upload']);
const fileInput = ref(null);
const isDragging = ref(false);
const selectedFiles = ref([]);
const showPreviewModal = ref(false);

const triggerFileInput = () => {
    if (!props.isUploading) {
        fileInput.value.click();
    }
};

const validateFiles = (files) => {
    const validFiles = [];
    const errors = [];

    // Проверяем количество файлов
    if (files.length > props.maxFiles) {
        errors.push(`Можна завантажити максимум ${props.maxFiles} файлів`);
        return { validFiles, errors };
    }

    // Проверяем тип и размер каждого файла
    for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Проверка типа файла
        if (!file.type.match('image.*')) {
            errors.push(`Файл "${file.name}" не є зображенням`);
            continue;
        }

        // Проверка размера файла
        if (file.size > props.maxFileSize) {
            errors.push(`Файл "${file.name}" перевищує допустимий розмір (${props.maxFileSize / (1024 * 1024)}MB)`);
            continue;
        }

        validFiles.push(file);
    }

    return { validFiles, errors };
};

const handleFileSelect = (event) => {
    if (props.isUploading) return;

    const { validFiles, errors } = validateFiles(event.target.files);

    if (errors.length > 0) {
        // Показываем ошибки через Toast или другим способом
        console.error(errors);
        alert(errors.join('\n'));
    }

    if (validFiles.length > 0) {
        if (props.enablePreview) {
            // Если включен предварительный просмотр, показываем модальное окно
            selectedFiles.value = validFiles;
            showPreviewModal.value = true;
        } else {
            // Иначе сразу загружаем файлы
            emit('upload', validFiles);
        }
    }

    // Сбрасываем input чтобы можно было выбрать те же файлы снова
    event.target.value = '';
};

const handleUpload = (files) => {
    emit('upload', files);
    clearSelectedFiles();
};

const clearSelectedFiles = () => {
    selectedFiles.value = [];
};

const handleDragOver = (event) => {
    if (props.isUploading) return;
    isDragging.value = true;
};

const handleDragLeave = (event) => {
    isDragging.value = false;
};

const handleDrop = (event) => {
    if (props.isUploading) return;
    isDragging.value = false;

    const { validFiles, errors } = validateFiles(event.dataTransfer.files);

    if (errors.length > 0) {
        console.error(errors);
        alert(errors.join('\n'));
    }

    if (validFiles.length > 0) {
        if (props.enablePreview) {
            // Если включен предварительный просмотр, показываем модальное окно
            selectedFiles.value = validFiles;
            showPreviewModal.value = true;
        } else {
            // Иначе сразу загружаем файлы
            emit('upload', validFiles);
        }
    }
};
</script>

<style scoped lang="scss">
.upload-area {
    transition: all 0.3s ease;
}
.upload-area:hover:not(.opacity-60) {
    background-color: rgba(var(--primary-rgb), 0.05);
}
</style>
