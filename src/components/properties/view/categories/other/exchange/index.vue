<script setup>
import {defineProps} from "vue";

const props = defineProps({
    property: Object
})
</script>

<template>
    <div class="card flex flex-col gap-4">
        <div class="font-semibold text-xl">Тип опалення</div>
        <div>{{ property.heatingType?.name }}</div>
    </div>
</template>

<style scoped>

</style>
