<script setup>
import { defineProps } from 'vue';

defineProps({
    apartmentArea: Object
});
</script>

<template>
    <div class="card flex gap-2 shadow-lg">
        <div class="font-bold text-md mr-2">Площа:</div>
        <div class="text-md font-bold">{{ apartmentArea.totalArea }} м²</div>
    </div>
</template>
