<script setup>
import { computed } from 'vue';
import { useAnalyticsStore } from '@/store/analytics';
import { useRouter } from 'vue-router';

// Получаем доступ к store и router
const analyticsStore = useAnalyticsStore();
const router = useRouter();

// Используем computed для динамического вычисления данных
const products = computed(() => analyticsStore.properties['sell']);

// Метод для перехода на страницу
const showProperty = (property) => {
    router.push(`/pages/apartments/view/${property.id}?category=${property.category.code}&subcategory=${property.subcategory.code}`);
};
</script>

<template>
    <div v-if="products?.length" class="card">
        <div class="font-semibold text-xl mb-4">Останні на продаж</div>
        <DataTable :value="products" :rows="5" :paginator="true" responsiveLayout="scroll">
            <Column style="width: 15%" header="Фото">
                <template #body="slotProps">
                    <img :src="`${slotProps.data.images[0]}`" alt="image" width="50" class="shadow" />
                </template>
            </Column>
            <Column field="title" header="Назва" :sortable="true" style="width: 45%"></Column>
            <Column field="priceUSD" header="Price($)" :sortable="true" style="width: 20%"></Column>
            <Column style="width: 10%" header="Деталі">
                <template #body="slotProps">
                    <Button
                        icon="pi pi-search" type="button" class="p-button-text"
                        @click="showProperty(slotProps.data)"
                    ></Button>
                </template>
            </Column>
        </DataTable>
    </div>
</template>
