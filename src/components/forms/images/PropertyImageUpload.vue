<template>
    <div class="field col-12">
        <div class="font-semibold text-xl mb-2">Фотографії</div>
        <div class="text-gray-600 mb-4">
            <strong>Оберіть</strong> та <strong>завантажте</strong> фотографії перед збереженням оголошення.         
        </div>
        <UploadArea
            @upload="handleUpload"
        />
        <ImageGrid
            :images="images"
            @remove="handleRemove"
            @reorder="handleReorder"
        />
    </div>
</template>

<script setup>
import UploadArea from './UploadArea.vue';
import ImageGrid from './ImageGrid.vue';

const props = defineProps({
    images: {
        type: Array,
        default: () => []
    }
});

const emit = defineEmits(['upload', 'remove', 'reorder']);

const handleUpload = (files) => {
    emit('upload', files);
};

const handleRemove = (imageUrl) => {
    emit('remove', imageUrl);
};

const handleReorder = (newOrder) => {
    emit('reorder', newOrder);
};
</script>
