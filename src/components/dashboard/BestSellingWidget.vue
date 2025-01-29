<script setup>
import {computed, onMounted, ref} from 'vue';
import { useAnalyticsStore } from '@/store/analytics';

const analyticsStore = useAnalyticsStore();

const categories = ['users'];

const menu = ref(null);

const items = ref([
    { label: 'Add New', icon: 'pi pi-fw pi-plus' },
    { label: 'Remove', icon: 'pi pi-fw pi-trash' }
]);

const sell = computed(() => analyticsStore.properties['sell'] || []);
const users = computed(() => analyticsStore.properties['users'] || []);

const creatorsCountAd = computed(() => {
    if (!sell.value?.length) return {};
    return sell.value.reduce((acc, item) => {
        const creatorId = item.creator?.id; // Use a unique identifier like "id" or "name"
        if (creatorId) {
            acc[creatorId] = (acc[creatorId] || 0) + 1;
        }
        return acc;
    }, {});
});

const mapUsers = computed(() => {
    if (Object.keys(creatorsCountAd.value).length === 0) return [];

    // 2. Добавляем сортировку по убыванию количества объявлений
    return users.value
        .filter(user => creatorsCountAd.value[user.id])
        .map(user => ({
            ...user,
            count: creatorsCountAd.value[user.id] || 0
        }))
        .sort((a, b) => b.count - a.count); // Сортировка DESC
});

// 3. Вычисляем максимальное значение для прогресс-баров
const maxCount = computed(() => {
    return Math.max(...mapUsers.value.map(user => user.count), 0);
});

onMounted(async () => {
    await analyticsStore.getPropertiesByCategories(categories);
    await analyticsStore.getPropertiesByCategories(categories, true);
});
</script>

<template>
    <div class="card">
        <div class="flex justify-between items-center mb-6">
            <div>
                <div class="font-semibold text-xl">Користувачі</div>
                <span class="text-primary font-medium">+ {{analyticsStore.propertiesLastWeek['users']}} нових </span>
                <span class="text-muted-color">за останній тиждень</span>
            </div>

            <div class="flex items-center justify-center bg-cyan-100 dark:bg-cyan-400/10 rounded-border"
                 style="width: 2.5rem; height: 2.5rem"
            >
                {{users?.length}}
            </div>
        </div>
        <ul class="list-none p-0 m-0">
            <li
                v-for="(user, index) in mapUsers.slice(0, 5)"
                :key="user.id"
                class="flex flex-col md:flex-row md:items-center md:justify-between mb-6"
            >
                <div>
          <span class="text-surface-900 dark:text-surface-0 font-medium mr-2 mb-1 md:mb-0">
            {{ user.name }}
          </span>
                    <div class="mt-1 text-muted-color">{{ user.email }}</div>
                </div>
                <div class="mt-2 md:mt-0 flex items-center">
                    <div
                        class="bg-surface-300 dark:bg-surface-500 rounded-border overflow-hidden w-40 lg:w-24"
                        style="height: 8px"
                    >
                        <!-- 4. Динамический расчет ширины прогресс-бара -->
                        <div
                            class="h-full"
                            :class="{
                'bg-orange-500': index === 0,
                'bg-cyan-500': index === 1,
                'bg-pink-500': index === 2,
                'bg-green-500': index === 3,
                'bg-purple-500': index === 4
              }"
                            :style="{ width: `${(user.count / maxCount) * 100}%` }"
                        ></div>
                    </div>
                    <span
                        class="ml-4 font-medium"
                        :class="{
              'text-orange-500': index === 0,
              'text-cyan-500': index === 1,
              'text-pink-500': index === 2,
              'text-green-500': index === 3,
              'text-purple-500': index === 4
            }"
                    >
            {{ user.count }}
          </span>
                </div>
            </li>
        </ul>
    </div>
</template>
