<script setup>
import { computed, ref } from 'vue';
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

const fontSize = ref(16); // Начальный размер шрифта
const minFontSize = 12;   // Минимальный размер шрифта
const maxFontSize = 24;   // Максимальный размер шрифта
const step = 2;           // Шаг изменения размера

const description = computed(() => {
    const cleanedHtml = props.description.replace(/&nbsp;/g, ' ');
    return DOMPurify.sanitize(cleanedHtml, {
        ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li'],
        ALLOWED_ATTR: ['href']
    });
});

const increaseFontSize = () => {
    if (fontSize.value < maxFontSize) {
        fontSize.value += step;
    }
};

const decreaseFontSize = () => {
    if (fontSize.value > minFontSize) {
        fontSize.value -= step;
    }
};

const resetFontSize = () => {
    fontSize.value = 16;
};
</script>

<template>
    <Fluid class="flex flex-col shadow-lg">
        <div class="card flex flex-col gap-4 w-full">
            <Accordion value="0">
                <AccordionPanel>
                    <AccordionHeader>
                        <div class="flex justify-between items-center w-full">
                            <span class="font-semibold text-xl">Додадковий опис об'єкта</span>                            
                        </div>
                    </AccordionHeader>
                    <AccordionContent>
                        <div v-if="facilityReadiness">
                            <span class="font-semibold text-md mr-2">Готовність об'єкта:</span>
                            <span>{{ formatFirebaseTimestamp(facilityReadiness) }}</span>
                        </div>

                        <div class="flex items-center gap-2">
                                <Button 
                                    icon="pi pi-minus"
                                    label="ТЕКСТ" 
                                    @click="decreaseFontSize" 
                                    severity="secondary" 
                                    size="small"
                                    :disabled="fontSize <= minFontSize"
                                    v-tooltip="'Зменшити текст'"
                                />
                                <Button 
                                    icon="pi pi-plus" 
                                    label="ТЕКСТ" 
                                    @click="increaseFontSize" 
                                    severity="secondary" 
                                    size="small"
                                    :disabled="fontSize >= maxFontSize"
                                    v-tooltip="'Збільшити текст'"
                                />
                                <Button 
                                    label="СКИНУТИ" 
                                    @click="resetFontSize" 
                                    severity="secondary" 
                                    size="small"
                                    v-tooltip="'Скинути розмір тексту'"
                                />
                            </div>
                        <div 
                            class="my-2 max-w-full break-words prose" 
                            v-html="description"
                            :style="{ fontSize: `${fontSize}px` }"
                        ></div>

                        <ParkingDetails v-if="property.parking" :parking="property.parking" />

                        <PropertyAmenities class="my-4" :property="property" />

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

<style scoped>
.prose {
    line-height: 1.6;
    transition: font-size 0.2s ease;
}
</style>