<!-- AppLoader.vue -->
<template>
    <ProgressBar v-if="isLoading" mode="indeterminate" style="height: 5px" class="app-loader" />
</template>

<script setup>
import { computed } from 'vue';
import ProgressBar from 'primevue/progressbar';
import { loading } from '@/router/guards.js'; // путь может отличаться

// Используем computed для получения значения из внешнего ref
const isLoading = computed(() => loading.value);

// onMounted(() => {
//     // Подписываемся на изменения значения isLoading
//     watch(isLoading, (value) => {
//         if (value) {
//             console.log('show loader', isLoading);
//         } else {
//             console.log('hide loader', isLoading);
//         }
//     });
// });
</script>

<style scoped>
.app-loader {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 9999;
}
</style>
