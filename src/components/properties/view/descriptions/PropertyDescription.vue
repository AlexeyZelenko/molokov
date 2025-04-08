<script setup>
import { computed } from 'vue';
import DOMPurify from 'dompurify';
import { formatFirebaseTimestamp } from '@/utils/dateUtils';
import PropertyAmenities from '@/components/properties/view/amenities/PropertyAmenities.vue';
import ParkingDetails from '@/components/properties/view/categories/apartment/ParkingDetails.vue';
import SellApartment from '@/components/properties/view/categories/apartment/sell/index.vue';
import RentApartment from '@/components/properties/view/categories/apartment/rent/index.vue';
import ExchangeApartment from '@/components/properties/view/categories/apartment/exchange/index.vue';
import DailyRentApartment from '@/components/properties/view/categories/apartment/daily/index.vue';

const subcategoryComponentMap = {
    sell: SellApartment,
    rent: RentApartment,
    exchange: ExchangeApartment,
    daily: DailyRentApartment
};

const props = defineProps({
    description: {
        type: String,
        default: ''
    },
    facilityReadiness: {
        type: Object,
        default: () => ({})
    },
    property: {
        type: Object,
        default: () => ({})
    }
});

const description = computed(() => {
    const cleanedHtml = props.description.replace(/&nbsp;/g, ' ');
    return DOMPurify.sanitize(cleanedHtml, {
        ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li'],
        ALLOWED_ATTR: ['href']
    });
});
</script>

<template>
    <Fluid class="flex flex-col shadow-lg">
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

                        <div class="my-2 max-w-full break-words" v-html="description"></div>

                        <ParkingDetails v-if="property.parking" :parking="property.parking" />

                        <PropertyAmenities class="my-4" :property="property" />

                        <component v-if="property" :is="subcategoryComponentMap[property?.subcategory?.code] || SellApartment" :property="property" />
                    </AccordionContent>
                </AccordionPanel>
            </Accordion>
        </div>
    </Fluid>
</template>
