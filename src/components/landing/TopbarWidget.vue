<script setup>
import { computed, onMounted, ref } from 'vue';
import AppConfigurator from '@/layout/AppConfigurator.vue';
import { useLayout } from '@/layout/composables/layout';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/authFirebase';

const authStore = useAuthStore();
const mobileMenuVisible = ref(false);

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
    mobileMenuVisible.value = false;
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function navigateTo(route) {
    mobileMenuVisible.value = false;
    router.push(route);
}

function toggleMobileMenu() {
    mobileMenuVisible.value = !mobileMenuVisible.value;
}

onMounted(() => {
    authStore.initializeAuth();
});
</script>

<template>
    <section class="flex justify-between w-full border-b-[1px] pb-4">
        <a class="flex items-center" href="#">
            <img src="@/assets/layout/images/logo.svg" alt="logo" class="w-18 h-18 mr-20" />
        </a>
        <Button
            class="lg:!hidden"
            text
            severity="secondary"
            rounded
            @click="toggleMobileMenu"
        >
            <i class="pi pi-bars !text-2xl"></i>
        </Button>
        <!-- Десктопное меню -->
        <div class="items-center justify-between hidden lg:flex lg:static w-full left-0 top-full px-12 lg:px-0 z-20 rounded-border">
            <ul class="list-none p-0 m-0 flex lg:items-center select-none flex-col lg:flex-row cursor-pointer gap-8">
                <li>
                    <a @click="smoothScroll('features')" class="px-0 py-4 text-surface-900 dark:text-surface-0 font-medium text-lg lg:text-xl hover:text-primary-500 dark:hover:text-primary-400 transition-colors duration-200">
                        <span>Вибрати нерухомість</span>
                    </a>
                </li>
                <li>
                    <a @click="smoothScroll('highlights')" class="px-0 py-4 text-surface-900 dark:text-surface-0 font-medium text-lg lg:text-xl hover:text-primary-500 dark:hover:text-primary-400 transition-colors duration-200">
                        <span>Про додаток</span>
                    </a>
                </li>
                <li>
                    <a @click="navigateTo('/cherkasy-areas')" class="px-0 py-4 text-surface-900 dark:text-surface-0 font-medium text-lg lg:text-xl hover:text-primary-500 dark:hover:text-primary-400 transition-colors duration-200">
                        <span>Райони</span>
                    </a>
                </li>
                <li class="bg-primary-500 dark:bg-primary-400 rounded-full px-4 py-2 hover:bg-primary-600 dark:hover:bg-primary-300 transition-colors duration-200">
                    <a @click="navigateTo('/add-properties')" class="px-0 py-4 text-surface-0 font-medium text-lg lg:text-xl">
                        <span>Додати нерухомість</span>
                    </a>
                </li>
            </ul>
            <div class="flex border-t lg:border-t-0 border-surface py-4 lg:py-0 mt-4 lg:mt-0 gap-2">
                <div class="flex items-center mr-4">
                    <div v-if="user" class="flex items-center gap-6 mr-4">
                        <router-link to="/users/user/profile" class="flex flex-col items-center gap-1">
                            <img v-if="user.avatar" :src="user.avatar" alt="Аватар" class="w-10 h-10 rounded-full object-cover border-2 border-blue-100" />
                            <div class="text-surface-900 dark:text-surface-0 font-medium text-sm">
                                {{ user.displayName }}
                            </div>
                        </router-link>
                        <Button label="Вихід" as="button" @click="handleLogout" rounded></Button>
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
        
        <!-- Мобильное меню -->
        <div v-if="mobileMenuVisible" 
             class="fixed inset-0 bg-surface-900/80 dark:bg-surface-0/80 backdrop-blur-sm z-30 lg:hidden"
             @click="mobileMenuVisible = false">
        </div>
        <div v-if="mobileMenuVisible" 
             class="fixed top-0 right-0 h-full w-4/5 max-w-xs bg-surface-0 dark:bg-surface-900 shadow-lg z-40 p-6 flex flex-col lg:hidden animate-slideright">
            <div class="flex justify-between items-center mb-8">
                <img src="@/assets/layout/images/logo.svg" alt="logo" class="w-14 h-14" />
                <Button text severity="secondary" rounded @click="toggleMobileMenu">
                    <i class="pi pi-times !text-2xl"></i>
                </Button>
            </div>
            
            <ul class="list-none p-0 m-0 flex flex-col select-none cursor-pointer gap-6">
                <li>
                    <a @click="smoothScroll('features')" class="flex items-center px-0 py-3 text-surface-900 dark:text-surface-0 font-medium text-base lg:text-lg hover:text-primary-500 dark:hover:text-primary-400 transition-colors duration-200">
                        <span>Вибрати нерухомість</span>
                    </a>
                </li>
                <li>
                    <a @click="smoothScroll('highlights')" class="flex items-center px-0 py-3 text-surface-900 dark:text-surface-0 font-medium text-base lg:text-lg hover:text-primary-500 dark:hover:text-primary-400 transition-colors duration-200">
                        <span>Про додаток</span>
                    </a>
                </li>
                <li>
                    <a @click="navigateTo('/cherkasy-areas')" class="flex items-center px-0 py-3 text-surface-900 dark:text-surface-0 font-medium text-base lg:text-lg hover:text-primary-500 dark:hover:text-primary-400 transition-colors duration-200">
                        <span>Райони</span>
                    </a>
                </li>
                <li class="bg-primary-500 dark:bg-primary-400 rounded-full px-4 py-2 hover:bg-primary-600 dark:hover:bg-primary-300 transition-colors duration-200">
                    <a @click="navigateTo('/add-properties')" class="flex items-center px-0 py-1 text-surface-0 font-medium text-base lg:text-lg">
                        <span>Додати нерухомість</span>
                    </a>
                </li>
            </ul>
            
            <div class="mt-auto pt-6 border-t border-surface-200 dark:border-surface-700">
                <div v-if="user" class="flex flex-col gap-4">
                    <router-link to="/users/user/profile" class="flex items-center gap-3" @click="mobileMenuVisible = false">
                        <img v-if="user.avatar" :src="user.avatar" alt="Аватар" class="w-10 h-10 rounded-full object-cover border-2 border-blue-100" />
                        <div class="text-surface-900 dark:text-surface-0 font-medium">
                            {{ user.displayName }}
                        </div>
                    </router-link>
                    <Button label="Вихід" as="button" @click="handleLogout" rounded class="w-full"></Button>
                </div>
                <div v-else class="flex flex-col gap-4">
                    <Button label="Вхід" as="router-link" to="/auth/login" rounded class="w-full" @click="mobileMenuVisible = false"></Button>
                    <Button label="Реєстрація" as="router-link" to="/auth/register" rounded class="w-full" @click="mobileMenuVisible = false"></Button>
                </div>
                
                <div class="flex items-center justify-between mt-6">
                    <button type="button" class="flex items-center gap-2 px-4 py-2 rounded-full border border-surface-200 dark:border-surface-700" @click="toggleDarkMode">
                        <i :class="['pi', { 'pi-moon': isDarkTheme, 'pi-sun': !isDarkTheme }]"></i>
                        <span>{{ isDarkTheme ? 'Темна тема' : 'Світла тема' }}</span>
                    </button>
                </div>
            </div>
        </div>
    </section>
</template>