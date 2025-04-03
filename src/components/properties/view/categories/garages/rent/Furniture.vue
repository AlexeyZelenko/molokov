<script setup>
import { defineProps } from 'vue';

defineProps({
    furniture: Object,
    animal: Boolean
});
</script>

<template>
    <div class="card flex flex-col gap-4">
        <div class="font-semibold text-xl">Меблі</div>
        <div>{{ furniture?.name }}</div>
    </div>
</template>
