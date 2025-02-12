<template>
    <div class="card flex flex-col gap-4">
        <div class="font-semibold text-xl">
            {{ property.category?.name }} / {{ property.subcategory?.name }}
        </div>
        <PriceConverter :price="property.price" isDisplayUAH class="font-bold text-xl"/>
    </div>

    <AreaDetails
        :apartmentArea="property.apartmentArea"
        :planning="property.planning"
        :bathroom="property.bathroom"
    />

    <PropertyDetails
        :condition="property.condition"
        :buildingType="property.buildingType"
        :objectClass="property.objectClass"
        :reconditioning="property.reconditioning"
    />
    <component
        v-if="property"
        :is="subcategoryComponentMap[property?.subcategory?.code] || SellApartment"
        :property="property"
    />

    <ParkingDetails :parking="property.parking" />
</template>

<script setup>
import { defineProps } from 'vue';
import PriceConverter from "@/components/price/PriceConverter.vue";
import AreaDetails from "./AreaDetails.vue";
import PropertyDetails from "./PropertyDetails.vue";
import ParkingDetails from "./ParkingDetails.vue";

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
