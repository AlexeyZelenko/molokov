<script setup>
import { defineProps } from 'vue';

defineProps({
    property: Object
});
</script>

<template>
    <div class="flex items-center gap-4">
        <div v-if="property.heatingType?.name" class="font-semibold text-md">Тип опалення:</div>
        <div>{{ property.heatingType?.name }}</div>
    </div>
</template>

<style scoped></style>
