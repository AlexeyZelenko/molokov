<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from '@/store/authFirebase';

const authStore = useAuthStore();

onMounted(async () => {
    await authStore.checkAuthPersistence();
});
</script>

<template>
    <router-view />
</template>

<style scoped></style>
