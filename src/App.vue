<script setup>
import { computed, onMounted } from 'vue';
import { useAuthStore } from '@/store/authFirebase';
import { loading } from '@/router/guards.js';

const isLoading = computed(() => loading.value);

const authStore = useAuthStore();
onMounted(authStore.checkAuthPersistence);
</script>

<template>
    <div>
        <div v-if="isLoading" class="fixed top-0 left-0 right-0 z-[9999] h-[5px] bg-blue-500 animate-pulse"></div>
        <router-view />
    </div>
</template>
