<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAreasStore } from '@/store/areasStore';
import { useRouter } from 'vue-router';

const store = useAreasStore();
const router = useRouter();
const realEstateCategories = computed(() => store.realEstateItems);
const selectedCategory = ref(null);

const selectCategory = (category) => {
    selectedCategory.value = category;
};

const navigateToAddForm = () => {
    if (selectedCategory.value) {
        router.push(`/pages/${selectedCategory.value.key}/add`);
    }
};

onMounted(() => {
    // Загрузка категорий, если нужно
    if (!realEstateCategories.value || realEstateCategories.value.length === 0) {
        // Вызов действия для загрузки категорий, если они не загружены
        // store.loadCategories();
    }
});
</script>

<template>
    <div class="add-property-page">
        <h1 class="page-title">Додати об'єкт</h1>

        <div class="category-container">
            <h2 class="category-title">Виберіть категорію нерухомості</h2>

            <div class="form-actions my-4" v-if="selectedCategory">
                <h3 class="selected-category-info">
                    Вибрано: <span>{{ selectedCategory.title }}</span>
                </h3>

                <Button label="Створити оголошення" icon="pi pi-plus" class="continue-button" @click="navigateToAddForm" />
            </div>

            <div class="categories-grid">
                <div v-for="category in realEstateCategories" :key="category.id" class="category-card" @click="selectCategory(category)" :class="{ selected: selectedCategory && selectedCategory.id === category.id }">
                    <div class="category-image">
                        <img :src="category.image" :alt="category.title" />
                    </div>
                    <h3 class="category-name">{{ category.title }}</h3>
                </div>
            </div>
        </div>

        <div class="form-actions" v-if="selectedCategory">
            <h3 class="selected-category-info">
                Вибрано: <span>{{ selectedCategory.title }}</span>
            </h3>

            <Button label="Створити оголошення" icon="pi pi-plus" class="continue-button" @click="navigateToAddForm" />
        </div>
    </div>
</template>

<style scoped lang="scss">
.add-property-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;

    .page-title {
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: 2rem;
        text-align: center;
        color: #333;
    }

    .category-container {
        margin-bottom: 3rem;

        .category-title {
            font-size: 1.5rem;
            font-weight: 500;
            margin-bottom: 1.5rem;
            color: #555;
        }

        .categories-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 1.5rem;

            .category-card {
                border-radius: 12px;
                background-color: white;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
                overflow: hidden;
                cursor: pointer;
                transition: all 0.3s ease;
                padding-bottom: 1rem;

                &:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
                }

                &.selected {
                    border: 3px solid #4caf50;
                    box-shadow: 0 0 15px rgba(76, 175, 80, 0.5);
                }

                .category-image {
                    height: 180px;
                    overflow: hidden;

                    img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                        transition: transform 0.5s ease;
                    }
                }

                &:hover .category-image img {
                    transform: scale(1.05);
                }

                .category-name {
                    font-size: 1.2rem;
                    font-weight: 500;
                    text-align: center;
                    padding: 1rem 0.5rem 0.5rem;
                    color: #333;
                }
            }
        }
    }

    .form-actions {
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: #f9f9f9;
        padding: 1.5rem;
        border-radius: 10px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

        .selected-category-info {
            font-size: 1.2rem;
            margin-bottom: 1.5rem;
            color: #333;

            span {
                font-weight: 600;
                color: #4caf50;
            }
        }

        .continue-button {
            background-color: #4caf50;
            border: none;
            color: white;
            padding: 0.8rem 1.5rem;
            font-size: 1rem;
            border-radius: 8px;
            cursor: pointer;
            transition: background-color 0.3s ease;

            &:hover {
                background-color: #45a049;
            }
        }
    }
}

// Адаптивность для мобильных устройств
@media (max-width: 768px) {
    .add-property-page {
        padding: 1.5rem 1rem;

        .page-title {
            font-size: 1.8rem;
        }

        .category-container {
            .category-title {
                font-size: 1.3rem;
            }

            .categories-grid {
                grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                gap: 1rem;

                .category-card {
                    .category-image {
                        height: 140px;
                    }

                    .category-name {
                        font-size: 1rem;
                    }
                }
            }
        }
    }
}
</style>
