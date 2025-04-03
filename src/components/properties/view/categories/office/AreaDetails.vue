<script setup>
defineProps({
    apartmentArea: {
        type: Object,
        required: true,
        validator: (value) => {
            return value.totalArea && value.livingArea && value.kitchenArea;
        }
    },
    planning: {
        type: Object,
        default: null
    },
    bathroom: {
        type: Object,
        default: null
    }
});
</script>

<template>
    <div class="card flex flex-col gap-4">
        <div class="font-semibold text-xl">Площа(м²)</div>
        <div class="font-semibold text-sm">Загальна площа</div>
        <div>{{ apartmentArea.totalArea }} м²</div>

        <div class="font-semibold text-sm">Жила площа</div>
        <div>{{ apartmentArea.livingArea }} м² / {{ planning?.name }}</div>

        <div class="font-semibold text-sm">Площа кухні</div>
        <div>{{ apartmentArea.kitchenArea }} м²</div>

        <div class="font-semibold text-sm">Санвузел - {{ bathroom?.name }}</div>
    </div>
</template>
