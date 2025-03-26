<script setup>
import { defineProps } from "vue";

const props = defineProps({
    apartmentArea: Object,
});
</script>

<template>
    <div class="card flex flex-col gap-2 shadow-lg">
        <div class="font-bold text-xl">Площа(м²)</div>
        <div>{{ apartmentArea.totalArea }}</div>
    </div>
</template>
