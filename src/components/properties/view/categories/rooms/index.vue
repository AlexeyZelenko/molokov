<script setup>
import { defineProps } from 'vue';
import AreaDetails from './AreaDetails.vue';
import PropertyDetails from './PropertyDetails.vue';

import SellRooms from './sell/index.vue';
import RentRooms from './rent/index.vue';
import ExchangeRooms from './exchange/index.vue';
import DailyRentRooms from './daily/index.vue';

import PropertyFloors from '@/components/properties/view/floors/PropertyFloors.vue';

defineProps({
    property: Object
});

const subcategoryComponentMap = {
    sell: SellRooms,
    rent: RentRooms,
    exchange: ExchangeRooms,
    daily: DailyRentRooms
};
</script>

<template>
    <PropertyFloors :property="property" />

    <AreaDetails :apartmentArea="property.apartmentArea" :planning="property.planning" :bathroom="property.bathroom" />

    <PropertyDetails :condition="property.condition" :buildingType="property.buildingType" :objectClass="property.objectClass" :reconditioning="property.reconditioning" />

    <component :is="subcategoryComponentMap[property.subcategory.code]" :property="property" />
</template>
