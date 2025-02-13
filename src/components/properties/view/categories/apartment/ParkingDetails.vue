<script setup>
import { defineProps } from "vue";

const props = defineProps({
    parking: Object,
});
</script>

<template>
    <div class="card flex flex-col gap-4 shadow-lg">
        <div class="font-semibold text-xl">Паркування</div>
        <div>{{ parking?.name }}</div>
    </div>
</template>
