<script setup>
import { computed, onMounted } from "vue";
import AppConfigurator from "@/layout/AppConfigurator.vue";
import {useLayout} from "@/layout/composables/layout";
import {useRouter} from "vue-router";
import { useAuthStore } from '@/store/authFirebase';

const authStore = useAuthStore();

const user = computed(() => {
    return authStore?.user;
});

const { toggleDarkMode, isDarkTheme } = useLayout();

const router = useRouter();

const handleLogout = async () => {
    try {
        await authStore.logout();
    } catch (error) {
        console.error('Помилка при виході:', error);
    }
};

function smoothScroll(id) {
    document.body.click();
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function navigateTo(route) {
    router.push(route);
}

onMounted(() => {
    authStore.initializeAuth()
});
</script>

<template>
    <a class="flex items-center" href="#">
        <img
            src="@/assets/layout/images/logo.svg"
            alt="logo"
            class="w-18 h-18"
        />
        <span class="text-surface-900 dark:text-surface-0 font-medium text-2xl leading-normal ml-5 mr-20">Нерухомість</span>
    </a>
    <Button
        class="lg:!hidden"
        text
        severity="secondary"
        rounded
        v-styleclass="{ selector: '@next', enterFromClass: 'hidden', enterActiveClass: 'animate-scalein', leaveToClass: 'hidden', leaveActiveClass: 'animate-fadeout', hideOnOutsideClick: true }"
    >
        <i class="pi pi-bars !text-2xl"></i>
    </Button>
    <div class="items-center bg-surface-0 dark:bg-surface-900 grow justify-between hidden lg:flex absolute lg:static w-full left-0 top-full px-12 lg:px-0 z-20 rounded-border">
        <ul class="list-none p-0 m-0 flex lg:items-center select-none flex-col lg:flex-row cursor-pointer gap-8">
            <li>
                <a @click="smoothScroll('features')" class="px-0 py-4 text-surface-900 dark:text-surface-0 font-medium text-xl">
                    <span>Вибрати нерухомість</span>
                </a>
            </li>
            <li>
                <a @click="smoothScroll('highlights')" class="px-0 py-4 text-surface-900 dark:text-surface-0 font-medium text-xl">
                    <span>Про додаток</span>
                </a>
            </li>
            <li>
                <a @click="navigateTo('/cherkasy-areas')" class="px-0 py-4 text-surface-900 dark:text-surface-0 font-medium text-xl">
                    <span>Райони</span>
                </a>
            </li>
            <li>
                <a @click="navigateTo('/add-properties')" class="px-0 py-4 text-surface-900 dark:text-surface-0 font-medium text-xl">
                    <span>Додати нерухомість</span>
                </a>
            </li>
        </ul>
        <div class="flex border-t lg:border-t-0 border-surface py-4 lg:py-0 mt-4 lg:mt-0 gap-2">
            <div class="flex items-center mr-4">
                <div v-if="user" class="flex items-center gap-6 mr-4">
                    <router-link to="/users/user/profile" class="flex flex-col items-center gap-1">
                        <img
                            v-if="user.avatar"
                            :src="user.avatar"
                            alt="Аватар"
                            class="w-10 h-10 rounded-full object-cover border-2 border-blue-100"
                        />
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-sm">
                            {{ user.displayName }}
                        </div>
                    </router-link>
                    <Button
                        label="Вихід"
                        as="button"
                        @click="handleLogout"
                        rounded
                    ></Button>
                </div>
                <div v-else class="flex items-center gap-4">
                    <Button label="Вхід" text as="router-link" to="/auth/login" rounded></Button>
                    <Button label="Реєстрація" as="router-link" to="/auth/register" rounded></Button>
                </div>
            </div>

            <button type="button" class="layout-topbar-action" @click="toggleDarkMode">
                <i :class="['pi', { 'pi-moon': isDarkTheme, 'pi-sun': !isDarkTheme }]"></i>
            </button>

            <Button
                v-styleclass="{
                selector: '@next',
                 enterFromClass: 'hidden',
                  enterActiveClass: 'animate-scalein',
                   leaveToClass: 'hidden',
                    leaveActiveClass: 'animate-fadeout',
                     hideOnOutsideClick: true
            }"
                type="button"
                text
                class="layout-topbar-action layout-topbar-action-highlight ml-2"
            >
                <i class="pi pi-palette"></i>
            </Button>
            <AppConfigurator class="mt-10" />
        </div>
    </div>
</template>
