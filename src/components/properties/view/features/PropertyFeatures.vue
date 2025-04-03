<script setup>
defineProps({
    furniture: {
        type: Object,
        default: null
    },
    parking: {
        type: Object,
        default: null
    }
});
</script>

<template>
    <div class="card flex flex-col gap-4">
        <div class="font-semibold text-xl">Меблі</div>
        <div>{{ furniture?.name }}</div>

        <div class="font-semibold text-xl">Паркування</div>
        <div>{{ parking?.name }}</div>
    </div>
</template>
