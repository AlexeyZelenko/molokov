<script setup>
import { defineProps, onMounted } from 'vue'; // Додано computed
import PropertyActions from './PropertyActions.vue';
import PropertyUserInfo from './PropertyUserInfo.vue';
import { formatFirebaseTimestampToTime } from '@/utils/dateUtils';
import PropertyPrice from '@/components/price/PriceConverter.vue';
import { useUserStore } from '@/store/userStore';
import { useRoute } from 'vue-router';
import PropertyImage from './PropertyImage.vue'; // <--- 1. Імпортуємо новий компонент

const props = defineProps({
    // Перейменовано props на propsList або залиште items
    items: Array
});

const route = useRoute();
const userStore = useUserStore();
const user = userStore.user;

// 2. Видалено getSeverity (перенесено в PropertyImage)
// const getSeverity = (status) => { ... };

// 3. Логіка визначення, чи показувати тег, залишається тут (використовує user і route)
//    Можна зробити функцією або computed property, якщо items - це ref/reactive
const shouldShowStatusTag = (item) => {
    // Перевіряємо, чи user існує перед доступом до id
    return user?.id && item?.creator?.id && route?.query?.user && user.id === item.creator.id && route.query.user === user.id.toString();
    // Додано .toString() для порівняння, якщо route.query.user - рядок
};

onMounted(() => {
    // Оптимізація: Завантажуємо користувача, тільки якщо він ще не завантажений
    // і якщо він потрібен для shouldShowStatusTag або інших компонентів
    if (!user && props.items.some((item) => item?.creator?.id)) {
        userStore.fetchUser();
    }
    // Або якщо user завжди потрібен, просто: userStore.fetchUser();
});
</script>

<template>
    <div v-if="items.length > 0" class="flex flex-col">
        <div v-for="(item, index) in items" :key="index">
            <div class="property-card flex flex-col sm:flex-row sm:items-center mt-4 p-4 gap-6 shadow-md">
                <PropertyImage :images="item.images" :alt-text="item.title" :is-public="item.isPublic" :show-status-tag="shouldShowStatusTag(item)" />
                <div class="flex flex-col md:flex-row justify-between md:items-center flex-1 gap-6">
                    <div class="flex flex-col">
                        <div class="text-lg font-medium mb-4">{{ item.title }}</div>
                        <div class="flex flex-col text-sm text-surface-500 gap-1">
                            <div class="flex items-center">
                                <i class="pi pi-table mr-2"></i>
                                {{ item.apartmentArea.totalArea }} m2
                            </div>
                            <div class="flex items-center" v-if="item.address?.city?.AreaDescription || item.address?.city?.RegionsDescription">
                                <i class="pi pi-map-marker mr-2"></i>
                                <span v-if="item.address?.city?.AreaDescription">{{ item.address.city.AreaDescription }} обл.</span>
                                <span v-if="item.address?.city?.RegionsDescription">/{{ item.address.city.RegionsDescription }} р-н</span>
                            </div>
                            <div class="flex items-center">
                                <i class="pi pi-map-marker mr-2"></i>
                                <span> {{ item.address.city.name }} </span>
                                <span v-if="item.address?.area?.name">/{{ item.address.area.name }}</span>
                            </div>
                            <div v-if="item.createdAt" class="flex items-center">
                                <i class="pi pi-calendar mr-2"></i>
                                <div>{{ formatFirebaseTimestampToTime(item.createdAt) }}</div>
                            </div>
                            <div class="flex items-center">
                                <i class="pi pi-verified mr-2"></i>
                                <div>id: {{ item.idProperty }}</div>
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-col md:items-end gap-8">
                        <div class="font-bold">
                            <PropertyPrice style="color: #2196f3; font-size: 18px; font-weight: 600" :price="item.price" :isDisplayUAH="true" />
                        </div>
                        <PropertyActions :item="item" />
                        <PropertyUserInfo :creator="item.creator" />
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div v-else class="flex justify-center items-center h-full">
        <p class="text-lg text-surface-500">Немає жодної пропозиції</p>
    </div>
</template>

<style scoped>
.property-card {
    transition:
        transform 0.2s,
        box-shadow 0.2s;
}

.property-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}
</style>
