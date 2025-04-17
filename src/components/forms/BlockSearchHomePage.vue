<script setup>
import { ref, computed } from 'vue';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import { useAreasStore } from '@/store/areasStore';
import { usePropertiesStore } from '@/store/propertiesCategories';
import { useAddressFilters } from '@/composables/useAddressFilters';
import { useApartmentsStore } from '@/store/apartments';
import { useRouter } from 'vue-router';

const router = useRouter();

const filters = ref({
  'address.region.code': null,
  'address.city.code': null,
});

const { region, city, area } = useAddressFilters(filters);

const areasStore = useAreasStore();
const apartmentsStore = useApartmentsStore();
const regions = apartmentsStore?.dropdowns.regions;

// Status options
const statusOptions = [
    { type: 'sell', label: 'Продаж', icon: 'pi pi-home' },
    { type: 'rent', label: 'Оренда', icon: 'pi pi-key' },
    { type: 'exchange', label: 'Обмін', icon: 'pi pi-sync' },
    { type: 'daily', label: 'Подобово', icon: 'pi pi-clock' }
];
const activeStatus = ref('');

// Property types
const propertyTypes = areasStore.realEstateItems;
const selectedTypes = ref(null);

// Розташування (location)
const selectedRegion = computed({
  get: () => areasStore.getFilters['address.region.code'] || '',
  set: val => areasStore.setFilter('address.region.code', val)
});

// Bedrooms
const bedroomOptions = [
    { label: 'Всі', value: [] },
    { label: '1', value: [1] },
    { label: '2', value: [2] },
    { label: '3', value: [3] },
    { label: '4', value: [4] },
    { label: '5', value: [5] },
    { label: '6', value: [6] },
    { label: '7', value: [7] },
    { label: '8', value: [8] },
    { label: '9', value: [9] },
    { label: '10', value: [10] },
    { label: '1-2', value: [1, 2] },
    { label: '2-3', value: [2, 3] },
    { label: '3-4', value: [3, 4] },
    { label: '4+', value: [4, 5, 6, 7, 8, 9, 10] }
];
const selectedRooms = computed({
    get: () => {
        const rooms = areasStore.getFilters['rooms.all'];
        return Array.isArray(rooms) ? rooms : [];
    },
    set: val => areasStore.setFilter('rooms.all', val)
});

// Budget options
const budgetOptions = [    
    { label: 'Невибрано', value: '' },
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
const selectedBudget = computed({
  get: () => areasStore.getFilters['maxPrice'] || '',
  set: val => areasStore.setFilter('maxPrice', val)
});

// Error handling
const showError = ref(false);
const errorMessage = ref('');

// Methods
const setActiveStatus = (status) => {
    activeStatus.value = status;
    showError.value = false;
};

const search = () => {
    if (!selectedTypes.value) {
        showError.value = true;
        errorMessage.value = 'Виберіть тип нерухомості';
        return;
    }
    if (!activeStatus.value) {
        showError.value = true;
        errorMessage.value = 'Виберіть статус';
        return;
    }
    
    router.push(`/categories/${selectedTypes.value}/${activeStatus.value}`);
};

// Reset filters
const resetFilters = () => {
    selectedTypes.value = null;
    activeStatus.value = '';
    selectedRegion.value = '';
    selectedRooms.value = [];
    selectedBudget.value = '';
    showError.value = false;
    errorMessage.value = '';
};
</script>

<template>
    <section class="relative mt-50 z-1">        
        <div class="container mx-auto px-4 sm:px-0">
            <div class="w-full">
                <div class="flex flex-wrap justify-center sm:justify-center gap-2 mb-2 bg-transparent">
                        <button
                            v-for="status in statusOptions"
                            :key="status.type"
                            :label="status.label"
                            :icon="status.icon"
                            :class="[
                                'flex-1',
                                'sm:flex-initial',
                                'p-3',
                                'rounded-lg',
                                'transition-all',
                                'duration-300',
                                'font-medium',
                                'flex',
                                'items-center',
                                'justify-center',
                                'min-w-[120px]',
                                'text-sm',
                                'sm:text-base',
                                'opacity-75',
                                activeStatus === status.type 
                                    ? 'bg-primary-500 text-white shadow-md transform scale-105 opacity-90' 
                                    : 'bg-surface-100 hover:bg-surface-200 text-surface-700 dark:bg-surface-800 dark:hover:bg-surface-700 dark:text-surface-300'
                            ]"
                            @click="setActiveStatus(status.type)"
                            type="button"
                        >
                            <i :class="[status.icon, 'mr-2']"></i>
                            <span>{{ status.label }}</span>
                        </button>
                    </div>
                <form v-if="activeStatus" class="houzez-search-form" @submit.prevent="handleSubmit">
                    <!-- Status Tabs -->
                    

                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        <!-- Property Type -->
                        <div class="flex flex-col">
                            <label class="mb-2 font-medium text-surface-700 dark:text-surface-300 text-sm sm:text-base">Тип нерухомості</label>
                            <Select 
                                v-model="selectedTypes" 
                                :options="propertyTypes" 
                                optionLabel="title" 
                                optionValue="key" 
                                placeholder="Тип нерухомості" 
                                display="chip" 
                                class="w-full" 
                                :filter="true"
                                @change="showError = false"
                            />
                        </div>

                        <!-- Розташування -->
                        <div class="flex flex-col">
                            <label class="mb-2 font-medium text-surface-700 dark:text-surface-300 text-sm sm:text-base">Розташування</label>
                            <Select
                                v-model="selectedRegion"
                                :options="regions.map((i) => ({ name: i.name, value: i.code }))"
                                optionLabel="name"
                                optionValue="value"
                                placeholder="Вибрати область"
                                class="w-full"
                                :filter="true"
                            />
                        </div>

                        <!-- Кількість кімнат -->
                        <div class="flex flex-col">
                            <label class="mb-2 font-medium text-surface-700 dark:text-surface-300 text-sm sm:text-base">Кількість кімнат</label>
                            <Dropdown 
                                v-model="selectedRooms" 
                                :options="bedroomOptions" 
                                optionLabel="label" 
                                optionValue="value" 
                                placeholder="Кількість кімнат" 
                                class="w-full" 
                            />
                        </div>

                        <!-- Budget -->
                        <div class="flex flex-col">
                            <label class="mb-2 font-medium text-surface-700 dark:text-surface-300 text-sm sm:text-base">Ваш бюджет</label>
                            <Dropdown 
                                v-model="selectedBudget" 
                                :options="budgetOptions" 
                                optionLabel="label" 
                                optionValue="value" 
                                placeholder="Макс. ціна" 
                                class="w-full" 
                            />
                        </div>

                        <!-- Search Button -->                         
                        <div class="flex items-end gap-2">
                            <Button
                                label="Пошук"
                                icon="pi pi-search"
                                class="w-full p-3 bg-primary-500 hover:bg-primary-600 text-white text-sm sm:text-base"
                                @click="search"
                            />
                            <Button
                                icon="pi pi-refresh"
                                class="p-3 bg-surface-100 hover:bg-surface-200 text-surface-700 dark:bg-surface-800 dark:hover:bg-surface-700 dark:text-surface-300"
                                @click="resetFilters"
                                v-tooltip="'Скинути фільтри'"
                            />
                        </div>
                    </div>
                    <div v-if="showError" class="mt-4">
                        <p class="text-red-500 text-sm sm:text-base text-center sm:text-left">{{ errorMessage }}</p>
                    </div>
                </form>
            </div>
        </div>
    </section>
</template>

<style scoped>
.houzez-search-form {
    @apply bg-surface-0 dark:bg-surface-900 p-4 sm:p-6 rounded-lg shadow-lg border border-surface-200 dark:border-surface-700;
}

.p-multiselect,
.p-dropdown {
    @apply w-full;
}

.p-button {
    @apply transition-colors duration-200;
}

:deep(.p-multiselect),
:deep(.p-dropdown) {
    @apply w-full text-sm sm:text-base;
}

:deep(.p-dropdown-panel) {
    @apply text-sm sm:text-base;
}

:deep(.p-button) {
    @apply transition-colors duration-200;
}

:deep(.p-dropdown-item) {
    @apply py-3 px-4;
}

@media (max-width: 640px) {
    :deep(.p-dropdown-panel) {
        @apply w-[calc(100vw-2rem)] max-w-full;
    }
    
    :deep(.p-multiselect-panel) {
        @apply w-[calc(100vw-2rem)] max-w-full;
    }
}
</style>
