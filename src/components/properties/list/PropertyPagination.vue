<script setup>
defineProps({
    currentPage: Number,
    totalPages: Number
});

defineEmits(['prevPage', 'nextPage']);
</script>

<template>
    <div class="flex justify-center align-center gap-2 mt-4">
        <Button
            label=""
            icon="pi pi-chevron-left"
            @click="$emit('prevPage')"
            :disabled="currentPage === 1"
            rounded
        />
        <div class="flex items-center px-4 text-xl font-bold">{{ currentPage }}</div>
        <Button
            label=""
            icon="pi pi-chevron-right"
            @click="$emit('nextPage')"
            :disabled="currentPage === totalPages"
            rounded
        />
    </div>
</template>
