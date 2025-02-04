<template>
    <div class="card flex flex-col gap-4">
        <div class="font-semibold text-xl">Площа(м²)</div>
        <div class="font-semibold text-sm">Загальна площа будинку</div>
        <div>{{ area.totalArea }} м²</div>

        <div class="font-semibold text-sm">Площа ділянки</div>
        <div>{{ area.landArea }} м²</div>

        <div class="font-semibold text-sm">Кількість поверхів</div>
        <div>{{ area.floors }}</div>
    </div>
</template>

<script setup>
defineProps({
    area: {
        type: Object,
        required: true
    }
});
</script>
