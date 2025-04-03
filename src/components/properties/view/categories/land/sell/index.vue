<script setup>
import { defineProps } from 'vue';

defineProps({
    property: Object
});
</script>

<template>
    <div v-if="property.heatingType?.name" class="card flex flex-col gap-4">
        <div class="font-semibold text-xl">Тип опалення</div>
        <div>{{ property.heatingType?.name }}</div>
    </div>
</template>

<style scoped></style>
