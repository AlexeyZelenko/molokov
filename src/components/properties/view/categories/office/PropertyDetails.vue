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
    <div class="card flex flex-col gap-4">
        <div class="font-semibold text-xl">Стан нерухомості</div>
        <div>{{ condition?.name }}</div>

        <div class="font-semibold text-xl">Тип будівлі</div>
        <div>{{ buildingType?.name }}</div>

        <div class="font-semibold text-xl">Клас об'єкта</div>
        <div>{{ objectClass?.name }}</div>

        <div class="font-semibold text-xl">Ремонт</div>
        <div>{{ reconditioning?.name }}</div>
    </div>
</template>
