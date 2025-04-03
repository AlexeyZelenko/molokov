<script setup>
import { defineProps } from 'vue';

defineProps({
    furniture: Object,
    animal: Boolean
});
</script>

<template>
    <div class="card flex flex-col gap-4">
        <section v-if="furniture" class="flex items-center gap-4">
            <div class="font-semibold text-xl">Меблі:</div>
            <div>{{ furniture?.name }}</div>
        </section>

        <section class="flex items-center gap-4">
            <div class="font-semibold text-xl">Проживання тварин:</div>
            <div>{{ animal ? 'Так' : 'Ні' }}</div>
        </section>
    </div>
</template>
