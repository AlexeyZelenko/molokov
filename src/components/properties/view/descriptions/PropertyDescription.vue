<template>
    <Fluid class="flex flex-col mt-8">
        <div class="card flex flex-col gap-4 w-full">
            <div class="font-semibold text-xl">Додадковий опис об'єкта</div>
            <div v-html="description"></div>
        </div>
    </Fluid>
</template>

<script setup>
defineProps({
    description: {
        type: String,
        default: ''
    }
});
</script>
