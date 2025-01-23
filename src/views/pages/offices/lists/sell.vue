<script setup>
import { onMounted, ref, watch, computed, onBeforeMount } from 'vue';
import { usePropertiesStore } from '@/store/propertiesCategories';
import  { useAreasStore } from '@/store/areasStore';
import { useRoute, useRouter } from 'vue-router';
import Button from "primevue/button";

const route = useRoute();
const router = useRouter();
const products = ref([]);
const options = ref(['list', 'grid']);
const layout = ref('list');
const store = usePropertiesStore();

const storeAreas = useAreasStore();
const categoryName = computed(() => storeAreas.realEstateItems.find(item => item.key === 'offices')?.title);
const subcategoryName = computed(() => storeAreas.realEstateItems.find(item => item.key === 'offices')?.actions.find(subcategory => subcategory.type === 'sell')?.label);

const category = computed(() => route.query.category || 'offices');
const subcategory = computed(() => route.query.subcategory || 'sell');
// Пагинация
const currentPage = ref(1);
const pageSize = 2;

const showProperty = (property) => {
    router.push(`/pages/apartments/view/${property.id}`);
};

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

const category2 = computed(() => route.params.category);
const subcategory2 = computed(() => route.params.subcategory);
// Загрузка данных при монтировании компонента
onMounted(() => {
    loadPage();
});

onBeforeMount(() => {
    console.log("category2", category2.value);
    console.log("subcategory2", subcategory2.value);
});

watch(() => store.properties, (newProperties) => {
    products.value = newProperties;
});
</script>

<template>
    <div class="flex flex-col">
        <div class="card">
            <div class="font-semibold text-xl">{{categoryName}} / {{subcategoryName}}</div>
            <div v-if="store.loading">
                <div class="card">
                    <div class="rounded border border-surface-200 dark:border-surface-700 p-6 bg-surface-0 dark:bg-surface-900">
                        <div class="flex mb-4">
                            <Skeleton shape="circle" size="4rem" class="mr-2"></Skeleton>
                            <div>
                                <Skeleton width="10rem" class="mb-2"></Skeleton>
                                <Skeleton width="5rem" class="mb-2"></Skeleton>
                                <Skeleton height=".5rem"></Skeleton>
                            </div>
                        </div>
                        <Skeleton width="100%" height="150px"></Skeleton>
                        <div class="flex justify-between mt-4">
                            <Skeleton width="4rem" height="2rem"></Skeleton>
                            <Skeleton width="4rem" height="2rem"></Skeleton>
                        </div>
                    </div>
                </div>
            </div>
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
                                            <span class="font-medium text-surface-500 dark:text-surface-400 text-sm">{{ item.category.name }} / {{ item.subcategory.name }}</span>
                                            <div class="text-lg font-medium mt-2">{{ item.title }}</div>
                                        </div>
                                        <div class="text-lg font-medium mt-2"></div>
                                    </div>
                                    <div class="flex flex-col md:items-end gap-8">
                                        <span class="text-xl font-semibold">${{ item.priceUSD }}</span>
                                        <div class="flex flex-row-reverse md:flex-row gap-2">
                                            <Button label="Детальніше" raised @click="showProperty(item)"/>
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
                                            <Button label="Детальніше" raised @click="showProperty(item)"/>
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
