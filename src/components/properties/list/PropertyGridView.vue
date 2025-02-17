<script setup>
import PropertyActions from './PropertyActions.vue';
import PropertyUserInfo from './PropertyUserInfo.vue';
import { formatFirebaseTimestampToTime } from '@/utils/dateUtils';
import PropertyPrice from "@/components/price/PriceConverter.vue";

defineProps({
    items: Array
});
</script>

<template>
    <div class="grid grid-cols-12 gap-4">
        <div v-for="(item, index) in items"
             :key="index"
             class="col-span-12 sm:col-span-6 lg:col-span-4">
            <div class="p-6 border border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 rounded flex flex-col h-full">
                <div class="flex justify-center rounded">
                    <div class="relative w-full max-w-[300px] h-[150px]">
                        <img
                            class="rounded w-full h-full object-cover"
                            :src="item.images[0]"
                            :alt="item.title"
                        />
                    </div>
                </div>
                <div class="h-full flex flex-col justify-between pt-6">
                    <div class="flex flex-col gap-2">
                        <span class="text-sm text-surface-500">
                            {{ item.category.name }} / {{ item.subcategory.name }}
                        </span>
                        <div class="text-lg font-medium">{{ item.title }}</div>
                        <div class="flex items-center">
                            <i class="pi pi-map-marker mr-2"></i>
                            {{ item.address.city.name }} / {{ item.address.area.name }}
                        </div>
                        <div class="flex items-center">
                            <i class="pi pi-table mr-2"></i>
                            {{ item.apartmentArea.totalArea }} m2
                        </div>
                        <div class="flex items-center">
                            <i class="pi pi-calendar mr-2"></i>
                            <div>{{ formatFirebaseTimestampToTime(item.createdAt) }}</div>
                        </div>
                        <div class="text-sm text-surface-500">
                            Номер оголошення: {{ item.idProperty }}
                        </div>
                        <PropertyUserInfo :creator="item.creator" />
                    </div>
                    <div class="flex flex-col gap-6 mt-6">
                        <div class="font-bold">
                            <PropertyPrice
                                :price="item.price"
                                :isDisplayUAH=true
                            />
                        </div>
                        <PropertyActions :item="item" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
