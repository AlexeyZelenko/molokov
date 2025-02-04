<script setup>
defineProps({
    currentPage: Number,
    totalPages: Number
});

defineEmits(['prevPage', 'nextPage']);
</script>

<template>
    <div class="pagination flex justify-center align-center gap-2">
        <Button
            label="Попередня"
            icon="pi pi-chevron-left"
            @click="$emit('prevPage')"
            :disabled="currentPage === 1"
            class="pagination--btn"
        />
        <div class="pagination--text">Сторінка {{ currentPage }}</div>
        <Button
            label="Наступна"
            icon="pi pi-chevron-right"
            @click="$emit('nextPage')"
            :disabled="currentPage === totalPages"
            class="pagination--btn"
        />
    </div>
</template>

<style scoped>
.pagination {
    margin-top: 1rem;
}
.pagination--btn {
    min-width: 100px;
}
.pagination--text {
    display: flex;
    align-items: center;
}
</style>
