<script setup>
import { defineProps } from "vue";

const props = defineProps({
    price: Number,
    subcategory: Object,
});
</script>

<template>
    <div>{{ price }}</div>
</template>
