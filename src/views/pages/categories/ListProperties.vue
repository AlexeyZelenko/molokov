<script setup>
import { ref, computed, defineAsyncComponent, watch } from 'vue';
import { useRoute } from 'vue-router';
import { usePropertiesStore } from '@/store/propertiesCategories';

const useProperties = usePropertiesStore();
const route = useRoute();

// Use reactive approach for route params
const activeCategory = ref(route.params.category || '');
const activeSubcategory = ref(route.params.subcategory || '');

const categoryStructure = ref(useProperties.categoryStructure);

// Получаем первую подкатегорию для категории
function getFirstSubcategory(categoryCode) {
    const category = categoryStructure.value[categoryCode];
    if (category && category.subcategories) {
        return Object.keys(category.subcategories)[0];
    }
    return null;
}

// Динамическая загрузка компонентов
const getComponentPath = () => {
    return defineAsyncComponent(() => import(`@/components/properties/list/List.vue`).catch(() => import('@/views/pages/NotFound.vue')));
};

// Получаем текущий компонент
const CurrentComponent = computed(() => {
    return getComponentPath(activeCategory.value, activeSubcategory.value);
});

// Comprehensive route params watcher
const updateRouteParams = () => {
    const { category, subcategory } = route.params;

    // Validate category
    if (category && categoryStructure.value[category]) {
        activeCategory.value = category;

        // If no subcategory provided, try to get the first subcategory
        if (!subcategory) {
            const firstSubcategory = getFirstSubcategory(category);
            activeSubcategory.value = firstSubcategory || '';
        } else {
            // Validate subcategory
            if (categoryStructure.value[category]?.subcategories?.[subcategory]) {
                activeSubcategory.value = subcategory;
            } else {
                // Fallback to first subcategory if invalid
                const firstSubcategory = getFirstSubcategory(category);
                activeSubcategory.value = firstSubcategory || '';
            }
        }
    } else {
        // Reset if category is invalid
        activeCategory.value = '';
        activeSubcategory.value = '';
    }
};

// Initial update and watch for route changes
updateRouteParams();
watch(() => route.params, updateRouteParams, { immediate: true });
</script>

<template>
    <div class="category-container">
        <component :is="CurrentComponent" :category="activeCategory" :subcategory="activeSubcategory" :type="activeSubcategory" />
    </div>
</template>

<style scoped>
.category-container {
    max-width: 1200px;
    margin: 0 auto;
}
</style>
