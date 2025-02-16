<script setup>
import { defineProps } from 'vue';
import PropertyActions from './PropertyActions.vue';
import PropertyUserInfo from './PropertyUserInfo.vue';
import { formatFirebaseTimestampToTime } from '@/utils/dateUtils';
import PropertyPrice from '@/components/price/PriceConverter.vue';

defineProps({
    items: Array
});
</script>

<template>
    <div class="flex flex-col">
        <div v-for="(item, index) in items" :key="index">
            <div class="property-card flex flex-col sm:flex-row sm:items-center mt-4 p-4 gap-6 shadow-md">
                <div class="md:w-40 relative h-40">
                    <img class="block mx-auto rounded w-full h-full object-cover"
                         :src="item.images[0]"
                         :alt="item.title"
                    />
                </div>
                <div class="flex flex-col md:flex-row justify-between md:items-center flex-1 gap-6">
                    <div class="flex flex-col">
                        <div class="text-lg font-medium mb-4">{{ item.title }}</div>
                        <div class="flex flex-col text-sm text-surface-500 gap-1">
                            <div class="flex items-center">
                                <i class="pi pi-table mr-2"></i>
                                {{ item.apartmentArea.totalArea }} m2
                            </div>
                            <div class="flex items-center">
                                <i class="pi pi-map-marker mr-2"></i>
                                {{ item.address.city.name }} / {{ item.address.area.name }}
                            </div>
                            <div class="flex items-center">
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
                            <PropertyPrice
                                style="color: #2196F3;
                                font-size: 18px;
                                font-weight: 600;"
                                :price="item.price"
                                :isDisplayUAH=true
                            />
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
    transition: transform 0.2s, box-shadow 0.2s;
}

.property-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}
</style>

