<template>
    <div class="upload-area mb-4">
        <FileUpload
            ref="fileUpload"
            name="advanced"
            @uploader="handleUpload"
            :multiple="true"
            accept="image/*"
            :maxFileSize="10000000"
            customUpload
            chooseLabel="Обрати"
            uploadLabel="Завантажити"
            cancelLabel="Скасувати"
        >
            <template #empty>
                <div class="p-4 text-center text-gray-600">
                    <i class="pi pi-image mb-2 text-3xl"></i>
                    <p>Перетягніть файли сюди, щоб завантажити</p>
                    <p class="text-sm text-gray-500">або натисніть щоб обрати</p>
                </div>
            </template>
        </FileUpload>
    </div>
</template>

<script setup>
const emit = defineEmits(['upload']);

const handleUpload = (event) => {
    emit('upload', event.files);
};
</script>
