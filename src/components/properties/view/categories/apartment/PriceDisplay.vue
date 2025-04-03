<script setup>
import { defineProps } from 'vue';
import PriceConverter from '@/components/price/PriceConverter.vue';

defineProps({
    price: Number,
    subcategory: Object
});
</script>

<template>
    <PriceConverter :price="price" />
</template>
