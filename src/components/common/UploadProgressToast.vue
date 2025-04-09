<template>
    <div v-if="visible" class="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 border-l-4 border-primary z-50 w-80">
        <div class="flex justify-between items-center mb-2">
            <div class="font-semibold">Завантаження фото</div>
            <i v-if="closable" class="pi pi-times cursor-pointer text-gray-500 hover:text-gray-700" @click="$emit('close')"></i>
        </div>

        <div class="text-sm mb-2">
            {{ file }}
        </div>

        <ProgressBar :value="progress" class="mb-2" />

        <div class="flex justify-between text-sm text-gray-600">
            <span>{{ progress.toFixed(0) }}%</span>
            <span>{{ completed }} з {{ total }}</span>
        </div>
    </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import ProgressBar from 'primevue/progressbar';

defineProps({
    visible: {
        type: Boolean,
        default: false
    },
    progress: {
        type: Number,
        default: 0
    },
    file: {
        type: String,
        default: 'файл'
    },
    completed: {
        type: Number,
        default: 0
    },
    total: {
        type: Number,
        default: 0
    },
    closable: {
        type: Boolean,
        default: false
    }
});

defineEmits(['close']);
</script>

<style scoped>
div {
    transition: all 0.3s ease;
}
</style>
