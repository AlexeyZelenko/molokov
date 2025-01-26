<template>
    <div id="features" class="features flex flex-nowrap gap-4 justify-center mt-6">
        <Card
            v-for="item in realEstateItems"
            :key="item.id"
            class="real-estate-card"
        >
            <template #header>
                <img :src="item.image" :alt="item.title" class="w-full h-48 object-cover"/>
            </template>
            <template #title>
                <h3 class="text-md font-bold mb-2">{{ item.title }}</h3>
            </template>
            <template #content>
                <div class="flex flex-col">
                    <router-link
                        v-for="subcategory in item.actions"
                        :key="subcategory.type"
                        :to="`/categories/${item.key}/${subcategory.type}`"
                        class="p-1 text-blue-900 no-underline"
                    >
                        <Button
                            :label="subcategory.label"
                            :icon="subcategory.icon"
                            class="p-button-text"
                            @click="handleAction(item.id, subcategory.type)"
                        />
                    </router-link>
                </div>
            </template>
        </Card>
    </div>
</template>

<script setup>
import {computed} from 'vue';
import  { useAreasStore } from '@/store/areasStore';

const store = useAreasStore();

const realEstateItems = computed(() => store.realEstateItems);

const handleAction = (itemId, actionType) => {
    console.log(`Action ${actionType} for item ${itemId}`);
};
</script>

<style scoped lang="scss">
@import 'animate.css';

.features {
    max-width: 1100px;
    margin: 30px auto;
    display: flex;
    flex-wrap: nowrap;
    gap: 16px;
    justify-content: center;
}

.real-estate-card {
    flex: 0 1 300px;
    margin-bottom: 1rem;
    transition: transform 0.3s ease;

    &:hover {
        transform: scale(1.05);
    }

    // Анимация при загрузке
    .p-card-header img {
        border-radius: 6px 6px 0 0;
    }

    .p-button {
        width: 100%;
        justify-content: flex-start;
    }

    .p-button .p-button-icon {
        margin-right: 0.5rem;
    }
}

// Адаптивные стили
@media screen and (max-width: 768px) {
    .real-estate-card {
        flex: 0 1 100%;
    }

    .features {
        max-width: 100%;
        margin: 10px 20px;
        flex-wrap: wrap;
    }
}

@media screen and (min-width: 769px) and (max-width: 1024px) {
    .real-estate-card {
        flex: 0 1 calc(50% - 1rem);
    }
}

@media screen and (min-width: 1025px) {
    .real-estate-card {
        flex: 0 1 calc(33% - 1rem);
    }
}
</style>
