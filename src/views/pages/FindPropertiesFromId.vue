<template>
    <div>
        <div v-if="loading">
            <div>
                <h1>Пошук об'єкта...</h1>
            </div>
            <div class="card flex justify-center">
                <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" fill="transparent"
                                 animationDuration=".5s" aria-label="Custom ProgressSpinner" />
            </div>
        </div>
        <div v-if="error">{{ error }}</div>
    </div>
</template>

<script>
import { usePropertiesStore } from '@/store/propertiesCategories';
import { useRoute, useRouter } from 'vue-router'; // Используем useRoute для доступа к query параметрам
import { ref, onMounted } from 'vue';

export default {
    setup() {
        const router = useRouter(); // Используем useRouter для доступа к методам роутера
        const route = useRoute(); // Используем useRoute для доступа к query параметрам
        const id = route.params.id; // Получаем ID из query параметров URL
        const category = route.params.category; // Получаем ID из query параметров URL
        const subcategory = route.params.subcategory; // Получаем ID из query параметров URL

        const propertiesStore = usePropertiesStore();
        const loading = ref(false); // Локальное состояние загрузки
        const error = ref(null); // Локальное состояние ошибки
        const product = ref(null); // Локальное состояние продукта

        // Функция для поиска продукта
        const findProduct = async (id) => {
            if (!id) {
                console.warn('❗ ID продукта не указан.');
                return;
            }

            loading.value = true;
            error.value = null;
            product.value = null;

            try {
                const foundProduct = await propertiesStore.findPropertyById(category, subcategory, id);
                if (foundProduct) {
                    console.log('Продукт найден:', foundProduct);
                    product.value = foundProduct;
                    await router.push({
                        path: `/pages/${foundProduct.category.code}/view/${foundProduct.subcategory.code}/${foundProduct.id}`,
                        query: {
                            category: foundProduct.category.code,
                            subcategory: foundProduct.subcategory.code,
                            id: foundProduct.id,
                        },
                    });
                } else {
                    console.warn('Продукт не найден.');
                }
            } catch (err) {
                console.error('Ошибка при поиске продукта:', err);
                error.value = err.message;
            } finally {
                loading.value = false;
            }
        };

        // Автоматически ищем продукт при загрузке компонента, если ID есть в URL
        onMounted(() => {
            console.log('ID продукта:', id, category, subcategory);
            if (id) {
                findProduct(id);
            }
        });

        return {
            id,
            findProduct,
            loading,
            error,
            product,
        };
    },
};
</script>
