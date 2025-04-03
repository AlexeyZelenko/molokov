<script setup>
import { computed, ref, onMounted } from 'vue';
import { useAreasStore } from '@/store/areasStore';

const store = useAreasStore();
const realEstateItems = computed(() => store.realEstateItems);

const activeMenuId = ref(null); // ID открытого списка
const isDesktop = ref(window.innerWidth >= 768);

// Функция переключения меню
const toggleMenu = (id) => {
    if (isDesktop.value) return; // На десктопе меню всегда открыто

    activeMenuId.value = activeMenuId.value === id ? null : id; // Закрываем или переключаем
};

// Закрытие на мобильных после клика
const closeOnMobile = () => {
    if (!isDesktop.value) activeMenuId.value = null;
};

// Обновление состояния экрана
const updateScreenSize = () => {
    isDesktop.value = window.innerWidth >= 768;
    if (isDesktop.value) activeMenuId.value = null; // На десктопе всё всегда открыто
};

onMounted(() => {
    window.addEventListener('resize', updateScreenSize);
    updateScreenSize();
});
</script>

<template>
    <div id="features" class="features grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 mt-150">
        <Card v-for="item in realEstateItems" :key="item.id" class="real-estate-card pt-50" @click="toggleMenu(item.id)">
            <template #header>
                <img :src="item.image" :alt="item.title" class="w-full h-52 object-cover rounded-t-lg" />
            </template>

            <template #title>
                <h3 class="text-lg font-semibold text-center">{{ item.title }}</h3>
            </template>

            <template #content>
                <div class="flex flex-col gap-2 mt-2">
                    <div v-show="activeMenuId === item.id || isDesktop" class="transition-all duration-300 ease-in-out">
                        <router-link v-for="subcategory in item.actions" :key="subcategory.type" :to="`/categories/${item.key}/${subcategory.type}`" class="w-full">
                            <Button :label="subcategory.label" :icon="subcategory.icon" class="p-button-outlined w-full text-gray-700 border-gray-500 hover:bg-gray-700 hover:text-white my-1" @click="closeOnMobile()" />
                        </router-link>
                    </div>
                </div>
            </template>
        </Card>
    </div>
</template>

<style scoped lang="scss">
.features {
    max-width: 1200px;
    margin: 50px auto 0;
}

.real-estate-card {
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition:
        transform 0.3s ease,
        box-shadow 0.3s ease;
    overflow: hidden;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    }
}

.p-button {
    transition: all 0.3s ease;
    border-radius: 6px;
}
</style>
