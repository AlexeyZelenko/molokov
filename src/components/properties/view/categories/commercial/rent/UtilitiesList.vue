<script setup>
import { defineProps } from "vue";

const props = defineProps({
    utilities: Array,
});
</script>

<template>
    <div class="card flex flex-col gap-4">
        <div class="font-semibold text-xl">Комунальні послуги</div>
        <ul>
            <li v-for="utility in utilities" :key="utility.code">{{ utility.name }}</li>
        </ul>
    </div>
</template>
