<template>
    <div v-if="sortableImages.length" class="image-grid flex flex-wrap gap-4">
        <div
            v-for="(image, index) in sortableImages"
            :key="image.id"
            class="draggable-item"
            draggable="true"
            @dragstart="handleDragStart(index)"
            @dragover.prevent
            @drop="handleDrop(index)"
        >
            <ImageItem
                :image-url="image.imageUrl"
                :index="index"
                @remove="() => handleRemove(image.id)"
            />
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import ImageItem from './ImageItem.vue';

const props = defineProps({
    images: {
        type: Array,
        default: () => []
    }
});

const emit = defineEmits(['remove', 'reorder']);

// Use a ref to manage the state of sortableImages
const sortableImages = ref(
    props.images.map((url, index) => ({
        id: index + '-' + Date.now(),
        imageUrl: url
    }))
);

// Watch for changes in props.images and update sortableImages
watch(() => props.images, (newImages) => {
    sortableImages.value = newImages.map((url, index) => ({
        id: index + '-' + Date.now(),
        imageUrl: url
    }));
});

let draggedIndex = null;

const handleDragStart = (index) => {
    draggedIndex = index;
};

const handleDrop = (index) => {
    if (draggedIndex === null || draggedIndex === index) return;

    const updatedImages = [...sortableImages.value];
    const movedItem = updatedImages.splice(draggedIndex, 1)[0];

    updatedImages.splice(index, 0, movedItem);
    sortableImages.value = updatedImages;

    emit('reorder', updatedImages.map(img => img.imageUrl));
    draggedIndex = null;
};

const handleRemove = (id) => {
    const imageToRemove = sortableImages.value.find(img => img.id === id);
    if (imageToRemove) {
        emit('remove', imageToRemove.imageUrl); // Emit the `imageUrl`
        sortableImages.value = sortableImages.value.filter(img => img.id !== id);
    }
};
</script>

<style scoped>
.draggable-item {
    cursor: grab;
}
</style>
