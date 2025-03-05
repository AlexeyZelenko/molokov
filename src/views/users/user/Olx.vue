<template>
    <div>
        <button @click="fetchOlxregions">Отримати регіони України</button>
        <div v-if="regions.length">
            <div v-for="region in regions" :key="region.id">
                {{ region.id }} - {{ region.name || "Цена не указана" }}
            </div>
        </div>
        <div v-if="error" style="color: red;">{{ error }}</div>
    </div>
</template>

<script>
import {fetchOlxRegions} from "@/services/olxService";

export default {
    data() {
        return {
            regions: [],
            error: null,
        };
    },
    methods: {
        async fetchOlxregions() {
            try {
                const regions = await fetchOlxRegions();
                this.regions = regions;
                console.log(regions);
            } catch (error) {
                this.error = error.message || "Сталася помилка під час завантаження даних";
            }
        },
    },
};
</script>
