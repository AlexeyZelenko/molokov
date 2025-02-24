<template>
    <div v-if="!property.title">
        <Skeleton />
    </div>
    <div v-else>
        <div class="flex flex-col md:flex-row items-center justify-start mb-4">
            <h1 class="font-semibold text-2xl mr-4">{{ property.title }}</h1>
            <SocialShare
                :property="property"
                :adUrl="fullUrl"
                :title="property.title"
                :description="property.price"
                :image="property.images[0]"
                class="ml-4"
            />
        </div>

        <Fluid class="flex flex-col md:flex-row gap-8">
            <div class="md:w-1/2">
                <div v-if="property.images?.length">
                    <PropertyGallery
                        v-if="property.images?.length"
                        :images="property.images"
                    />
                </div>

                <div class="card shadow-lg flex flex-col md:flex-row justify-between gap-4 mt-8">
                    <PropertyLocation
                        :address="property?.address"
                    />
                </div>
            </div>

            <div class="md:w-1/2">
                <div class="card flex flex-col gap-4 shadow-lg">
                    <div class="font-semibold text-xl text-primary-700">
                        {{ property.category?.name }} / {{ property.subcategory?.name }}
                    </div>
                    <PriceConverter
                        :price="property.price"
                        :isDisplayUAH=true
                        class="font-bold text-2xl text-blue-400"
                    />
                    <PropertyUserInfo :creator="property.creator" />
                </div>

                <component
                    v-if="property"
                    :is="categoryComponentMap[category] || PropertyOther"
                    :property="property"
                />
            </div>
        </Fluid>

        <PropertyDescription
            :property="property"
            :facilityReadiness="property.facilityReadiness"
            :description="property.description"
            class="mb-4"
        />

        <Toast />

        <AddToListModal
            v-if="isRegister"
            :ad="property"
            :propertyId="propertyId"
        />

        <DgisMap
            :property="property"
            :isDelete="false"
            class="my-6"
        />
    </div>
</template>

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
import PropertyFloors from './floors/PropertyFloors.vue';

import PropertyApartment from './categories/apartment/index.vue';
import PropertyHouse from './categories/house/index.vue';
import PropertyCommercial from './categories/commercial/index.vue';
import PropertyLand from './categories/land/index.vue';
import PropertyOffice from './categories/office/index.vue';
import PropertyOther from './categories/other/index.vue';

import DgisMap from "@/components/maps/DgisMap.vue";
import SocialShare from "@/components/SocialShare.vue";
import PriceConverter from "@/components/price/PriceConverter.vue";
import PropertyUserInfo from "@/components/properties/list/PropertyUserInfo.vue";

const route = useRoute();

const userStore = useUserStore();
const isRegister = computed(() => {
    return userStore.user?.id || null;
});

const categoryComponentMap = {
    'apartments': PropertyApartment,
    'houses': PropertyHouse,
    'commercial': PropertyCommercial,
    'land': PropertyLand,
    'offices': PropertyOffice,
    'other': PropertyOther
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
