<script setup>
import { onMounted, ref, watch, computed } from 'vue';
import { usePropertiesStore } from '@/store/propertiesCategories';
import  { useAreasStore } from '@/store/areasStore';
import { useRoute } from 'vue-router';

const route = useRoute();
const products = ref([]);
const options = ref(['list', 'grid']);
const layout = ref('list');
const store = usePropertiesStore();

const storeAreas = useAreasStore();
const realEstateItems = computed(() => storeAreas.realEstateItems);
const categoryName = computed(() => storeAreas.realEstateItems.find(item => item.key === route.query.category)?.title);
const subcategoryName = computed(() => storeAreas.realEstateItems.find(item => item.key === route.query.category)?.actions.find(subcategory => subcategory.type === route.query.subcategory)?.label);

const category = route.query.category;
const subcategory = route.query.subcategory;
// Пагинация
const currentPage = ref(1);
const pageSize = 2;

const filters = ref({
    category: category,
    subcategory: subcategory,
});

const loadPage = async () => {
    try {
        await store.getProperties(filters.value);
    } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
    }
};

const paginatedProducts = computed(() => {
    const start = (currentPage.value - 1) * pageSize;
    const filteredProducts = store.getFilteredProperties; // Получаем отфильтрованные данные из геттера
    return filteredProducts.slice(start, start + pageSize); // Пагинируем данные
});

const totalPages = computed(() => {
    return Math.ceil(store.properties.length / pageSize);
});

// Страница товара (нумерация и навигация)
const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++;
    }
};

const prevPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--;
    }
};


// Загрузка данных при монтировании компонента
onMounted(() => {
    loadPage();
});

watch(() => store.properties, (newProperties) => {
    console.log('newProperties', newProperties);
    products.value = newProperties;
});
</script>

<template>
    <div class="flex flex-col">
        <div class="card">
            <div class="font-semibold text-xl">{{categoryName}} / {{subcategoryName}}</div>
            <div v-if="store.loading">Завантаження...</div>
            <DataView v-else :value="paginatedProducts" :layout="layout">
                <template #header>
                    <div class="flex justify-end">
                        <SelectButton v-model="layout" :options="options" :allowEmpty="false">
                            <template #option="{ option }">
                                <i :class="[option === 'list' ? 'pi pi-bars' : 'pi pi-table']" />
                            </template>
                        </SelectButton>
                    </div>
                </template>

                <template #list="slotProps">
                    <div class="flex flex-col">
                        <div v-for="(item, index) in slotProps.items" :key="index">
                            <div class="flex flex-col sm:flex-row sm:items-center p-6 gap-4" :class="{ 'border-t border-surface': index !== 0 }">
                                <div class="md:w-40 relative">
                                    <img class="block xl:block mx-auto rounded w-full" :src="item.images[0]" :alt="item.title" />
                                </div>
                                <div class="flex flex-col md:flex-row justify-between md:items-center flex-1 gap-6">
                                    <div class="flex flex-row md:flex-col justify-between items-start gap-2">
                                        <div>
                                            <span class="font-medium text-surface-500 dark:text-surface-400 text-sm">{{ item.category.name }}</span>
                                            <div class="text-lg font-medium mt-2">{{ item.title }}</div>
                                        </div>
                                        <div class="text-lg font-medium mt-2">{{ item.subcategory.name }}</div>
                                    </div>
                                    <div class="flex flex-col md:items-end gap-8">
                                        <span class="text-xl font-semibold">${{ item.priceUSD }}</span>
                                        <div class="flex flex-row-reverse md:flex-row gap-2">
                                            <Button icon="pi pi-heart" outlined></Button>
                                            <Button icon="pi pi-shopping-cart" label="Buy Now" :disabled="item.inventoryStatus === 'OUTOFSTOCK'" class="flex-auto md:flex-initial whitespace-nowrap"></Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>

                <template #grid="slotProps">
                    <div class="grid grid-cols-12 gap-4">
                        <div v-for="(item, index) in slotProps.items" :key="index" class="col-span-12 sm:col-span-6 lg:col-span-4 p-2">
                            <div class="p-6 border border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 rounded flex flex-col">
                                <div class="bg-surface-50 flex justify-center rounded p-4">
                                    <div class="relative mx-auto">
                                        <img class="rounded w-full" :src="item.images[0]" :alt="item.name" style="max-width: 300px" />
                                    </div>
                                </div>
                                <div class="pt-6">
                                    <div class="flex flex-row justify-between items-start gap-2">
                                        <div>
                                            <span class="font-medium text-surface-500 dark:text-surface-400 text-sm">{{ item.category.name }}</span>
                                            <div class="text-lg font-medium mt-1">{{ item.title }}</div>
                                            <span class="font-medium text-surface-500 dark:text-surface-400 text-sm">{{ item.subcategory.name }}</span>
                                        </div>
                                    </div>
                                    <div class="flex flex-col gap-6 mt-6">
                                        <span class="text-2xl font-semibold">${{ item.priceUSD }}</span>
                                        <div class="flex gap-2">
                                            <Button icon="pi pi-shopping-cart" label="Buy Now" :disabled="item.inventoryStatus === 'OUTOFSTOCK'" class="flex-auto whitespace-nowrap"></Button>
                                            <Button icon="pi pi-heart" outlined></Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </DataView>
        </div>

        <!-- Пагинация -->
        <div class="pagination flex justify-center align-center gap-2">
            <Button
                label="Попередня"
                icon="pi pi-chevron-left"
                @click="prevPage"
                :disabled="currentPage === 1"
                class="pagination--btn"
            />
            <div class="pagination--text">Сторінка {{ currentPage }}</div>
            <Button
                label="Наступна"
                icon="pi pi-chevron-right"
                @click="nextPage"
                :disabled="!store.hasMore"
                class="pagination--btn"
            />
        </div>
    </div>
</template>

<style scoped lang="scss">
.pagination {
    margin-top: 1rem;
    &--btn {
        min-width: 100px;
    }
    &--text {
        display: flex;
        align-items: center;
    }
}
</style>
