<template>
    <div class="image-item relative group">
        <img
            :src="imageUrl"
            class="w-24 h-24 object-cover rounded-lg shadow-sm transition-transform duration-200 group-hover:scale-105"
            :alt="`Image ${index + 1}`"
        />
        <div class="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
            {{ index + 1 }}
        </div>
        <Button
            icon="pi pi-trash"
            class="absolute -top-2 -right-2 p-button-danger p-button-rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            @click="$emit('remove', imageUrl)"
        />
        <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 rounded-lg cursor-move" />
    </div>
</template>

<script setup>
defineProps({
    imageUrl: {
        type: String,
        required: true
    },
    index: {
        type: Number,
        required: true
    }
});

defineEmits(['remove']);
</script>

<style scoped>
.image-item {
    width: 6rem;
    height: 6rem;
}

.image-item img {
    pointer-events: none;
}

.p-button.p-button-rounded {
    width: 2rem;
    height: 2rem;
}
</style>
