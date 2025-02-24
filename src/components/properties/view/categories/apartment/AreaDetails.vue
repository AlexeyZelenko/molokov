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
        <div class="font-bold text-xl">Площа(м²) / планування</div>

        <div class="flex items-center gap-2">
            <div class="font-bold text-md ">Загальна площа:</div>
            <div>{{ apartmentArea.totalArea }} м²</div>
        </div>

        <div class="flex items-center gap-2">
            <div class="font-bold text-md">Жила площа квартири:</div>
            <div>{{ apartmentArea.livingArea }} м²</div>
        </div>

        <div class="flex items-center gap-2">
            <div class="font-bold text-md">Площа кухні:</div>
            <div>{{ apartmentArea.kitchenArea }} м²</div>
        </div>

        <div class="flex items-center gap-2">
            <div class="font-bold text-md">Планування:</div>
            <div>{{ planning?.name }}</div>
        </div>

        <div class="flex items-center gap-2">
            <div class="font-bold text-md">Санвузел:</div>
            <div>{{ bathroom?.name }}</div>
        </div>
    </div>
</template>
