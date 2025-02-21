<script setup>
import { defineAsyncComponent, watch, onMounted, shallowRef } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// Создаем реактивную переменную для хранения текущего компонента
const CurrentComponent = shallowRef(null)

// Функция для загрузки нужного компонента
const loadComponent = (category) => {
    return defineAsyncComponent(() =>
        import(`@/views/pages/${category}/Add.vue`)
            .catch(() => import('@/views/pages/NotFound.vue'))
    )
}

// Инициализация компонента
CurrentComponent.value = loadComponent(route.params.category)

// Следим за изменением маршрута
watch(() => route.params.category, (newCategory) => {
    if (newCategory) {
        CurrentComponent.value = loadComponent(newCategory)
    }
}, {immediate: true})
</script>

<template>
    <div class="category-container">
        <component
            v-if="route.params.category"
            :is="CurrentComponent"
            :category="route.params.category"
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
