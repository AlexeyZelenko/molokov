<template>
    <div>
        <button @click="findProduct('someProductId')">Найти продукт</button>
        <div v-if="loading">Загрузка...</div>
        <div v-if="error">{{ error }}</div>
        <div v-if="product">
            <h2>Найден продукт:</h2>
            <pre>{{ product }}</pre>
        </div>
    </div>
</template>

<script>
import { usePropertiesStore } from '@/store/propertiesCategories';
import ( useRouter } from 'vue-router';

export default {
    setup() {
        const route = useRouter();
        const id = route.query.id;

        const propertiesStore = usePropertiesStore();

        const findProduct = async (id) => {
            const product = await propertiesStore.findPropertyById(id);
            if (product) {
                console.log('Продукт найден:', product);
            } else {
                console.warn('Продукт не найден.');
            }
        };

        return {
            findProduct(id),
            loading: propertiesStore.loading,
            error: propertiesStore.error,
            product: propertiesStore.properties[0],
        };
    },
};
</script>
