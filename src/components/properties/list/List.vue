<script setup>
import { onMounted, ref, watch, computed } from 'vue';
import { usePropertiesStore } from '@/store/propertiesCategories';
import { useAreasStore } from '@/store/areasStore';
import { useUserStore } from '@/store/userStore';
import { useRoute } from 'vue-router';
import PropertyListHeader from './PropertyListHeader.vue';
import PropertyListView from './PropertyListView.vue';
import PropertyGridView from './PropertyGridView.vue';
import PropertyMapView from './PropertyMapView.vue';
import ConfirmationModal from './ConfirmationModal.vue';
import LoadingSkeleton from './LoadingSkeleton.vue';

const props = defineProps({
    category: String,
    type: String,
});

const userStore = useUserStore();

const route = useRoute();
const store = usePropertiesStore();
const storeAreas = useAreasStore();
const currentPage = ref(1);
const pageSize = 1;

const categoryName = computed(() =>
    storeAreas.realEstateItems.find(item => item.key === props.category)?.title
);

const subcategoryName = computed(() =>
    storeAreas.realEstateItems.find(item => item.key === props.category)?.actions
        .find(subcategory => subcategory.type === props.type)?.label
);

const filters = ref({
    category: props.category,
    subcategory: props.type,
});

const paginatedProducts = computed(() => {
    if (currentComponent.value === PropertyMapView) {
        return store.getFilteredProperties; // Все объявления
    }
    const start = (currentPage.value - 1) * pageSize;
    return store.getFilteredProperties.slice(start, start + pageSize); // Пагинация
});
const showPaginator = computed(() => currentComponent.value !== PropertyMapView);


const totalPages = computed(() => {
    return Math.ceil(store.getFilteredProperties.length / pageSize);
});

const loadPage = async () => {
    try {
        await Promise.all([
            store.getProperties(filters.value),
            userStore.fetchUser()
        ]);
    } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
    }
};

const layout = ref('list'); // Начальный layout по умолчанию

const changeLayout = (newLayout) => {
    layout.value = newLayout;
};


const onPageChange = (page) => {
    currentPage.value = page;
};

const first = computed(() => Math.min((currentPage.value - 1) * pageSize, store.getFilteredProperties.length));

watch(filters, loadPage, { deep: true });

watch(totalPages, () => {
    if (currentPage.value > totalPages.value) {
        currentPage.value = totalPages.value || 1;
    }
});


const currentComponent = computed(() => {
    switch (layout.value) {
        case 'list':
            return PropertyListView;
        case 'grid':
            return PropertyGridView;
        case 'map':
            return PropertyMapView;
        default:
            return PropertyListView;
    }
});

onMounted(() => {
    if (!route.query.listId) {
        loadPage();
    }
});

watch(() => store.properties.length, () => {
    currentPage.value = 1;
});

</script>

<template>
    <div class="flex flex-col">
        <ConfirmationModal />
        <div class="card">
            <div class="font-semibold text-xl">{{categoryName}} / {{subcategoryName}}</div>
            <LoadingSkeleton v-if="store.loading" />
            <template v-else>
                <PropertyListHeader
                    class="m-1"
                    v-model:layout="layout"
                />
                <component :is="currentComponent" :items="paginatedProducts" />

                <Paginator
                    v-if="showPaginator && store.getFilteredProperties.length"
                    :rows="pageSize"
                    :first="first"
                    :current-page="currentPage"
                    :total-pages="totalPages"
                    :totalRecords="100"
                    @update:currentPage="onPageChange"
                    @prev-page="currentPage--"
                    @next-page="currentPage++"
                />
                <Message
                    v-else
                    severity="info"
                    icon="pi pi-send"
                    class="m-7"
                >
                    <template #default>
                        <span>Немає оголошень</span>
                    </template>
                </Message>
            </template>
        </div>
    </div>
</template>
