<script setup>
import { defineProps } from 'vue';
import AreaDetails from './AreaDetails.vue';
import PropertyDetails from './PropertyDetails.vue';

import SellApartment from './sell/index.vue';
import RentApartment from './rent/index.vue';
import ExchangeApartment from './exchange/index.vue';
import DailyRentApartment from './daily/index.vue';

defineProps({
    property: Object
});

const subcategoryComponentMap = {
    sell: SellApartment,
    rent: RentApartment,
    exchange: ExchangeApartment,
    daily: DailyRentApartment
};
</script>

<template>
    <AreaDetails :apartmentArea="property.apartmentArea" />

    <PropertyDetails :condition="property.condition" :buildingTypesGarages="property.buildingTypesGarages" />

    <component :property="property" :is="subcategoryComponentMap[property.subcategory.code]" />
</template>
