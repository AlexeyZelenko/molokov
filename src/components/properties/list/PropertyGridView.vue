<script setup>
import PropertyActions from './PropertyActions.vue';
import PropertyUserInfo from './PropertyUserInfo.vue';
import { formatFirebaseTimestampToTime } from '@/utils/dateUtils';
import PropertyPrice from '@/components/price/PriceConverter.vue';
import { useUserStore } from '@/store/userStore';
import { useRoute } from 'vue-router';
import { onMounted } from 'vue';

const route = useRoute();

const userStore = useUserStore();
const user = userStore.user;
const getSeverity = (status) => {
    switch (status) {
        case true:
            return 'success';

        case false:
            return 'warn';

        case 'OUTOFSTOCK':
            return 'danger';

        default:
            return null;
    }
};

defineProps({
    items: Array
});

onMounted(() => {
    userStore.fetchUser();
});
</script>

<template>
    <div v-if="items.length > 0" class="grid grid-cols-12 gap-4">
        <div v-for="(item, index) in items" :key="index" class="col-span-12 sm:col-span-6 lg:col-span-4">
            <div class="p-6 border border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 rounded flex flex-col h-full">
                <div class="flex justify-center rounded">
                    <div class="relative w-full max-w-[300px] h-[150px]">
                        <img
                            class="rounded w-full h-full object-cover"
                            :src="item.images[0].url || item.images[0]" :alt="item.title"
                        />
                        <Tag v-if="user?.id === item?.creator?.id && route?.query?.user === user?.id" :value="item.isPublic ? 'Опубліковано' : 'Не опубліковано'" :severity="getSeverity(item.isPublic)" class="absolute" style="left: 5px; top: 5px" />
                    </div>
                </div>
                <div class="h-full flex flex-col justify-between pt-6">
                    <div class="flex flex-col gap-2 min-h-[200px]">
                        <div class="text-sm text-surface-500">{{ item.category.name }} / {{ item.subcategory.name }}</div>
                        <div class="text-lg font-medium">{{ item.title }}</div>
                        <div class="flex items-center" v-if="item.address?.city?.AreaDescription || item.address?.city?.RegionsDescription">
                            <i class="pi pi-map-marker mr-2"></i>
                            <span
                                v-if="item.address?.city?.AreaDescription"
                                class="mr-2"
                            >{{ item.address.city.AreaDescription }} обл. /</span>
                            <span v-if="item.address?.city?.RegionsDescription"> {{ item.address.city.RegionsDescription }} р-н</span>
                        </div>
                        <div class="flex items-center">
                            <i class="pi pi-map-marker mr-2"></i>
                            <span class="mr-2">{{ item.address.city.name }} </span>
                            <span v-if="item.address?.area?.name">/ {{ item.address.area.name }}</span>
                        </div>
                        <div class="flex items-center">
                            <i class="pi pi-table mr-2"></i>
                            {{ item.apartmentArea.totalArea }} m2
                        </div>
                        <div class="flex items-center">
                            <i class="pi pi-calendar mr-2"></i>
                            <div>{{ formatFirebaseTimestampToTime(item.createdAt) }}</div>
                        </div>
                        <div class="text-sm text-surface-500">Номер оголошення: {{ item.idProperty }}</div>
                    </div>
                    <PropertyUserInfo :creator="item.creator" />
                    <div class="flex flex-col gap-6 mt-6">
                        <div class="font-bold">
                            <PropertyPrice :price="item.price" :isDisplayUAH="true" />
                        </div>
                        <PropertyActions :item="item" />
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div v-else class="flex justify-center items-center h-full">
        <p class="text-lg text-surface-500">Немає жодної пропозиції</p>
    </div>
</template>
