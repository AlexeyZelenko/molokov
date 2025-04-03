<script setup>
import { defineProps } from 'vue';

defineProps({
    parking: Object
});
</script>

<template>
    <div v-if="parking?.name" class="card flex flex-col gap-4">
        <div class="font-semibold text-xl">Паркування</div>
        <div>{{ parking?.name }}</div>
    </div>
</template>
