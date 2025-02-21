<script setup>
import { ref, defineAsyncComponent, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PropertyDetails from "@/components/properties/view/PropertyDetails.vue";
import { usePropertiesStore } from '@/store/propertiesCategories'

const useProperties = usePropertiesStore()

const route = useRoute()
const router = useRouter()

// Получаем параметры из маршрута
const { category, subcategory, id } = route.params
const queryParams = route.query

// Структура категорий и подкатегорий
const categoryStructure = ref(useProperties.categoryStructure)

// Активные значения
const activeCategory = ref(category || 'apartments')
const activeSubcategory = ref(subcategory || getFirstSubcategory(activeCategory.value))

// Получаем первую подкатегорию для категории
function getFirstSubcategory(categoryCode) {
    const category = categoryStructure.value[categoryCode]
    if (category && category.subcategories) {
        return Object.keys(category.subcategories)[0]
    }
    return null
}

// Динамическая загрузка компонентов
const getComponentPath = (category, subcategory) => {
    console.log(category, subcategory)
    return defineAsyncComponent(() =>
        // import(`@/views/pages/${category}/view/${subcategory}.vue`)
        import(`@/views/pages/${category}/view/index.vue`)
            .catch(() => import('@/views/pages/NotFound.vue'))
    )
}

// Наблюдаем за изменением маршрута
watch(() => route.params, (newParams) => {
    if (newParams.category && categoryStructure.value[newParams.category]) {
        activeCategory.value = newParams.category
    }

    if (newParams.subcategory &&
        categoryStructure.value[activeCategory.value]?.subcategories[newParams.subcategory]) {
        activeSubcategory.value = newParams.subcategory
    }
}, { immediate: true })
</script>

<template>
    <PropertyDetails/>
<!--    <component-->
<!--        :is="CurrentComponent"-->
<!--        :id="id"-->
<!--        :category="activeCategory"-->
<!--        :subcategory="activeSubcategory"-->
<!--        :query-params="queryParams"-->
<!--    />-->
</template>

<style scoped>
.category-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}
</style>
