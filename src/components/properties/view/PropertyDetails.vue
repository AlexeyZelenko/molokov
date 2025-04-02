<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { db } from '@/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import Toast from 'primevue/toast';
import { useUserStore } from '@/store/userStore';

import Skeleton from './skeleton/Details.vue';

import AddToListModal from '@/components/AddToListModal.vue';

import PropertyGallery from './gallery/PropertyGallery.vue';
import PropertyLocation from './location/PropertyLocation.vue';
import PropertyDescription from './descriptions/PropertyDescription.vue';

import PropertyApartment from './categories/apartment/index.vue';
import PropertyHouse from './categories/house/index.vue';
import PropertyCommercial from './categories/commercial/index.vue';
import PropertyLand from './categories/land/index.vue';
import PropertyOffice from './categories/office/index.vue';
import PropertyRooms from './categories/rooms/index.vue';
import PropertyGarages from './categories/garages/index.vue';
import PropertyOther from './categories/other/index.vue';

import DgisMap from '@/components/maps/DgisMap.vue';
import SocialShare from '@/components/socialShare/SocialShare.vue';
import PriceConverter from '@/components/price/PriceConverter.vue';
import PropertyUserInfo from '@/components/properties/list/PropertyUserInfo.vue';
import PropertyListCurrency from "@/components/PropertyListCurrency.vue";

const route = useRoute();

const userStore = useUserStore();
const isRegister = computed(() => {
    return userStore.user?.id || null;
});

const categoryComponentMap = {
    apartments: PropertyApartment,
    houses: PropertyHouse,
    commercial: PropertyCommercial,
    land: PropertyLand,
    offices: PropertyOffice,
    other: PropertyOther,
    rooms: PropertyRooms,
    garages: PropertyGarages
};

const fullUrl = computed(() => {
    const baseUrl = window.location.origin;
    return `${baseUrl}${route.fullPath}`;
});

const propertyId = route.params.id;
const category = route.query.category;
const subcategory = route.query.subcategory;
const property = ref({
    title: '',
    price: null,
    category: null,
    subcategory: null,
    apartmentArea: {
        totalArea: null,
        livingArea: null,
        kitchenArea: null
    },
    landArea: null,
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
        message: '',
        agency: ''
    }
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
            console.error("Об'єкт не знайдений!");
        }
    } catch (error) {
        console.error('Ошибка при загрузке объекта:', error);
    }
};

const viewMode = ref('single');

function setViewMode(mode) {
    viewMode.value = mode;
    localStorage.setItem('propertyViewMode', mode);
}

const savedViewMode = localStorage.getItem('propertyViewMode');
if (savedViewMode) {
    viewMode.value = savedViewMode;
}
</script>

<template>
    <div v-if="!property.title">
        <Skeleton />
    </div>
    <div v-else>
        <Fluid>
            <div
                class="flex flex-col md:flex-row items-start justify-start mb-4"
                :class="{
                    'flex-col': true,
                    'md:flex-row': viewMode === 'double',
                    'md:w-1/2 m-auto': viewMode === 'single'
                }"
            >
                <section>
                    <h1 class="font-semibold text-2xl">{{ property.title }}</h1>
                    <p class="text-sm">{{ property.category?.name }} / {{ property.subcategory?.name }}</p>
                </section>

                <div class="flex items-center mt-2 md:mt-0">
                    <SocialShare :property="property" :adUrl="fullUrl" :title="property.title" :description="property.price" :image="property.images[0]" />
                </div>
            </div>
            <!-- Dynamic layout container -->
            <div
                class="flex item-start justify-between mb-1"
                :class="{
                    'md:flex-row': viewMode === 'double',
                    'md:w-1/2 m-auto': viewMode === 'single'
                }"
            >
                <section class="flex items-center">
                    <button @click="setViewMode('single')" class="p-2 rounded-l transition" :class="viewMode === 'single' ? 'bg-primary-700 text-white' : 'bg-gray-200 hover:bg-gray-300'">
                        <i class="pi pi-list text-sm"></i>
                    </button>
                    <button @click="setViewMode('double')" class="p-2 rounded-r transition" :class="viewMode === 'double' ? 'bg-primary-700 text-white' : 'bg-gray-200 hover:bg-gray-300'">
                        <i class="pi pi-table text-sm"></i>
                    </button>
                </section>
            </div>
            <div
                class="flex flex-wrap"
                :class="{
                    'flex-row w-full': viewMode === 'double',
                    'md:w-1/2 m-auto': viewMode === 'single'
                }"
            >
                <!-- Images and location section -->
                <div :class="['flex flex-col', viewMode === 'single' ? 'w-full' : 'md:w-1/2 md:pr-3']">
                    <div v-if="property.images?.length">
                        <PropertyGallery :images="property.images" />
                    </div>

                    <div class="card shadow-lg flex flex-col md:flex-row justify-between gap-2 mt-2">
                        <PropertyLocation :address="property?.address" />
                    </div>
                </div>

                <!-- Details section -->
                <div :class="['flex flex-col', viewMode === 'single' ? 'w-full' : 'md:w-1/2 md:pl-3']">
                    <div class="card flex flex-col shadow-lg mt-2">
                        <div class="flex justify-between items-center font-semibold text-xl text-primary-700">
                            <div>{{ property.category?.name }} / {{ property.subcategory?.name }}</div>
                            <PropertyListCurrency class="p-2" />
                        </div>
                        <PriceConverter :price="property.price" :isDisplayUAH="true" class="font-bold text-2xl text-blue-400" />
                        <PropertyUserInfo :creator="property.creator" />
                    </div>

                    <component v-if="property" :is="categoryComponentMap[category] || PropertyOther" :property="property" />

                    <PropertyDescription :property="property" :facilityReadiness="property.facilityReadiness" :description="property.description" class="mb-4" />
                </div>
            </div>

            <DgisMap
                :property="property"
                :isDelete="false"
                class="my-6"
                :class="{
                    'flex-col': true,
                    'md:flex-row': viewMode === 'double',
                    'md:w-1/2 m-auto': viewMode === 'single'
                }"
            />
        </Fluid>

        <Toast />

        <AddToListModal v-if="isRegister" :ad="property" :propertyId="propertyId" />
    </div>
</template>
