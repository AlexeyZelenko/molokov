<script setup>
import { ref, computed, onMounted } from 'vue'; // Додали onMounted
import Card from 'primevue/card';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';

import AgencyDetails from './AgencyDetails.vue';
import { useAgencyStore } from '@/store/agencyStore'; // Імпортуємо ваш Store

// Дані
const selectedAgency = ref(null);

// Отримуємо доступ до Store
const agencyStore = useAgencyStore();

// Завантажуємо агентства при монтуванні компонента
onMounted(async () => {
    console.log('Fetching agencies on mount');
    await agencyStore.fetchAgencies();
});


// Стейты поиска и фильтра
const search = ref('');
const selectedCity = ref(null);

// Массив городов для выпадающего списка
// Тепер формується з агентств, отриманих зі Store
const cities = computed(() => {
    // Перевіряємо, чи агентства завантажені і чи є поле city (яке тепер об'єкт)
    if (!agencyStore.agencies || agencyStore.agencies.length === 0) {
        return [];
    }
    // Витягуємо Description з об'єкта city, фільтруємо null/undefined, отримуємо унікальні
    const allCities = agencyStore.agencies
        .map((a) => a.city?.Description) // Припускаємо, що city - об'єкт з полем Description
        .filter(Boolean); // Видаляємо null, undefined або порожні рядки

    const uniqueCities = [...new Set(allCities)];
    // Формуємо опції для Dropdown { label: 'Назва міста', value: 'Назва міста' }
    return uniqueCities.map((cityDescription) => ({ label: cityDescription, value: cityDescription }));
});

// Фильтрация
// Тепер фільтруємо агентства, отримані зі Store
const filteredAgencies = computed(() => {
    if (!agencyStore.agencies) { // Перевірка, якщо агентства ще не завантажені
        return [];
    }
    return agencyStore.agencies.filter((agency) => {
        const matchesName = agency.name.toLowerCase().includes(search.value.toLowerCase());
        // При фільтрації за містом, порівнюємо Description об'єкта міста з вибраним значенням (яке є рядком)
        const matchesCity = selectedCity.value ? agency.city?.Description === selectedCity.value : true;
        return matchesName && matchesCity;
    });
});
</script>

<template>
    <AgencyDetails v-if="selectedAgency" :agency="selectedAgency" @back="selectedAgency = null" />

    <div v-else class="min-h-screen bg-gray-50">
        <div class="container mx-auto px-4 py-8">
            <h1 class="text-3xl font-bold text-blue-800 mb-6 text-center">Список агентств нерухомості</h1>

            <div v-if="agencyStore.loading" class="text-center text-blue-600 mt-10">
                <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
                <p>Завантаження агентств...</p>
            </div>

            <div v-else-if="agencyStore.error" class="text-center text-red-600 mt-10">
                <i class="pi pi-exclamation-triangle" style="font-size: 2rem"></i>
                <p>Помилка завантаження агентств:</p>
                <p>{{ agencyStore.error }}</p>
            </div>

            <div v-else class="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="p-input-icon-left flex w-full items-center">
                    <i class="pi pi-search" />
                    <InputText v-model="search" placeholder="Пошук за назвою агентства..." class="w-full ml-2" />
                </div>

                <Dropdown v-model="selectedCity" :options="cities" option-label="label" option-value="value" placeholder="Оберіть місто" class="w-full" show-clear />
            </div>

            <div v-if="!agencyStore.loading && !agencyStore.error && filteredAgencies.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card v-for="agency in filteredAgencies" :key="agency.id" class="shadow-md hover:shadow-xl transition-shadow duration-300">
                    <template #header>
                        <section class="flex items-center m-4">
                            <Avatar :image="agency.logoUrl" class="mr-2" size="xlarge" shape="circle" alt="Логотип агентства" />
                            <h2 class="text-xl font-semibold text-blue-700 inline-block">{{ agency.name }}</h2>
                        </section>
                    </template>

                    <template #title>
                    </template>

                    <template #content>
                        <p class="text-sm text-gray-600 mb-2"><i class="pi pi-map-marker mr-2"></i>{{ agency.city?.Description || 'Не вказано' }}</p>
                        <p class="text-sm text-gray-600 mb-2"><i class="pi pi-phone mr-2"></i>{{ agency.phone && agency.phone.length > 0 ? agency.phone[0] : 'Не вказано' }}</p>
                        <p class="text-sm text-gray-600 mb-2"><i class="pi pi-envelope mr-2"></i>{{ agency.email || 'Не вказано' }}</p>
                    </template>

                    <template #footer>
                        <div class="flex justify-between items-center mt-4">
                            <!-- <Tag severity="info" :value="`агентів  ${agency.agents || 0}`" />
                            <Tag severity="info" :value="`об\'єктів  ${agency.objects || 0}`" /> -->

                            <Button label="Деталі" icon="pi pi-info-circle" class="p-button-sm" @click="selectedAgency = agency"/>
                        </div>
                    </template>
                </Card>
            </div>

            <div v-else-if="!agencyStore.loading && !agencyStore.error && filteredAgencies.length === 0" class="text-center text-gray-500 mt-10">
                <p v-if="search || selectedCity">За вашим запитом нічого не знайдено.</p>
                <p v-else>Агентства ще не додані.</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Ваші стилі */
</style>
