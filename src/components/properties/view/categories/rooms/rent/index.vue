<script setup>
import {defineProps} from "vue";
import UtilitiesList from "./UtilitiesList.vue";
import FurnitureAndAnimals from "./FurnitureAndAnimals.vue";

defineProps({
    property: Object
})
</script>

<template>
    <UtilitiesList :utilities="property.utilities" />

    <FurnitureAndAnimals :furniture="property.furniture" :animal="property.animal" />
</template>

<style scoped>

</style>
