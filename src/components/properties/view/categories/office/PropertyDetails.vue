<script setup>
import { defineProps } from "vue";

const props = defineProps({
    condition: Object,
    buildingType: Object,
    objectClass: Object,
    reconditioning: Object,
});
</script>

<template>
    <div class="card flex flex-col gap-2 shadow-lg">
        <div class="flex wrap">
            <div class="font-bold text-md mr-2">Стан нерухомості:</div>
            <div>{{ condition?.name }}</div>
        </div>

        <div class="flex wrap">
            <div class="font-bold text-md mr-2">Тип будівлі:</div>
            <div>{{ buildingType?.name }}</div>
        </div>

        <div class="flex wrap">
            <div class="font-bold text-md mr-2">Клас об'єкта:</div>
            <div>{{ objectClass?.name }}</div>
        </div>

        <div class="flex wrap">
            <div class="font-bold text-md mr-2">Ремонт:</div>
            <div>{{ reconditioning?.name }}</div>
        </div>
    </div>
</template>
