<template>
    <div v-if="!property.title">
        <div class="rounded border border-surface-200 dark:border-surface-700 p-6 bg-surface-0 dark:bg-surface-900">
            <div class="flex mb-4">
                <Skeleton shape="circle" size="4rem" class="mr-2"></Skeleton>
                <div>
                    <Skeleton width="10rem" class="mb-2"></Skeleton>
                    <Skeleton width="5rem" class="mb-2"></Skeleton>
                    <Skeleton height=".5rem"></Skeleton>
                </div>
            </div>
            <Skeleton width="100%" height="150px"></Skeleton>
            <div class="flex justify-between mt-4">
                <Skeleton width="4rem" height="2rem"></Skeleton>
                <Skeleton width="4rem" height="2rem"></Skeleton>
            </div>
        </div>

        <div class="rounded border border-surface-200 dark:border-surface-700 p-6 bg-surface-0 dark:bg-surface-900">
            <div class="flex mb-4">
                <Skeleton shape="circle" size="4rem" class="mr-2"></Skeleton>
                <div>
                    <Skeleton width="10rem" class="mb-2"></Skeleton>
                    <Skeleton width="5rem" class="mb-2"></Skeleton>
                    <Skeleton height=".5rem"></Skeleton>
                </div>
            </div>
            <Skeleton width="100%" height="150px"></Skeleton>
            <div class="flex justify-between mt-4">
                <Skeleton width="4rem" height="2rem"></Skeleton>
                <Skeleton width="4rem" height="2rem"></Skeleton>
            </div>
        </div>
    </div>
    <div v-else>
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

                <PropertyFloors
                    :property="property"
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
            class="mb-4"
        />

        <Toast />

        <AddToListModal
            v-if="isRegister"
            :ad="property"
            :propertyId="propertyId"
        />

        <SocialShare
            :property="property"
            :adUrl="fullUrl"
            :title="property.title"
            :description="property.price"
            :image="property.images[0]"
            class="ml-4"
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
import AddToListModal from '@/components/AddToListModal.vue';

import PropertyGallery from './gallery/PropertyGallery.vue';
import PropertyLocation from './location/PropertyLocation.vue';
import PropertyDescription from './descriptions/PropertyDescription.vue';
import PropertyContacts from './contacts/PropertyContacts.vue';
import PropertyAmenities from './amenities/PropertyAmenities.vue';
import PropertyReadiness from './readiness/PropertyReadiness.vue';
import PropertyFloors from './floors/PropertyFloors.vue';

import PropertyApartment from './categories/apartment/index.vue';
import PropertyHouse from './categories/house/index.vue';
import PropertyCommercial from './categories/commercial/index.vue';
import PropertyLand from './categories/land/index.vue';
import PropertyOffice from './categories/office/index.vue';
import PropertyOther from './categories/other/index.vue';

import DgisMap from "@/components/maps/DgisMap.vue";
import SocialShare from "@/components/SocialShare.vue";

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
        message: ''
    },
});

onMounted(async () => {
    await loadPropertyData(category, subcategory, propertyId);
});


const loadPropertyData = async (category, subcategory, id) => {
    console.log('category:', category);
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
