<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import Select from 'primevue/select';
import { useAreasStore } from '@/store/areasStore';
import { usePropertiesStore } from '@/store/propertiesCategories';
import { useApartmentsStore } from '@/store/apartments';
import { useRouter } from 'vue-router';
import { usePriceInUSD } from '@/composables/usePriceInUSD';

const { fetchExchangeRate, convertToUSD } = usePriceInUSD();
const router = useRouter();

// Stores
const areasStore = useAreasStore();
const propertiesStore = usePropertiesStore();
const apartmentsStore = useApartmentsStore();
const regions = apartmentsStore?.dropdowns.regions;

// Status options
const statusOptions = [
    { type: 'sell', label: 'ПРОДАЖ', icon: 'pi pi-home' },
    { type: 'rent', label: 'ОРЕНДА', icon: 'pi pi-key' },
    { type: 'exchange', label: 'ОБМІН', icon: 'pi pi-sync' },
    { type: 'daily', label: 'ПОДОБОВО', icon: 'pi pi-clock' }
];
const activeStatus = ref('');

// Property types
const propertyTypes = areasStore.realEstateItems;
const selectedTypes = ref(null);

// Location
const selectedRegion = computed({
    get: () => propertiesStore.getFilters['address.region.code'] || '',
    set: (val) => propertiesStore.setFilter('address.region.code', val)
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
        const rooms = propertiesStore.getFilters['rooms.all'];
        return Array.isArray(rooms) ? rooms : [];
    },
    set: (val) => propertiesStore.setFilter('rooms.all', val)
});

// Budget options
const budgetOptions = [
    { label: 'Любий', value: '' },
    { label: '$5,000', value: 5000 },
    { label: '$10,000', value: 10000 },
    { label: '$20,000', value: 20000 },
    { label: '$30,000', value: 30000 },
    { label: '$40,000', value: 40000 },
    { label: '$50,000', value: 50000 },
    { label: '$60,000', value: 60000 },
    { label: '$70,000', value: 70000 },
    { label: '$80,000', value: 80000 },
    { label: '$100,000', value: 100000 },
    { label: '$200,000', value: 200000 },
    { label: '$300,000', value: 300000 },
    { label: '$400,000', value: 400000 },
    { label: '$500,000', value: 500000 },
    { label: '$600,000', value: 600000 },
    { label: '$700,000', value: 700000 },
    { label: '$800,000', value: 800000 },
    { label: '$900,000', value: 900000 },
    { label: '$1,000,000', value: 1000000 }
];

const budgetOptionsRent = [
    { label: 'Любий', value: '' },
    { label: '1000 грн', value: 1000 },
    { label: '2000 грн', value: 2000 },
    { label: '3000 грн', value: 3000 },
    { label: '4000 грн', value: 4000 },
    { label: '5000 грн', value: 5000 },
    { label: '6000 грн', value: 6000 },
    { label: '7000 грн', value: 7000 },
    { label: '8000 грн', value: 8000 },
    { label: '9000 грн', value: 9000 },
    { label: '10,000 грн', value: 10000 },
    { label: '15,000 грн', value: 15000 },
    { label: '20,000 грн', value: 20000 },
    { label: '25,000 грн', value: 25000 },
    { label: '30,000 грн', value: 30000 },
    { label: '35,000 грн', value: 35000 },
    { label: '40,000 грн', value: 40000 },
    { label: '50,000 грн', value: 50000 },
    { label: '60,000 грн', value: 60000 },
    { label: '70,000 грн', value: 70000 },
    { label: '80,000 грн', value: 80000 },
    { label: '90,000 грн', value: 90000 },
    { label: '100,000 грн', value: 100000 }
];

const isRentCategory = computed(() => {
    return activeStatus.value === 'rent' || activeStatus.value === 'daily';
});

// Budget inputs
const budgetInputMin = ref(propertiesStore.getFilters['minPrice'] || '');
const budgetInputMax = ref(propertiesStore.getFilters['maxPrice'] || '');

// Budget display values
const usdMinDisplay = ref('...');
const usdMaxDisplay = ref('...');

// Handle budget changes
const handleBudgetChange = async () => {
    if (isRentCategory.value) {
        // For rent - convert from UAH to USD
        if (budgetInputMin.value) {
            try {
                const convertedMin = await convertToUSD(budgetInputMin.value, 'UAH');
                usdMinDisplay.value = convertedMin ? `$${convertedMin.toFixed(2)}` : 'N/A';
                propertiesStore.setFilter('minPrice', convertedMin);
            } catch (error) {
                console.error('Error converting min budget:', error);
                usdMinDisplay.value = 'Error';
            }
        } else {
            usdMinDisplay.value = '';
            propertiesStore.setFilter('minPrice', null);
        }

        if (budgetInputMax.value) {
            try {
                const convertedMax = await convertToUSD(budgetInputMax.value, 'UAH');
                usdMaxDisplay.value = convertedMax ? `$${convertedMax.toFixed(2)}` : 'N/A';
                propertiesStore.setFilter('maxPrice', convertedMax);
            } catch (error) {
                console.error('Error converting max budget:', error);
                usdMaxDisplay.value = 'Error';
            }
        } else {
            usdMaxDisplay.value = '';
            propertiesStore.setFilter('maxPrice', null);
        }
    } else {
        // For sale - use USD directly
        usdMinDisplay.value = budgetInputMin.value ? `$${budgetInputMin.value}` : '';
        usdMaxDisplay.value = budgetInputMax.value ? `$${budgetInputMax.value}` : '';
        propertiesStore.setFilter('minPrice', budgetInputMin.value || null);
        propertiesStore.setFilter('maxPrice', budgetInputMax.value || null);
    }
};

// Watch for budget changes
watch([budgetInputMin, budgetInputMax], handleBudgetChange, { immediate: true });

// Validate budget range
watch([budgetInputMin, budgetInputMax], ([min, max]) => {
    if (min && max && min > max) {
        console.warn('Мінімальний бюджет не може перевищувати максимальний');
        budgetInputMax.value = min;
    }
});

// Error handling
const showError = ref(false);
const errorMessage = ref('');

// Methods
const setActiveStatus = (status) => {
    activeStatus.value = status;
    showError.value = false;
    // Reset budgets when status changes
    budgetInputMin.value = '';
    budgetInputMax.value = '';
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
    budgetInputMin.value = '';
    budgetInputMax.value = '';
    showError.value = false;
    errorMessage.value = '';
};

onMounted(() => {
    fetchExchangeRate();
});
</script>

<template>
    <section class="relative mt-50 z-1">
        <div class="container mx-auto px-4 sm:px-0">
            <div class="w-full">
                <div class="flex flex-wrap justify-center sm:justify-center gap-2 mb-2 bg-transparent">
                    <button
                        v-for="status in statusOptions"
                        :key="status.type"
                        :class="[
                            'flex-1 sm:flex-initial p-3 rounded-lg transition-all duration-300 font-medium',
                            'flex items-center justify-center min-w-[120px] text-sm sm:text-base opacity-75',
                            activeStatus === status.type
                                ? 'bg-primary-500 text-white shadow-md transform scale-105 opacity-90'
                                : 'bg-surface-100 hover:bg-surface-200 text-surface-700 dark:bg-surface-800 dark:hover:bg-surface-700 dark:text-surface-300'
                        ]"
                        @click="setActiveStatus(status.type)"
                        type="button"
                    >
                        <i :class="[status.icon, 'mr-2']"></i>
                        <span class="uppercase text-base font-bold">{{ status.label }}</span>
                    </button>
                </div>

                <form v-if="activeStatus" class="houzez-search-form">
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:flex justify-between items-start gap-2">
                        <!-- Property Type -->
                        <div class="w-full flex flex-col">
                            <label class="mb-2 uppercase font-medium text-surface-700 dark:text-surface-300 text-sm sm:text-base"> Тип нерухомості </label>
                            <Select v-model="selectedTypes" :options="propertyTypes" optionLabel="title" optionValue="key" placeholder="Тип нерухомості" display="chip" class="w-full" @change="showError = false" />
                        </div>

                        <!-- Location -->
                        <div class="w-full flex flex-col">
                            <label class="mb-2 uppercase font-medium text-surface-700 dark:text-surface-300 text-sm sm:text-base"> Розташування </label>
                            <Select v-model="selectedRegion" :options="regions.map((i) => ({ name: i.name, value: i.code }))" optionLabel="name" optionValue="value" placeholder="Вибрати область" class="w-full" :filter="true" />
                        </div>

                        <!-- Bedrooms -->
                        <div class="w-full flex flex-col">
                            <label class="mb-2 uppercase font-medium text-surface-700 dark:text-surface-300 text-sm sm:text-base"> Кількість кімнат </label>
                            <Dropdown v-model="selectedRooms" :options="bedroomOptions" optionLabel="label" optionValue="value" placeholder="Кількість кімнат" class="w-full w-max-96" />
                        </div>

                        <!-- Budget -->
                        <div class="w-full flex flex-col">
                            <label class="mb-2 uppercase font-medium text-surface-700 dark:text-surface-300 text-sm sm:text-base"> Ваш бюджет {{ isRentCategory ? '(грн)' : '(USD)' }} </label>
                            <div class="flex flex-col sm:flex-row gap-2">
                                <Dropdown v-model="budgetInputMin" :options="isRentCategory ? budgetOptionsRent : budgetOptions" optionLabel="label" optionValue="value" placeholder="Мін. бюджет" class="w-full" />
                                <Dropdown v-model="budgetInputMax" :options="isRentCategory ? budgetOptionsRent : budgetOptions" optionLabel="label" optionValue="value" placeholder="Макс. бюджет" class="w-full" />
                            </div>
                            <div v-if="budgetInputMin || budgetInputMax" class="text-xs text-gray-500 mt-1">
                                Діапазон:
                                <span v-if="budgetInputMin">
                                    {{ budgetInputMin }} {{ isRentCategory ? 'грн' : 'USD' }}
                                </span>
                                <span v-else>Будь-який</span>
                                &mdash;
                                <span v-if="budgetInputMax">
                                    {{ budgetInputMax }} {{ isRentCategory ? 'грн' : 'USD' }}
                                </span>
                                <span v-else>Будь-який</span>
                            </div>
                        </div>

                        <!-- Search Button -->
                        <div class="flex items-end justify-between gap-2 h-full" style="height: 65px">
                            <Button icon="pi pi-search" class="w-full p-3 bg-primary-500 hover:bg-primary-600 text-white text-sm sm:text-base" @click="search" />
                            <Button icon="pi pi-times" class="p-3 bg-surface-100 hover:bg-surface-200 text-surface-700 dark:bg-surface-800 dark:hover:bg-surface-700 dark:text-surface-300" @click="resetFilters" v-tooltip="'Скинути фільтри'" />
                        </div>
                    </div>

                    <div v-if="showError" class="mt-4">
                        <p class="text-red-500 text-sm sm:text-base text-center sm:text-left">
                            {{ errorMessage }}
                        </p>
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

:deep(.p-multiselect),
:deep(.p-dropdown),
:deep(.p-selectbutton) {
    @apply w-full text-sm sm:text-base;
}

:deep(.p-dropdown-panel),
:deep(.p-multiselect-panel) {
    @apply text-sm sm:text-base;
}

:deep(.p-dropdown-item) {
    @apply py-3 px-4;
}

@media (max-width: 640px) {
    :deep(.p-dropdown-panel),
    :deep(.p-multiselect-panel) {
        @apply w-[calc(100vw-2rem)] max-w-full;
    }
}
</style>
