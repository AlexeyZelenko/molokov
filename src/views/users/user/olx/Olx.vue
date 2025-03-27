<template>
    <div class="p-4 max-w-md mx-auto space-y-4">
        <NovaPoshta />

        <div>
            <label for="region-select" class="block text-sm font-medium text-gray-700 mb-2">
                Виберіть регіон
            </label>
            <select
                id="region-select"
                v-model="selectedRegionId"
                @change="fetchCities"
                :disabled="isLoading"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <option value="" disabled>
                    {{ isLoading ? 'Завантаження...' : 'Оберіть регіон' }}
                </option>
                <option
                    v-for="region in regions"
                    :key="region.id"
                    :value="region.id"
                >
                    {{ region.name }}
                </option>
            </select>
        </div>

        <div v-if="selectedRegionId" class="space-y-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">
                Міста регіону
            </label>
            <div v-if="isCitiesLoading" class="flex items-center justify-center">
                <svg class="animate-spin h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
            <div v-else-if="regionCities && regionCities.length > 0" class="space-y-4">
                <!-- District grouping -->
                <div v-for="(districtCities, district) in citiesByDistrict" :key="district" class="border border-gray-200 rounded-md overflow-hidden">
                    <!-- District header -->
                    <div class="bg-gray-100 px-4 py-2 font-medium text-gray-700 border-b border-gray-200">
                        {{ district || 'Без району' }}
                    </div>

                    <!-- Cities in this district -->
                    <div class="divide-y divide-gray-200">
                        <div
                            v-for="city in districtCities"
                            :key="city.id"
                            class="border-t border-gray-200 first:border-t-0"
                        >
                            <button
                                @click="toggleCityDetails(city.id)"
                                :disabled="cityDetailsLoading"
                                class="w-full px-4 py-2 text-left bg-white hover:bg-gray-50 transition-colors duration-300
                                       flex items-center justify-between
                                       disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span>{{ city.name }}</span>
                                <div class="flex items-center">
                                    <svg
                                        v-if="cityDetailsLoading && currentLoadingCityId === city.id"
                                        class="animate-spin h-4 w-4 text-gray-400 ml-2"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <svg
                                        class="h-5 w-5 text-gray-400 transform transition-transform duration-300 ml-2"
                                        :class="{ 'rotate-180': selectedCityId === city.id }"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fill-rule="evenodd"
                                            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                                            clip-rule="evenodd"
                                        />
                                    </svg>
                                </div>
                            </button>

                            <div
                                v-if="selectedCityId === city.id && cityDetails"
                                class="p-4 bg-gray-50 rounded-b-md animate-fade-in"
                            >
                                <strong class="block mb-2 text-lg text-gray-800">Деталі міста:</strong>
                                <div class="bg-white p-3 rounded shadow-inner text-sm overflow-x-auto">
                                    <pre>{{ JSON.stringify(cityDetails, null, 2) }}</pre>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else-if="!isCitiesLoading" class="text-gray-500 text-center py-4">
                Немає доступних міст для цього регіону
            </div>
        </div>

        <div v-if="error" class="text-red-500 mt-4 bg-red-50 p-3 rounded animate-shake">
            <strong>Помилка:</strong> {{ error }}
        </div>
    </div>
</template>

<script>
import { ref, reactive, onMounted, computed } from 'vue';
import NovaPoshta from './NovaPoshta.vue';
import {
    fetchOlxRegions,
    fetchOlxCities,
    fetchOlxCityDetails,
} from "@/services/olxService";

export default {
    components: {
        NovaPoshta,
    },
    setup() {
        const cityDetails = ref(null);
        const error = ref(null);
        const isLoading = ref(false);
        const selectedRegionId = ref('');
        const selectedCityId = ref(null);
        const cityDetailsLoading = ref(false);
        const currentLoadingCityId = ref(null);

        // Computed properties
        const isCitiesLoading = computed(() => {
            return selectedRegionId.value && !cities[selectedRegionId.value];
        });

        const regionCities = computed(() => cities[selectedRegionId.value] || []);

        const citiesByDistrict = computed(() => {
            if (!selectedRegionId.value || !cities[selectedRegionId.value]) return {};

            return cities[selectedRegionId.value].reduce((acc, city) => {
                const district = city.municipality || "Без району"; // Проверяем наличие municipality
                if (!acc[district]) {
                    acc[district] = [];
                }
                acc[district].push(city);
                return acc;
            }, {});
        });

        // Methods
        const fetchRegions = async () => {
            isLoading.value = true;
            error.value = null;
            try {
                regions.value = await fetchOlxRegions();
            } catch (err) {
                error.value = err.message || "Сталася помилка під час завантаження регіонів";
            } finally {
                isLoading.value = false;
            }
        };

        const fetchCities = async () => {
            if (!selectedRegionId.value) return;

            // Reset previous selections
            cityDetails.value = null;
            selectedCityId.value = null;

            // Skip if we already have these cities
            if (cities[selectedRegionId.value]) return;

            error.value = null;
            try {
                console.log(">>>", selectedRegionId.value);
                const response = await fetchOlxCities(26900);

                console.log(">>>", response);
                cities[selectedRegionId.value] = response.filter(city => city.region_id == Number(selectedRegionId.value));
            } catch (err) {
                error.value = err.message || "Сталася помилка під час завантаження міст";
                // Set an empty array to prevent continuous loading
                cities[selectedRegionId.value] = [];
            }
        };

        const fetchCityDetails = async (cityId) => {
            cityDetailsLoading.value = true;
            currentLoadingCityId.value = cityId;
            error.value = null;
            try {
                console.log(">>>", cityId);
                cityDetails.value = await fetchOlxCityDetails(cityId);
            } catch (err) {
                error.value = err.message || "Сталася помилка під час завантаження деталей міста";
            } finally {
                cityDetailsLoading.value = false;
                currentLoadingCityId.value = null;
            }
        };

        const toggleCityDetails = async (cityId) => {
            if (selectedCityId.value === cityId) {
                selectedCityId.value = null;
                return;
            }

            selectedCityId.value = cityId;
            currentLoadingCityId.value = cityId;
            cityDetailsLoading.value = true;

            try {
                const response = await fetchOlxCityDetails(cityId);
                cityDetails.value = response;
            } catch (err) {
                error.value = "Не вдалося завантажити деталі міста";
            } finally {
                cityDetailsLoading.value = false;
                currentLoadingCityId.value = null;
            }
        };

        // Fetch regions on component mount
        onMounted(fetchRegions);
        onMounted(async () => {
            try {
                areas.value = await getAreas();
                console.log("areas", areas.value);
            } catch (error) {
                // Обработка ошибки
                console.error("Ошибка при получении областей", error)
            }
        });

        return {
            regions,
            cities,
            cityDetails,
            error,
            isLoading,
            isCitiesLoading,
            cityDetailsLoading,
            currentLoadingCityId,
            selectedRegionId,
            selectedCityId,
            regionCities,
            fetchRegions,
            fetchCities,
            fetchCityDetails,
            toggleCityDetails,
            citiesByDistrict
        };
    }
};
</script>

<style scoped>
/* Custom animations */
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
}

.animate-fade-in {
    animation: fadeIn 0.3s ease-out;
}

.animate-shake {
    animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
}
</style>
