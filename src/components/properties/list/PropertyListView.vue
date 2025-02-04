<script setup>
import PropertyActions from './PropertyActions.vue';
import PropertyUserInfo from './PropertyUserInfo.vue';
import { formatFirebaseTimestampToTime } from '@/utils/dateUtils';

defineProps({
    items: Array
});
</script>

<template>
    <div class="flex flex-col">
        <div v-for="(item, index) in items" :key="index">
            <div class="flex flex-col sm:flex-row sm:items-center p-6 gap-4"
                 :class="{ 'border-t border-surface': index !== 0 }">
                <div class="md:w-40 relative">
                    <img class="block xl:block mx-auto rounded w-full"
                         :src="item.images[0]"
                         :alt="item.title" />
                </div>
                <div class="flex flex-col md:flex-row justify-between md:items-center flex-1 gap-6">
                    <div class="flex flex-col">
                        <div class="text-lg font-medium mb-4">{{ item.title }}</div>
                        <div class="text-sm text-surface-500">
                            <div>{{ item.apartmentArea.totalArea }} m2</div>
                            <div>{{ item.address.city.name }} / {{ item.address.area.name }}</div>
                            <div>{{ formatFirebaseTimestampToTime(item.createdAt) }}</div>
                            <div>id: {{ item.idProperty }}</div>
                        </div>
                    </div>
                    <div class="flex flex-col md:items-end gap-8">
                        <span class="text-xl font-semibold">${{ item.priceUSD }}</span>
                        <PropertyActions :item="item" />
                        <PropertyUserInfo :creator="item.creator" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
