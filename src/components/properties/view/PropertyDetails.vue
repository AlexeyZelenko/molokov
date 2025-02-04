<template>
    <div class="flex items-center">
        <h1 class="font-semibold text-xl mb-2 mr-4">{{ property.title }}</h1>
    </div>


    <Fluid class="flex flex-col md:flex-row gap-8">
        <div class="md:w-1/2">
            <div v-if="property.images?.length">
                <PropertyGallery
                    v-if="property.images?.length"
                    :images="property.images"
                />
            </div>

            <PropertyLocation
                :address="property.address"
            />

            <PropertyAmenities
                :property="property"
            />

            <PropertyReadiness
                v-if="property?.facilityReadiness"
                :property="property"
            />
        </div>

        <div class="md:w-1/2">
            <component
                v-if="property"
                :is="categoryComponentMap[category] || PropertyOther"
                :property="property"
            />
        </div>
    </Fluid>

    <PropertyDescription
        :description="property.description"
    />

    <PropertyContacts
        :creator="property.creator"
        :owner="property.owner"
        :typeOwner="property.typeOwner"
    />

    <Toast />
    <AddToListModal
        :ad="property"
        :propertyId="propertyId"
    />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { db } from '@/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
import AddToListModal from '@/components/AddToListModal.vue';

import PropertyGallery from './gallery/PropertyGallery.vue';
import PropertyLocation from './location/PropertyLocation.vue';
import PropertyDescription from './descriptions/PropertyDescription.vue';
import PropertyContacts from './contacts/PropertyContacts.vue';
import PropertyAmenities from './amenities/PropertyAmenities.vue';
import PropertyReadiness from './readiness/PropertyReadiness.vue';

import PropertyApartment from './categories/apartment/index.vue';
import PropertyHouse from './categories/house/index.vue';
import PropertyCommercial from './categories/commercial/index.vue';
import PropertyLand from './categories/land/index.vue';
import PropertyOffice from './categories/office/index.vue';
import PropertyOther from './categories/other/index.vue';

const toast = useToast();
const router = useRouter();
const route = useRoute();

const categoryComponentMap = {
    'apartments': PropertyApartment,
    'houses': PropertyHouse,
    'commercial': PropertyCommercial,
    'land': PropertyLand,
    'offices': PropertyOffice,
    'other': PropertyOther
};

const propertyId = route.params.id;
const category = route.query.category;
const subcategory = route.query.subcategory;
const property = ref({
    title: '',
    priceUSD: null,
    category: null,
    subcategory: null,
    apartmentArea: {
        totalArea: null,
        livingArea: null,
        kitchenArea: null
    },
    address: {
        region: null,
        city: '',
        street: '',
        markerPosition: null
    },
    heatingType: null,
    utilities: [],
    furniture: null,
    parking: null,
    description: '',
    creator: {
        username: '',
        phone: '',
        message: ''
    },
});

onMounted(async () => {
    await loadPropertyData(category, subcategory, propertyId);
});


const loadPropertyData = async (category, subcategory, id) => {
    try {
        const propertyRef = doc(db, `properties/${category}/${subcategory}`, id);
        const propertyDoc = await getDoc(propertyRef);

        if (propertyDoc.exists()) {
            property.value = propertyDoc.data();
        } else {
            console.error('Об\'єкт не знайдений!');
        }
    } catch (error) {
        console.error('Ошибка при загрузке объекта:', error);
    }
};

</script>
