<script setup>
import { defineProps } from "vue";
import PriceConverter from '@/components/price/PriceDisplay.vue';

const props = defineProps({
    price: Number,
    subcategory: Object,
});
</script>

<template>
    <PriceConverter
        :price="price"
    />
</template>
