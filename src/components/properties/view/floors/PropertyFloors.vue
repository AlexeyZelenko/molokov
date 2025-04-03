<script setup>
defineProps({
    property: {
        type: Object,
        default: () => ({})
    }
});
</script>

<template>
    <div class="card flex flex-col gap-2 shadow-lg">
        <div class="font-bold text-xl">Поверховість</div>

        <div class="flex items-center">
            <div class="font-bold text-md mr-2">Поверх:</div>
            <div>{{ property?.floors?.floor }}</div>
        </div>

        <div class="flex items-center">
            <div class="font-bold text-md mr-2">Поверховість будівлі:</div>
            <div>{{ property?.floors?.totalFloors }}</div>
        </div>

        <div class="flex items-center">
            <div class="font-bold text-md mr-2">Кількість поверхів у приміщенні:</div>
            <div>{{ property.floors?.totalFloorsBuilding }}</div>
        </div>
    </div>
</template>
