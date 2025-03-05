<template>
    <div class="p-4 max-w-md mx-auto space-y-4">
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

        <div v-if="cities[selectedRegionId]" class="space-y-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">
                Міста регіону
            </label>
            <div v-if="citiesLoading[selectedRegionId]" class="flex items-center justify-center">
                <svg class="animate-spin h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
            <div v-else class="space-y-2">
                <div
                    v-for="city in cities[selectedRegionId]"
                    :key="city.id"
                    class="border border-gray-200 rounded-md"
                >
                    <button
                        @click="toggleCityDetails(city.id)"
                        :disabled="cityDetailsLoading"
                        class="w-full px-3 py-2 text-left bg-white hover:bg-gray-50 transition-colors duration-300
                               flex items-center justify-between rounded-md
                               disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span>{{ city.name }}</span>
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
                            class="h-5 w-5 text-gray-400 transform transition-transform duration-300"
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

        <div v-if="error" class="text-red-500 mt-4 bg-red-50 p-3 rounded animate-shake">
            <strong>Помилка:</strong> {{ error }}
        </div>
    </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';
import {
    fetchOlxRegions,
    fetchOlxCities,
    fetchOlxCityDetails,
} from "@/services/olxService";

export default {
    setup() {
        const regions = ref([]);
        const cities = reactive({});
        const cityDetails = ref(null);
        const error = ref(null);
        const isLoading = ref(false);
        const citiesLoading = reactive({});
        const cityDetailsLoading = ref(false);
        const currentLoadingCityId = ref(null);
        const selectedRegionId = ref('');
        const selectedCityId = ref(null);

        const fetchOlxregions = async () => {
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

            // Prevent multiple simultaneous loading
            if (citiesLoading[selectedRegionId.value]) return;

            citiesLoading[selectedRegionId.value] = true;
            error.value = null;
            try {
                cities[selectedRegionId.value] = await fetchOlxCities(selectedRegionId.value);
            } catch (err) {
                error.value = err.message || "Сталася помилка під час завантаження міст";
            } finally {
                citiesLoading[selectedRegionId.value] = false;
            }
        };

        const fetchCityDetails = async (cityId) => {
            cityDetailsLoading.value = true;
            currentLoadingCityId.value = cityId;
            error.value = null;
            try {
                cityDetails.value = await fetchOlxCityDetails(cityId);
            } catch (err) {
                error.value = err.message || "Сталься помилка під час завантаження деталей міста";
            } finally {
                cityDetailsLoading.value = false;
                currentLoadingCityId.value = null;
            }
        };

        const toggleCityDetails = async (cityId) => {
            // If the same city is clicked again, close the details
            if (selectedCityId.value === cityId) {
                selectedCityId.value = null;
                cityDetails.value = null;
                return;
            }

            // Set the selected city
            selectedCityId.value = cityId;

            // Fetch city details
            await fetchCityDetails(cityId);
        };

        // Fetch regions on component mount
        onMounted(fetchOlxregions);

        return {
            regions,
            cities,
            cityDetails,
            error,
            isLoading,
            citiesLoading,
            cityDetailsLoading,
            currentLoadingCityId,
            selectedRegionId,
            selectedCityId,
            fetchOlxregions,
            fetchCities,
            fetchCityDetails,
            toggleCityDetails
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
