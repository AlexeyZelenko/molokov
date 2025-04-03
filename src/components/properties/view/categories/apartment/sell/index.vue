<script setup>
import { defineProps } from 'vue';

defineProps({
    property: Object
});
</script>

<template>
    {{property.subcategory}}
    <div v-if="property.heatingType?.name" class="flex items-center gap-4">
        <div class="font-semibold text-md">Тип опалення:</div>
        <div>{{ property.heatingType?.name }}</div>
    </div>
</template>

<style scoped></style>
