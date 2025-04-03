<script setup>
import { defineProps } from 'vue';

defineProps({
    condition: Object,
    buildingTypesGarages: Object
});
</script>

<template>
    <div class="card flex flex-col gap-2 shadow-lg">
        <div class="flex wrap">
            <div class="font-bold text-md mr-2">Стан нерухомості:</div>
            <div>{{ condition?.name }}</div>
        </div>

        <div class="flex wrap">
            <div class="font-bold text-md mr-2">Тип матеріалу:</div>
            <div>{{ buildingTypesGarages?.name }}</div>
        </div>
    </div>
</template>
