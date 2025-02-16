<script setup>
import { onMounted, ref, watch, computed } from 'vue';
import { usePropertiesStore } from '@/store/propertiesCategories';
import { useAreasStore } from '@/store/areasStore';
import { useUserStore } from '@/store/userStore';
import { useRoute, useRouter } from 'vue-router';
import PropertyListHeader from './PropertyListHeader.vue';
import PropertyListView from './PropertyListView.vue';
import PropertyGridView from './PropertyGridView.vue';
import PropertyMapView from './PropertyMapView.vue';
import PropertyPagination from './PropertyPagination.vue';
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
const pageSize = 3;

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
    const start = (currentPage.value - 1) * pageSize;
    return store.getFilteredProperties.slice(start, start + pageSize);
});

const totalPages = computed(() => {
    return Math.ceil(store.properties.length / pageSize);
});

const loadPage = async () => {
    try {
        await store.getProperties(filters.value);
        await userStore.fetchUser();
    } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
    }
};

const layout = ref('list'); // Начальный layout по умолчанию

const changeLayout = (layout) => {
    layout.value = layout;
};

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

watch(() => store.properties, () => {
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
                <PropertyListHeader v-model:layout="layout" />
                <component :is="currentComponent" :items="paginatedProducts" />
                <PropertyPagination
                    v-if="currentComponent !== PropertyMapView"
                    :current-page="currentPage"
                    :total-pages="totalPages"
                    @prev-page="currentPage--"
                    @next-page="currentPage++"
                />
            </template>
        </div>
    </div>
</template>
