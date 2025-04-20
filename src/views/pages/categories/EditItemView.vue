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
        import(`@/views/pages/${category}/Manager.vue`)
            .catch(() => import('@/views/pages/NotFound.vue'))
    )
}

// Получаем текущий компонент
const CurrentComponent = computed(() => {
    return getComponentPath(activeCategory.value, activeSubcategory.value)
})

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
    <div class="w-full md:w-2/3 lg:w-2/3 xl:w-1/2 flex flex-col mx-auto">
        <component
            :is="CurrentComponent"
        />
    </div>
</template>