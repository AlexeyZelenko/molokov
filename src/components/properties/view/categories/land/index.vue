<template>
    <AreaDetails
        :apartmentArea="property.apartmentArea"
    />
</template>

<script setup>
import { defineProps } from 'vue';
import AreaDetails from "./AreaDetails.vue";

import SellApartment from './sell/index.vue';
import RentApartment from './rent/index.vue';
import ExchangeApartment from './exchange/index.vue';
import DailyRentApartment from './daily/index.vue';


const props = defineProps({
    property: Object
})

const subcategoryComponentMap = {
    sell: SellApartment,
    rent: RentApartment,
    exchange: ExchangeApartment,
    daily: DailyRentApartment
};
</script>
