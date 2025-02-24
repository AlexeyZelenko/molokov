<script setup>
import { defineProps } from "vue";

const props = defineProps({
    apartmentArea: Object,
    planning: Object,
    bathroom: Object,
});
</script>

<template>
    <div class="card flex flex-col gap-2 shadow-lg">
        <div class="font-bold text-xl">Площа</div>

        <div class="flex items-center gap-2">
            <div class="font-bold text-md ">Загальна площа:</div>
            <div>{{ apartmentArea.totalArea }}</div>
        </div>
    </div>
</template>
