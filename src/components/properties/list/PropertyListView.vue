<script setup>
import { defineProps, onMounted } from 'vue';
import PropertyActions from './PropertyActions.vue';
import PropertyUserInfo from './PropertyUserInfo.vue';
import { formatFirebaseTimestampToTime } from '@/utils/dateUtils';
import PropertyPrice from '@/components/price/PriceConverter.vue';
import { useUserStore } from '@/store/userStore';
import { useRoute } from 'vue-router';

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
    <div class="flex flex-col">
        <div v-for="(item, index) in items" :key="index">
            <div class="property-card flex flex-col sm:flex-row sm:items-center mt-4 p-4 gap-6 shadow-md">
                <div class="md:w-40 relative h-40">
                    <img v-if="item.images?.length" class="block mx-auto rounded w-full h-full object-cover" :src="item.images[0]" :alt="item.title" />
                    <img v-else class="block mx-auto rounded w-full h-full object-cover" src="/images/placeholder-image.webp" alt="Placeholder" />
                    <Tag v-if="user?.id === item?.creator?.id && route?.query?.user === user?.id" :value="item?.isPublic ? 'Опубліковано' : 'Не опубліковано'" :severity="getSeverity(item.isPublic)" class="absolute" style="left: 5px; top: 5px" />
                </div>
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
