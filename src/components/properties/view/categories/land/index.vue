<script setup>
import { defineProps } from 'vue';
import AreaDetails from './AreaDetails.vue';

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

    <div class="card flex flex-col gap-2 shadow-lg">
        <div class="font-bold text-xl">Призначення ділянки</div>
        <div>{{ property.appointment?.buildingType?.name }}</div>
    </div>

    <component :property="property" :is="subcategoryComponentMap[property.subcategory.code]" />
</template>
