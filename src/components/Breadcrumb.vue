<script setup>
import { computed } from 'vue';
import { useBreadcrumbStore } from '@/store/breadcrumb';
import { useRouter } from 'vue-router';

const router = useRouter();

const breadcrumbStore = useBreadcrumbStore();

// Получаем элементы breadcrumb из store
const breadcrumbItems = computed(() => breadcrumbStore.items);

const goBack = () => {
    router.go(-1); // Переход на предыдущую страницу
};
</script>

<template>
    <nav aria-label="breadcrumb" class="flex mb-6 pr-4">
        <button type="button" class="breadcrumb--back-button" @click="goBack">
            <i class="pi pi-chevron-left"></i>
            <span class="mx-2"><strong>Назад</strong></span>
        </button>
        <ol class="breadcrumb">
            <li v-for="(item, index) in breadcrumbItems" :key="index" class="breadcrumb-item">
                <router-link v-if="index < breadcrumbItems.length - 1" :to="item.route || '/'">
                    <span v-if="item.icon">
                        <i :class="item.icon" class="mr-2"></i>
                        <i class="pi pi-angle-right"></i>
                    </span>
                    <span v-else>
                        {{ item.name }}
                        <i class="pi pi-angle-right"></i>
                    </span>
                </router-link>
                <span v-else>
                    {{ item.name }}
                </span>
            </li>
        </ol>
    </nav>
</template>

<style scoped lang="scss">
.breadcrumb {
    display: flex;
    list-style: none;
    gap: 5px;
    padding: 0;

    @media (max-width: 768px) {
        display: none;
        flex-wrap: wrap;
    }

    &--back-button {
        display: flex;
        align-items: center;
        font-size: 14px;
        background: none;
        border: none;
        cursor: pointer;
        outline: none;
        margin-right: 20px;

        span {
            font-weight: 500;
            letter-spacing: 0.8px;
        }
    }
}
.breadcrumb-item {
    font-size: 16px;
}
.breadcrumb-item a {
    text-decoration: none;
    color: gray;

    &:hover {
        color: black;
    }
}
.breadcrumb-item span {
    color: black;
}
</style>
