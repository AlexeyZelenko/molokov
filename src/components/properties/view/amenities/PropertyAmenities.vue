<template>
    <div class="card flex flex-col gap-4">
        <div class="font-semibold text-xl">Комунікації</div>
        <div>{{ property.communications }}</div>

        <div class="font-semibold text-xl">Інфраструктура</div>
        <div>{{ property.infrastructure }}</div>

        <div class="font-semibold text-xl">Ландшафт</div>
        <div>{{ property.landscape }}</div>
    </div>
</template>

<script setup>
defineProps({
    property: {
        type: Object,
        default: () => ({})
    }
});
</script>
