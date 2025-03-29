import { computed } from 'vue';

export function usePropertyMeta(route, dropdowns, property) {
    const isEditMode = computed(() => !!route.params.id);

    const category = computed(() => ({
        code: route.query?.category || route.params?.category || 'apartments'
    }));

    const subcategory = computed(() => ({
        code: route.query?.subcategory || 'sell'
    }));

    const pageTitle = computed(() =>
        isEditMode.value ? "Редагувати об'єкт" : "Додати об'єкт"
    );

    const selectedCategoryName = computed(() => {
        if (!dropdowns.value?.category) return 'Категорія не знайдена';
        const found = dropdowns.value.category.find(
            item => item.code === (route.params.category || property.value.category.code)
        );
        return found ? found.name : 'Категорія не знайдена';
    });

    const showRentSection = computed(() =>
        property.value?.subcategory?.code !== 'sell' &&
        property.value?.subcategory?.code !== 'exchange'
    );

    const id = computed(() => {
        return route.params.id;
    });

    return {
        isEditMode,
        category,
        subcategory,
        pageTitle,
        selectedCategoryName,
        showRentSection,
        id,
    };
}
