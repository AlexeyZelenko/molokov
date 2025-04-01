<script setup>
import { ref, watch, computed, onMounted } from 'vue';
import { getAreas, getSettlements } from '@/services/novaPoshtaService';

const areas = ref([]);
const settlements = ref([]);
const searchQuery = ref('');
const citiesNova = ref([]);

const selectedArea = ref('');
const selectedSettlement = ref(null);

const selectCity = (city) => {
    selectedSettlement.value = city;
    searchQuery.value = ''; // Очищаем поле поиска после выбора
    citiesNova.value = [];
};

onMounted(async () => {
    try {
        areas.value = await getAreas();
    } catch (error) {
        console.error('Ошибка загрузки областей:', error);
    }
});

const filteredCities = computed(() => {
    return citiesNova.value.filter((city) => city.Description.toLowerCase().includes(searchQuery.value.toLowerCase()) && city.AreaDescription === selectedArea.value?.Description);
});

watch(searchQuery, async () => {
    if (!searchQuery.value) {
        citiesNova.value = [];
        return;
    }

    try {
        citiesNova.value = await getSettlements({ FindByString: searchQuery.value });
    } catch (error) {
        console.error('Ошибка поиска городов:', error);
        citiesNova.value = [];
    }
});
</script>

<template>
    <div class="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
        <div class="mb-6">
            <h2 class="text-xl font-semibold mb-2">Вибір області</h2>
            <select v-model="selectedArea" class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="" disabled>Виберіть область</option>
                <option v-for="area in areas" :key="area.Ref" :value="area">
                    {{ area.Description }}
                </option>
            </select>
        </div>

        <div class="mb-6">
            <input v-model="searchQuery" placeholder="Пошук міста" class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
            <ul v-if="filteredCities.length" class="mt-2 bg-gray-100 rounded-lg shadow-md divide-y">
                <li v-for="city in filteredCities" :key="city.Ref" @click="selectCity(city)" class="p-2 cursor-pointer hover:bg-blue-100">
                    <span>{{ city.Description }}</span>
                    <span v-if="city.RegionsDescription">({{ city.RegionsDescription }} р-н)</span>
                </li>
            </ul>
        </div>

        <p v-if="selectedSettlement" class="text-green-600 font-semibold">Вибраний населений пункт: {{ selectedSettlement.Description }}</p>
    </div>
</template>
