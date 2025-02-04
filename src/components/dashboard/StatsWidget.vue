<template>
    <div class="col-span-12 lg:col-span-6 xl:col-span-3">
        <div class="card mb-0">
            <div class="flex justify-between mb-4">
                <div>
                    <span class="block text-muted-color font-medium mb-4">Об'єктів на продаж</span>
                    <div
                        v-if="analyticsStore.properties['sell']"
                        class="text-surface-900 dark:text-surface-0 font-medium text-xl">
                        {{analyticsStore.properties['sell'].length}}
                    </div>
                </div>
                <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                    <i class="pi pi-dollar text-blue-500 !text-xl"></i>
                </div>
            </div>
            <span class="text-primary font-medium"> + {{analyticsStore.propertiesLastWeek['sell']}} нових </span>
            <span class="text-muted-color">за останній тиждень</span>
        </div>
    </div>
    <div class="col-span-12 lg:col-span-6 xl:col-span-3">
        <div class="card mb-0">
            <div class="flex justify-between mb-4">
                <div>
                    <span class="block text-muted-color font-medium mb-4 mr-2">Об'єктів аренди </span>
                    <div v-if="analyticsStore.properties['rent']" class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{analyticsStore.properties['rent'].length}}</div>
                </div>
                <div class="flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                    <i class="pi pi pi-shop text-orange-500 !text-xl"></i>
                </div>
            </div>
            <span class="text-primary font-medium">+ {{analyticsStore.propertiesLastWeek['rent']}} нових</span>
            <span class="text-muted-color"> за останній тиждень</span>
        </div>
    </div>
    <div class="col-span-12 lg:col-span-6 xl:col-span-3">
        <div class="card mb-0">
            <div class="flex justify-between mb-4">
                <div>
                    <span class="block text-muted-color font-medium mb-4">Об'єктів подобово</span>
                    <div
                        v-if="analyticsStore.properties['daily']"
                        class="text-surface-900 dark:text-surface-0 font-medium text-xl">
                        {{analyticsStore.properties['daily'].length}}
                    </div>
                </div>
                <div class="flex items-center justify-center bg-cyan-100 dark:bg-cyan-400/10 rounded-border"
                     style="width: 2.5rem; height: 2.5rem"
                >
                    <i class="pi pi-users text-cyan-500 !text-xl"></i>
                </div>
            </div>
            <span class="text-primary font-medium">+ {{analyticsStore.propertiesLastWeek['daily']}} нових </span>
            <span class="text-muted-color">за останній тиждень</span>
        </div>
    </div>
    <div class="col-span-12 lg:col-span-6 xl:col-span-3">
        <div v-if="analyticsStore.properties['exchange']" class="card mb-0">
            <div class="flex justify-between mb-4">
                <div>
                    <span class="block text-muted-color font-medium mb-4">Об'єктів на обмін</span>
                    <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{analyticsStore.properties['exchange'].length}}</div>
                </div>
                <div class="flex items-center justify-center bg-purple-100 dark:bg-purple-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                    <i class="pi pi-undo text-purple-500 !text-xl"></i>
                </div>
            </div>
            <span class="text-primary font-medium">+ {{analyticsStore.propertiesLastWeek['exchange']}} нових </span>
            <span class="text-muted-color">за останній тиждень</span>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useAnalyticsStore } from '@/store/analytics';

const analyticsStore = useAnalyticsStore();

const categories = ['sell', 'rent', 'daily', 'exchange'];

onMounted(async () => {
    await analyticsStore.getPropertiesByCategories(categories);
    await analyticsStore.getPropertiesByCategories(categories, true);
});
</script>
