<script setup>
import { ref, computed, defineAsyncComponent, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePropertiesStore } from '@/store/propertiesCategories'

const useProperties = usePropertiesStore()

const route = useRoute()
const router = useRouter()

const { category, subcategory, id } = route.params
const queryParams = route.query

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
        import(`@/views/pages/${category}/edit/${subcategory}.vue`)
            .catch(() => import('@/views/pages/NotFound.vue'))
    )
}

// Получаем текущий компонент
const CurrentComponent = computed(() => {
    return getComponentPath(activeCategory.value, activeSubcategory.value)
})

const navigateToCategory = (category, subcategory, itemId = null) => {
    const path = itemId
        ? `/pages/${category}/${subcategory}/${itemId}`
        : `/pages/${category}/${subcategory}`

    router.push({
        path,
        query: {
            category,
            subcategory
        }
    })
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
    <div class="category-container">
        <component
            :is="CurrentComponent"
        />
    </div>
</template>

<style scoped>
.category-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}
</style>
