<template>
    <div class="p-4">
        <button
            @click="fetchOlxregions"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
        >
            Отримати регіони України
        </button>
        <div v-if="regions.length">
            <div
                v-for="region in regions"
                :key="region.id"
                class="mb-2"
            >
                <button
                    @click="toggleCities(region.id)"
                    class="text-left font-semibold hover:underline"
                >
                    {{ region.name || "Ціна не вказана" }}
                </button>
                <div v-if="region.showCities && cities[region.id]">
                    <div
                        v-for="city in cities[region.id]"
                        :key="city.id"
                        class="pl-4 hover:bg-gray-100 cursor-pointer"
                        @click="fetchCityDetails(city.id)"
                    >
                        {{ city.name }}
                    </div>
                </div>
            </div>
        </div>
        <div v-if="cityDetails" class="mt-4 p-4 border rounded">
            <strong>Деталі міста:</strong>
            <pre>{{ cityDetails }}</pre>
        </div>
        <div v-if="error" class="text-red-500 mt-4">{{ error }}</div>
    </div>
</template>

<script>
import { fetchOlxRegions, fetchOlxCities, fetchOlxCityDetails } from "@/services/olxService";

export default {
    data() {
        return {
            regions: [],
            cities: {},
            cityDetails: null,
            error: null,
        };
    },
    methods: {
        async fetchOlxregions() {
            try {
                this.regions = await fetchOlxRegions();
            } catch (error) {
                this.error = error.message || "Сталася помилка під час завантаження регіонів";
            }
        },
        async fetchCities(regionId) {
            try {
                this.cities[regionId] = await fetchOlxCities(regionId);
            } catch (error) {
                this.error = error.message || "Сталася помилка під час завантаження міст";
            }
        },
        async fetchCityDetails(cityId) {
            try {
                this.cityDetails = await fetchOlxCityDetails(cityId);
            } catch (error) {
                this.error = error.message || "Сталася помилка під час завантаження деталей міста";
            }
        },
        async toggleCities(regionId) {
            const region = this.regions.find(r => r.id === regionId);
            if (region) {
                region.showCities = !region.showCities;
                if (region.showCities && !this.cities[regionId]) {
                    await this.fetchCities(regionId);
                }
            }
        },
    },
};
</script>
