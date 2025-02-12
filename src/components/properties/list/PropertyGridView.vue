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
             class="col-span-12 sm:col-span-6 lg:col-span-4 p-2">
            <div class="p-6 border border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 rounded flex flex-col">
                <div class="bg-surface-50 flex justify-center rounded p-4">
                    <div class="relative mx-auto">
                        <img class="rounded w-full"
                             :src="item.images[0]"
                             :alt="item.title"
                             style="max-width: 300px; height: 150px" />
                    </div>
                </div>
                <div class="pt-6">
                    <div class="flex flex-col gap-2">
                        <span class="text-sm text-surface-500">
                            {{ item.category.name }} / {{ item.subcategory.name }}
                        </span>
                        <div class="text-lg font-medium">{{ item.title }}</div>
                        <div class="text-sm text-surface-500">
                            {{ formatFirebaseTimestampToTime(item.createdAt) }}
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
                                isDisplayUAH=true
                            />
                        </div>
                        <PropertyActions :item="item" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
