<script setup>
import { ref } from 'vue';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import MultiSelect from 'primevue/multiselect';

// Status options
const statusOptions = [
    { label: 'All Status', value: '' },
    { label: 'For Rent', value: 'for-rent' },
    { label: 'For Sale', value: 'for-sale' }
];
const activeStatus = ref('');

// Property types
const propertyTypes = [
    { label: 'Commercial', value: 'commercial' },
    { label: 'Office', value: 'office', parent: 'commercial' },
    { label: 'Shop', value: 'shop', parent: 'commercial' },
    { label: 'Residential', value: 'residential' },
    { label: 'Apartment', value: 'apartment', parent: 'residential' },
    { label: 'Condo', value: 'condo', parent: 'residential' },
    { label: 'Multi Family Home', value: 'multi-family-home', parent: 'residential' },
    { label: 'Single Family Home', value: 'single-family-home', parent: 'residential' },
    { label: 'Studio', value: 'studio', parent: 'residential' },
    { label: 'Villa', value: 'villa', parent: 'residential' }
];
const selectedTypes = ref([]);

// Locations
const locations = [
    { label: 'All Cities', value: '' },
    { label: 'Chicago', value: 'chicago', region: 'Illinois' },
    { label: 'Los Angeles', value: 'los-angeles', region: 'California' },
    { label: 'Miami', value: 'miami', region: 'Florida' },
    { label: 'New York', value: 'new-york', region: 'New York' }
];
const selectedLocation = ref('');

// Bedrooms
const bedroomOptions = [
    { label: 'Bedrooms', value: '' },
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
    { label: '4', value: '4' },
    { label: '5', value: '5' },
    { label: '6', value: '6' },
    { label: '7', value: '7' },
    { label: '8', value: '8' },
    { label: '9', value: '9' },
    { label: '10', value: '10' },
    { label: 'Any', value: 'any' }
];
const selectedBedrooms = ref('');

// Budget options
const budgetOptions = [
    { label: 'Max. Price', value: '' },
    { label: 'Any', value: 'any' },
    { label: '$5,000', value: '5000' },
    { label: '$10,000', value: '10000' },
    { label: '$50,000', value: '50000' },
    { label: '$100,000', value: '100000' },
    { label: '$200,000', value: '200000' },
    { label: '$300,000', value: '300000' },
    { label: '$400,000', value: '400000' },
    { label: '$500,000', value: '500000' },
    { label: '$600,000', value: '600000' },
    { label: '$700,000', value: '700000' },
    { label: '$800,000', value: '800000' },
    { label: '$900,000', value: '900000' },
    { label: '$1,000,000', value: '1000000' },
    { label: '$1,500,000', value: '1500000' },
    { label: '$2,000,000', value: '2000000' },
    { label: '$2,500,000', value: '2500000' },
    { label: '$5,000,000', value: '5000000' },
    { label: '$10,000,000', value: '10000000' }
];
const selectedBudget = ref('');

// Methods
const setActiveStatus = (status) => {
    activeStatus.value = status;
};

const handleSubmit = () => {
    const searchParams = {
        status: activeStatus.value,
        types: selectedTypes.value,
        location: selectedLocation.value,
        bedrooms: selectedBedrooms.value,
        maxPrice: selectedBudget.value
    };

    console.log('Search submitted:', searchParams);
    // Here you would typically emit an event or call an API
    // this.$emit('search', searchParams);
};
</script>

<template>
    <section class="py-12 px-4 md:px-6 lg:px-8">
        <div class="container mx-auto">
            <div class="w-full">
                <form class="houzez-search-form" @submit.prevent="handleSubmit">
                    <!-- Status Tabs -->
                    <div class="flex flex-wrap gap-2 mb-6 bg-transparent">
                        <Button
                            v-for="status in statusOptions"
                            :key="status.value"
                            :label="status.label"
                            :class="['p-2', 'rounded-md', 'transition-colors', activeStatus === status.value ? 'bg-primary-500 text-white' : 'bg-gray-100 hover:bg-gray-200']"
                            @click="setActiveStatus(status.value)"
                            type="button"
                        />
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <!-- Property Type -->
                        <div class="flex flex-col">
                            <label class="mb-2 font-medium">Looking for</label>
                            <MultiSelect v-model="selectedTypes" :options="propertyTypes" optionLabel="label" optionValue="value" placeholder="Property Type" display="chip" class="w-full" :filter="true" />
                        </div>

                        <!-- Location -->
                        <div class="flex flex-col">
                            <label class="mb-2 font-medium">Location</label>
                            <Dropdown v-model="selectedLocation" :options="locations" optionLabel="label" optionValue="value" placeholder="All Cities" class="w-full" :filter="true" />
                        </div>

                        <!-- Bedrooms -->
                        <div class="flex flex-col">
                            <label class="mb-2 font-medium">Property Size</label>
                            <Dropdown v-model="selectedBedrooms" :options="bedroomOptions" optionLabel="label" optionValue="value" placeholder="Bedrooms" class="w-full" />
                        </div>

                        <!-- Budget -->
                        <div class="flex flex-col">
                            <label class="mb-2 font-medium">Your budget</label>
                            <Dropdown v-model="selectedBudget" :options="budgetOptions" optionLabel="label" optionValue="value" placeholder="Max. Price" class="w-full" :filter="true" />
                        </div>

                        <!-- Search Button -->
                        <div class="flex items-end">
                            <Button label="Search" icon="pi pi-search" class="w-full p-3 bg-primary-500 hover:bg-primary-600 text-white" type="submit" />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </section>
</template>

<style scoped>
.houzez-search-form {
    @apply bg-white p-6 rounded-lg shadow-md;
}

.p-multiselect,
.p-dropdown {
    @apply w-full;
}

.p-button {
    @apply transition-colors duration-200;
}
</style>
