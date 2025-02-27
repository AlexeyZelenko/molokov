<script setup>
import { useLayout } from '@/layout/composables/layout';
import AppConfigurator from './AppConfigurator.vue';
import { useAuthStore } from '@/store/authFirebase';
import { useRouter } from 'vue-router';

const router = useRouter();

const authStore = useAuthStore();
const user = authStore.user;

const handleLogout = async () => {
    try {
        await authStore.logout();
        await router.push('/');
    } catch (error) {
        console.error('Ошибка при выходе:', error);
    }
};

const { toggleMenu, toggleDarkMode, isDarkTheme } = useLayout();
</script>

<template>
    <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" @click="toggleMenu">
                <i class="pi pi-bars"></i>
            </button>
            <router-link to="/" class="layout-topbar-logo">
                <svg viewBox="0 0 54 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M27 2L8 16V38H46V16L27 2ZM27 6L12 16.5V34H42V16.5L27 6Z"
                        fill="var(--primary-color)"
                    />
                    <mask id="mask0" style="mask-type: alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="54" height="20">
                        <path d="M27 0L0 20H54L27 0Z" fill="var(--primary-color)" />
                    </mask>
                    <g mask="url(#mask0)">
                        <path
                            d="M27 2L0 22L4 24L27 6L50 24L54 22L27 2Z"
                            fill="var(--primary-color)"
                        />
                    </g>
                    <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M24 24H30V34H24V24ZM26 26H28V32H26V26Z
           M16 20H22V28H16V20ZM18 22H20V26H18V22Z
           M32 20H38V28H32V20ZM34 22H36V26H34V22Z"
                        fill="var(--primary-color)"
                    />
                </svg>
            </router-link>
        </div>

        <div class="layout-topbar-actions">
            <div class="layout-config-menu">
                <button type="button" class="layout-topbar-action" @click="toggleDarkMode">
                    <i :class="['pi', { 'pi-moon': isDarkTheme, 'pi-sun': !isDarkTheme }]"></i>
                </button>
                <div class="relative">
                    <button
                        v-styleclass="{ selector: '@next', enterFromClass: 'hidden', enterActiveClass: 'animate-scalein', leaveToClass: 'hidden', leaveActiveClass: 'animate-fadeout', hideOnOutsideClick: true }"
                        type="button"
                        class="layout-topbar-action layout-topbar-action-highlight"
                    >
                        <i class="pi pi-palette"></i>
                    </button>
                    <AppConfigurator />
                </div>
            </div>

            <button
                class="layout-topbar-menu-button layout-topbar-action"
                v-styleclass="{ selector: '@next', enterFromClass: 'hidden', enterActiveClass: 'animate-scalein', leaveToClass: 'hidden', leaveActiveClass: 'animate-fadeout', hideOnOutsideClick: true }"
            >
                <i class="pi pi-ellipsis-v"></i>
            </button>

            <div class="layout-topbar-menu hidden lg:block">
                <div class="layout-topbar-menu-content">
<!--                    <button type="button" class="layout-topbar-action">-->
<!--                        <i class="pi pi-calendar"></i>-->
<!--                        <span>Календар</span>-->
<!--                    </button>-->
<!--                    <button type="button" class="layout-topbar-action">-->
<!--                        <i class="pi pi-inbox"></i>-->
<!--                        <span>Сповіщення</span>-->
<!--                    </button>-->
                    <button v-if="user" @click="handleLogout" type="button" class="layout-topbar-action">
                        <i class="pi pi-sign-out"></i>
                        <span>Вихід</span>
                    </button>
                    <button v-else @click="handleLogout" type="button" class="layout-topbar-action">
                        <i class="pi pi-sign-in"></i>
                        <span>Увійти</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
