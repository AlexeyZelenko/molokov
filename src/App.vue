<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from '@/store/authFirebase';

const authStore = useAuthStore();

onMounted(() => {
    authStore.checkAuthPersistence();
});
</script>

<template>
    <router-view />
</template>

<style scoped></style>
