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
        <DataTable
            :value="products"
            :rows="5"
            :paginator="true"
            responsiveLayout="scroll"
            class="p-datatable-sm"
            stripedRows
            :rowHover="true"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
        >
            <Column header="Фото" style="width: 15%">
                <template #body="{ data }">
                    <div class="relative w-[50px] h-[50px]">
                        <img
                            :src="data.images[0]"
                            :alt="data.title"
                            class="rounded-md shadow-sm w-full h-full object-cover"
                        />
                    </div>
                </template>
            </Column>

            <Column
                field="title"
                header="Назва"
                :sortable="true"
                style="width: 45%"
            >
                <template #body="{ data }">
                    <div class="font-medium">{{ data.title }}</div>
                </template>
            </Column>

            <Column
                field="price"
                header="Ціна(грн)"
                :sortable="true"
                style="width: 20%"
            >
                <template #body="{ data }">
                    <div class="font-semibold text-primary">
                        {{ data.price.toLocaleString() }} ₴
                    </div>
                </template>
            </Column>

            <Column header="Деталі" style="width: 10%">
                <template #body="{ data }">
                    <Button
                        icon="pi pi-search"
                        type="button"
                        class="p-button-rounded p-button-text"
                        @click="showProperty(data)"
                        tooltip="Переглянути деталі"
                        tooltipPosition="top"
                    />
                </template>
            </Column>
        </DataTable>
    </div>
</template>
