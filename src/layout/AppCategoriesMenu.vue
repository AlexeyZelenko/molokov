<script setup>
import { computed } from 'vue'
import { usePropertiesStore } from '@/store/propertiesCategories';
import ApartmentsSell from '@/components/filters/apartments/sell.vue'
import ApartmentsRent from '@/components/filters/apartments/rent.vue'

// Map of components
const componentMap = {
    ApartmentsSell,
    ApartmentsRent,
}

// Use Pinia store
const componentStore = usePropertiesStore()

// Dynamically select component based on store state
const DynamicComponent = computed(() => {
    return componentMap[componentStore.currentComponent] || ApartmentsSell
})
</script>

<template>
    <component :is="DynamicComponent" />
</template>
