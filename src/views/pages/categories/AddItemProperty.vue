<template>
    <div class="category-container">
        <Suspense>
            <template #default>
                <template v-if="currentCategory">
                    <component
                        :is="CurrentComponent"
                        :category="currentCategory"
                        v-bind="componentProps"
                    />
                </template>
            </template>
            <template #fallback>
                <LoadingSpinner message="Loading data..." text-color="#666666" />
            </template>
        </Suspense>
    </div>
</template>

<script setup>
import { defineAsyncComponent, watch, shallowRef, computed, onErrorCaptured } from 'vue';
import { useRoute } from 'vue-router';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import { useErrorHandler } from '@/composables/useErrorHandler';

const route = useRoute();
const { handleError } = useErrorHandler();

const CONFIG = {
    fallbackComponent: defineAsyncComponent(() => import('@/views/pages/NotFound.vue')),
    timeout: 5000,
};

// Мапа компонентов, чтобы избежать динамического импорта
const COMPONENTS = {
    apartments: defineAsyncComponent(() => import('@/views/pages/apartments/Manager.vue')),
    houses: defineAsyncComponent(() => import('@/views/pages/houses/Manager.vue')),
    rooms: defineAsyncComponent(() => import('@/views/pages/rooms/Manager.vue')),
    lands: defineAsyncComponent(() => import('@/views/pages/land/Manager.vue')),
    garages: defineAsyncComponent(() => import('@/views/pages/garages/Manager.vue')),
    commercial: defineAsyncComponent(() => import('@/views/pages/commercial/Manager.vue')),
    other: defineAsyncComponent(() => import('@/views/pages/other/Manager.vue')),
};

// Текущая категория и передаваемые параметры
const currentCategory = computed(() => route.params.category);
const componentProps = computed(() => ({ ...route.params, ...route.query }));

// Ссылка на текущий компонент
const CurrentComponent = shallowRef(CONFIG.fallbackComponent);

// Обработка ошибок
onErrorCaptured((error) => {
    handleError(error);
    return false;
});

// Функция загрузки компонента
const loadComponent = (category) => {
    return COMPONENTS[category] || CONFIG.fallbackComponent;
};

// Следим за изменением категории и загружаем компонент
watch(
    currentCategory,
    (newCategory) => {
        if (newCategory) {
            try {
                CurrentComponent.value = loadComponent(newCategory);
            } catch (error) {
                handleError(error);
                CurrentComponent.value = CONFIG.fallbackComponent;
            }
        }
    },
    { immediate: true }
);
</script>
