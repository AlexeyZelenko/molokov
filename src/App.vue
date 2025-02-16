<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from '@/store/authFirebase';
import AppLoader from '@/components/AppLoader.vue';

const authStore = useAuthStore();

onMounted(async () => {
    await authStore.checkAuthPersistence();
});
</script>

<template>
    <AppLoader />
    <router-view />
</template>

<style scoped></style>
