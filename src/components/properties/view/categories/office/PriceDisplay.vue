<script setup>
import { defineProps } from "vue";

const props = defineProps({
    priceUSD: Number,
    subcategory: Object,
});
</script>

<template>
    <div v-if="subcategory && subcategory.code === 'sell'">{{ priceUSD }} $</div>
    <div v-else>{{ priceUSD }} грн</div>
</template>
