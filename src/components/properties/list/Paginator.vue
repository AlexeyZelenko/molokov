<template>
    <div class="custom-paginator">
        <button class="p-paginator-page" @click="goToPage(1)" :disabled="currentPage === 1">
            <i class="pi pi-angle-double-left"></i>
        </button>
        <button class="p-paginator-page" @click="prevPage" :disabled="currentPage === 1">
            <i class="pi pi-angle-left"></i>
        </button>

        <button
            v-for="page in totalPages"
            :key="page"
            @click="goToPage(page)"
            :class="['p-paginator-page', { 'p-highlight': page === currentPage }]"
        >
            {{ page }}
        </button>

        <button class="p-paginator-page" @click="nextPage" :disabled="currentPage === totalPages">
            <i class="pi pi-angle-right"></i>
        </button>
        <button class="p-paginator-page" @click="goToPage(totalPages)" :disabled="currentPage === totalPages">
            <i class="pi pi-angle-double-right"></i>
        </button>
    </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
    currentPage: Number,
    totalPages: Number,
});

const emit = defineEmits(['update:currentPage']);

const goToPage = (page) => {
    if (page >= 1 && page <= props.totalPages) {
        emit('update:currentPage', page);
    }
};

const prevPage = () => goToPage(props.currentPage - 1);
const nextPage = () => goToPage(props.currentPage + 1);
</script>

<style scoped>
.custom-paginator {
    display: flex;
    justify-content: center;
    margin-top: 2rem;
}

.custom-paginator .p-paginator-page {
    width: 2.5rem;
    height: 2.5rem;
    margin: 0 0.25rem;
    border: none;
    border-radius: 50%;
    background: transparent;
    color: #666;
    cursor: pointer;
    transition: all 0.2s;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.custom-paginator .p-paginator-page:hover {
    background: #e9ecef;
}

.custom-paginator .p-paginator-page.p-highlight {
    background: #000;
    color: white;
}

.custom-paginator .p-paginator-page:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
</style>
