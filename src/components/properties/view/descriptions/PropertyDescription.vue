<template>
    <Fluid class="flex flex-col mt-8 shadow-lg">
        <div class="card flex flex-col gap-4 w-full">
            <Accordion value="0">
                <AccordionPanel>
                    <AccordionHeader>
                        <span class="font-semibold text-xl">Додадковий опис об'єкта</span>
                    </AccordionHeader>
                    <AccordionContent>
                        <div v-if="facilityReadiness">
                            <span class="font-semibold text-md mr-2">Готовність об'єкта:</span>
                            <span>{{ formatFirebaseTimestamp(facilityReadiness) }}</span>
                        </div>

                        <p class="my-2" v-html="description"></p>

                        <ParkingDetails :parking="property.parking" />

                        <PropertyAmenities
                            class="my-4"
                            :property="property"
                        />

                        <component
                            v-if="property"
                            :is="subcategoryComponentMap[property?.subcategory?.code] || SellApartment"
                            :property="property"
                        />
                    </AccordionContent>
                </AccordionPanel>
            </Accordion>
        </div>
    </Fluid>
</template>

<script setup>
import {formatFirebaseTimestamp} from "@/utils/dateUtils";
import PropertyAmenities from "@/components/properties/view/amenities/PropertyAmenities.vue";
import ParkingDetails from "@/components/properties/view/categories/apartment/ParkingDetails.vue";
import SellApartment from "@/components/properties/view/categories/apartment/sell/index.vue";
import RentApartment from "@/components/properties/view/categories/apartment/rent/index.vue";
import ExchangeApartment from "@/components/properties/view/categories/apartment/exchange/index.vue";
import DailyRentApartment from "@/components/properties/view/categories/apartment/daily/index.vue";

const subcategoryComponentMap = {
    sell: SellApartment,
    rent: RentApartment,
    exchange: ExchangeApartment,
    daily: DailyRentApartment
};

defineProps({
    description: {
        type: String,
        default: ''
    },
    facilityReadiness: {
        type: String,
        default: ''
    },
    property: {
        type: Object,
        default: () => ({})
    }
});
</script>
