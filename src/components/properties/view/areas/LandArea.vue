<script setup>
defineProps({
    area: {
        type: Object,
        required: true
    },
    landArea: {
        type: Number,
        required: true
    }
});
</script>

<template>
    <div class="card flex flex-col gap-4">
        <div class="font-semibold text-xl">Площа ділянки</div>
        <div class="font-semibold text-sm">{{ landArea }} м²</div>

        <div class="font-semibold text-sm">Загальна площа</div>
        <div>{{ landArea }} м²</div>

        <div class="font-semibold text-sm">Цільове призначення</div>
        <div>{{ area.purpose }}</div>
    </div>
</template>
