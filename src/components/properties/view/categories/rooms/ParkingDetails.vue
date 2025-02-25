<script setup>
import { defineProps } from "vue";

const props = defineProps({
    parking: Object,
});
</script>

<template>
    <div v-if="parking" class="flex items-center gap-2">
        <div class="font-semibold text-md">Паркування: </div>
        <div>{{ parking?.name }}</div>
    </div>
</template>
