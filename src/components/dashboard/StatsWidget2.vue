<template>
    <div class="col-span-12 lg:col-span-6 xl:col-span-3">
        <div class="card mb-0">
            <div class="flex justify-between mb-4">
                <div>
                    <span class="block text-muted-color font-medium mb-4">Квартир</span>
                    <div
                        v-if="analyticsStore.properties['apartments']"
                        class="text-surface-900 dark:text-surface-0 font-medium text-xl">
                        {{analyticsStore.properties['apartments'].length}}
                    </div>
                </div>
                <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                    <i class="pi pi-dollar text-blue-500 !text-xl"></i>
                </div>
            </div>
            <span class="text-primary font-medium"> + {{analyticsStore.propertiesLastWeek['apartments']}} нових </span>
            <span class="text-muted-color">за останній тиждень</span>
        </div>
    </div>
    <div class="col-span-12 lg:col-span-6 xl:col-span-3">
        <div class="card mb-0">
            <div class="flex justify-between mb-4">
                <div>
                    <span class="block text-muted-color font-medium mb-4 mr-2">Будинки </span>
                    <div v-if="analyticsStore.properties['houses']" class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{analyticsStore.properties['houses'].length}}</div>
                </div>
                <div class="flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                    <i class="pi pi pi-home text-orange-500 !text-xl"></i>
                </div>
            </div>
            <span class="text-primary font-medium">+ {{analyticsStore.propertiesLastWeek['houses']}} нових</span>
            <span class="text-muted-color"> за останній тиждень</span>
        </div>
    </div>
    <div class="col-span-12 lg:col-span-6 xl:col-span-3">
        <div class="card mb-0">
            <div class="flex justify-between mb-4">
                <div>
                    <span class="block text-muted-color font-medium mb-4">Комерція</span>
                    <div
                        v-if="analyticsStore.properties['commercial']"
                        class="text-surface-900 dark:text-surface-0 font-medium text-xl">
                        {{analyticsStore.properties['commercial'].length}}
                    </div>
                </div>
                <div class="flex items-center justify-center bg-cyan-100 dark:bg-cyan-400/10 rounded-border"
                     style="width: 2.5rem; height: 2.5rem"
                >
                    <i class="pi pi-dollar text-cyan-500 !text-xl"></i>
                </div>
            </div>
            <span class="text-primary font-medium">+ {{analyticsStore.propertiesLastWeek['commercial']}} нових </span>
            <span class="text-muted-color">за останній тиждень</span>
        </div>
    </div>
    <div class="col-span-12 lg:col-span-6 xl:col-span-3">
        <div class="card mb-0">
            <div v-if="analyticsStore.properties['offices']" class="flex justify-between mb-4">
                <div>
                    <span class="block text-muted-color font-medium mb-4">Офіси</span>
                    <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{analyticsStore.properties['offices'].length}}</div>
                </div>
                <div class="flex items-center justify-center bg-purple-100 dark:bg-purple-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                    <i class="pi pi-sitemap text-purple-500 !text-xl"></i>
                </div>
            </div>
            <span class="text-primary font-medium">+ {{analyticsStore.propertiesLastWeek['offices']}} нових </span>
            <span class="text-muted-color">за останній тиждень</span>
        </div>
    </div>
</template>

<script setup>
import { defineProps, onMounted } from 'vue';
import { useAnalyticsStore } from '@/store/analytics';

const analyticsStore = useAnalyticsStore();

const categories = ['apartments', 'houses', 'commercial', 'offices'];

onMounted(async () => {
    await analyticsStore.getPropertiesByCategories(categories);
    await analyticsStore.getPropertiesByCategories(categories, true);

    console.log(analyticsStore.properties)
    console.log(analyticsStore.propertiesLastWeek)

});
</script>
