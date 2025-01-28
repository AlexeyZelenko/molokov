<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/store/authFirebase';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: 'Головна',
        items: [{ label: 'Головна', icon: 'pi pi-fw pi-home', to: '/landing' }]
    },
    {
        label: 'Нерухомість',
        icon: 'pi pi-fw pi-briefcase',
        items: [
            {
                label: 'Квартири',
                icon: 'pi pi-fw pi-briefcase',
                items: [
                    {
                        label: 'Продаж',
                        icon: 'pi pi-fw pi-plus',
                        to: '/categories/apartments/sell'
                    },
                    {
                        label: 'Оренда',
                        icon: 'pi pi-fw pi-list',
                        to: '/categories/apartments/rent'
                    },
                    {
                        label: 'Обмін',
                        icon: 'pi pi-fw pi-list',
                        to: '/categories/apartments/exchange'
                    },
                    {
                        label: 'Подобово',
                        icon: 'pi pi-fw pi-list',
                        to: '/categories/apartments/daily'
                    }
                ]
            },
            {
                label: 'Будинки',
                icon: 'pi pi-fw pi-briefcase',
                items: [
                    {
                        label: 'Продаж',
                        icon: 'pi pi-fw pi-plus',
                        to: '/categories/houses/sell'
                    },
                    {
                        label: 'Оренда',
                        icon: 'pi pi-fw pi-list',
                        to: '/categories/houses/rent'
                    },
                    {
                        label: 'Обмін',
                        icon: 'pi pi-fw pi-list',
                        to: '/categories/houses/exchange'
                    },
                    {
                        label: 'Подобово',
                        icon: 'pi pi-fw pi-list',
                        to: '/categories/houses/daily'
                    }
                ]
            },
            {
                label: 'Приміщення',
                icon: 'pi pi-fw pi-briefcase',
                items: [
                    {
                        label: 'Продаж',
                        icon: 'pi pi-fw pi-plus',
                        to: '/categories/offices/sell'
                    },
                    {
                        label: 'Оренда',
                        icon: 'pi pi-fw pi-list',
                        to: '/categories/offices/rent'
                    },
                    {
                        label: 'Обмін',
                        icon: 'pi pi-fw pi-list',
                        to: '/categories/offices/exchange'
                    },
                    {
                        label: 'Подобово',
                        icon: 'pi pi-fw pi-list',
                        to: '/categories/offices/daily'
                    }
                ]
            },
            {
                label: 'Будівлі',
                icon: 'pi pi-fw pi-briefcase',
                items: [
                    {
                        label: 'Продаж',
                        icon: 'pi pi-fw pi-plus',
                        to: '/categories/commercial/sell'
                    },
                    {
                        label: 'Оренда',
                        icon: 'pi pi-fw pi-list',
                        to: '/categories/commercial/rent'
                    },
                    {
                        label: 'Обмін',
                        icon: 'pi pi-fw pi-list',
                        to: '/categories/commercial/exchange'
                    },
                    {
                        label: 'Подобово',
                        icon: 'pi pi-fw pi-list',
                        to: '/categories/commercial/daily'
                    }
                ]
            },
            {
                label: 'Земельні ділянки',
                icon: 'pi pi-fw pi-briefcase',
                items: [
                    {
                        label: 'Продаж',
                        icon: 'pi pi-fw pi-plus',
                        to: '/categories/land/sell'
                    },
                    {
                        label: 'Оренда',
                        icon: 'pi pi-fw pi-list',
                        to: '/categories/land/rent'
                    },
                    {
                        label: 'Обмін',
                        icon: 'pi pi-fw pi-list',
                        to: '/categories/land/exchange'
                    },
                    {
                        label: 'Подобово',
                        icon: 'pi pi-fw pi-list',
                        to: '/categories/land/daily'
                    }
                ]
            },
            {
                label: 'Інше',
                icon: 'pi pi-fw pi-briefcase',
                items: [
                    {
                        label: 'Продаж',
                        icon: 'pi pi-fw pi-plus',
                        to: '/categories/other/sell'
                    },
                    {
                        label: 'Оренда',
                        icon: 'pi pi-fw pi-list',
                        to: '/categories/other/rent'
                    },
                    {
                        label: 'Обмін',
                        icon: 'pi pi-fw pi-list',
                        to: '/categories/other/exchange'
                    },
                    {
                        label: 'Подобово',
                        icon: 'pi pi-fw pi-list',
                        to: '/categories/other/daily'
                    }
                ]
            },
        ]
    },
    {
        label: 'Нерухомість (admin)',
        icon: 'pi pi-fw pi-briefcase',
        items: [
            {
                label: 'Квартири',
                icon: 'pi pi-fw pi-briefcase',
                items: [
                    {
                        label: 'Додати',
                        icon: 'pi pi-fw pi-plus',
                        to: '/pages/apartments/add'
                    },
                    // {
                    //     label: 'Таблиця',
                    //     icon: 'pi pi-fw pi-list',
                    //     to: '/pages/apartments/table'
                    // },
                    // {
                    //     label: 'Список',
                    //     icon: 'pi pi-fw pi-list',
                    //     to: '/pages/apartments/list'
                    // }
                ]
            },
            {
                label: 'Будинки',
                icon: 'pi pi-fw pi-briefcase',
                items: [
                    {
                        label: 'Додати',
                        icon: 'pi pi-fw pi-plus',
                        to: '/pages/houses/add'
                    },
                    // {
                    //     label: 'Список',
                    //     icon: 'pi pi-fw pi-list',
                    //     to: '/pages/houses/table'
                    // }
                ]
            },
            {
                label: 'Приміщення',
                icon: 'pi pi-fw pi-briefcase',
                items: [
                    {
                        label: 'Додати',
                        icon: 'pi pi-fw pi-plus',
                        to: '/pages/offices/add'
                    },
                    // {
                    //     label: 'Список',
                    //     icon: 'pi pi-fw pi-list',
                    //     to: '/pages/offices/table'
                    // }
                ]
            },
            {
                label: 'Будівлі',
                icon: 'pi pi-fw pi-briefcase',
                items: [
                    {
                        label: 'Додати',
                        icon: 'pi pi-fw pi-plus',
                        to: '/pages/commercial/add'
                    },
                    // {
                    //     label: 'Список',
                    //     icon: 'pi pi-fw pi-list',
                    //     to: '/pages/commercial/table'
                    // }
                ]
            },
            {
                label: 'Земельні ділянки',
                icon: 'pi pi-fw pi-briefcase',
                items: [
                    {
                        label: 'Додати',
                        icon: 'pi pi-fw pi-plus',
                        to: '/pages/land/add'
                    },
                    // {
                    //     label: 'Список',
                    //     icon: 'pi pi-fw pi-list',
                    //     to: '/pages/land/table'
                    // }
                ]
            },
            {
                label: 'Інше',
                icon: 'pi pi-fw pi-briefcase',
                items: [
                    {
                        label: 'Додати',
                        icon: 'pi pi-fw pi-plus',
                        to: '/pages/other/add'
                    },
                    // {
                    //     label: 'Таблиця',
                    //     icon: 'pi pi-fw pi-list',
                    //     to: '/pages/other/table'
                    // }
                ]
            },
        ]
    },
    {
        label: 'Профіль',
        icon: 'pi pi-fw pi-briefcase',
        items: [
            {
                label: 'Налаштування',
                icon: 'pi pi-fw pi-cog',
                items: [
                    {
                        label: 'Мій профіль',
                        icon: 'pi pi-fw pi-user',
                        to: '/users/user/profile'
                    },
                ]
            },
            {
                label: 'Клієнти',
                icon: 'pi pi-fw pi-users',
                items: [
                    {
                        label: 'Таблиця клієнтів',
                        icon: 'pi pi-fw pi-list',
                        to: '/categories/houses/sell'
                    },
                    {
                        label: 'Виборка для клієнтів',
                        icon: 'pi pi-fw pi-list',
                        items: [
                            {
                                label: 'Списки',
                                icon: 'pi pi-fw pi-list',
                                to: '/categories/offices/sell'
                            },
                        ]
                    },
                ]
            },
        ]
    },
    {
        label: 'UI Components',
        items: [
            { label: 'Form Layout', icon: 'pi pi-fw pi-id-card', to: '/uikit/formlayout' },
            { label: 'Input', icon: 'pi pi-fw pi-check-square', to: '/uikit/input' },
            { label: 'Button', icon: 'pi pi-fw pi-mobile', to: '/uikit/button', class: 'rotated-icon' },
            { label: 'Table', icon: 'pi pi-fw pi-table', to: '/uikit/table' },
            { label: 'List', icon: 'pi pi-fw pi-list', to: '/uikit/list' },
            { label: 'Tree', icon: 'pi pi-fw pi-share-alt', to: '/uikit/tree' },
            { label: 'Panel', icon: 'pi pi-fw pi-tablet', to: '/uikit/panel' },
            { label: 'Overlay', icon: 'pi pi-fw pi-clone', to: '/uikit/overlay' },
            { label: 'Media', icon: 'pi pi-fw pi-image', to: '/uikit/media' },
            { label: 'Menu', icon: 'pi pi-fw pi-bars', to: '/uikit/menu' },
            { label: 'Message', icon: 'pi pi-fw pi-comment', to: '/uikit/message' },
            { label: 'File', icon: 'pi pi-fw pi-file', to: '/uikit/file' },
            { label: 'Chart', icon: 'pi pi-fw pi-chart-bar', to: '/uikit/charts' },
            { label: 'Timeline', icon: 'pi pi-fw pi-calendar', to: '/uikit/timeline' },
            { label: 'Misc', icon: 'pi pi-fw pi-circle', to: '/uikit/misc' }
        ]
    },
    {
        label: 'Pages',
        icon: 'pi pi-fw pi-briefcase',
        to: '/pages',
        items: [
            {
                label: 'Landing',
                icon: 'pi pi-fw pi-globe',
                to: '/landing'
            },
            {
                label: 'Auth',
                icon: 'pi pi-fw pi-user',
                items: [
                    {
                        label: 'Login',
                        icon: 'pi pi-fw pi-sign-in',
                        to: '/auth/login'
                    },
                    {
                        label: 'Error',
                        icon: 'pi pi-fw pi-times-circle',
                        to: '/auth/error'
                    },
                    {
                        label: 'Access Denied',
                        icon: 'pi pi-fw pi-lock',
                        to: '/auth/access'
                    }
                ]
            },
            {
                label: 'Crud',
                icon: 'pi pi-fw pi-pencil',
                to: '/pages/crud'
            },
            {
                label: 'Not Found',
                icon: 'pi pi-fw pi-exclamation-circle',
                to: '/pages/notfound'
            },
            {
                label: 'Empty',
                icon: 'pi pi-fw pi-circle-off',
                to: '/pages/empty'
            }
        ]
    },
    {
        label: 'Hierarchy',
        items: [
            {
                label: 'Submenu 1',
                icon: 'pi pi-fw pi-bookmark',
                items: [
                    {
                        label: 'Submenu 1.1',
                        icon: 'pi pi-fw pi-bookmark',
                        items: [
                            { label: 'Submenu 1.1.1', icon: 'pi pi-fw pi-bookmark' },
                            { label: 'Submenu 1.1.2', icon: 'pi pi-fw pi-bookmark' },
                            { label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-bookmark' }
                        ]
                    },
                    {
                        label: 'Submenu 1.2',
                        icon: 'pi pi-fw pi-bookmark',
                        items: [{ label: 'Submenu 1.2.1', icon: 'pi pi-fw pi-bookmark' }]
                    }
                ]
            },
            {
                label: 'Submenu 2',
                icon: 'pi pi-fw pi-bookmark',
                items: [
                    {
                        label: 'Submenu 2.1',
                        icon: 'pi pi-fw pi-bookmark',
                        items: [
                            { label: 'Submenu 2.1.1', icon: 'pi pi-fw pi-bookmark' },
                            { label: 'Submenu 2.1.2', icon: 'pi pi-fw pi-bookmark' }
                        ]
                    },
                    {
                        label: 'Submenu 2.2',
                        icon: 'pi pi-fw pi-bookmark',
                        items: [{ label: 'Submenu 2.2.1', icon: 'pi pi-fw pi-bookmark' }]
                    }
                ]
            }
        ]
    },
    {
        label: 'Get Started',
        items: [
            {
                label: 'Documentation',
                icon: 'pi pi-fw pi-book',
                to: '/documentation'
            },
            {
                label: 'View Source',
                icon: 'pi pi-fw pi-github',
                url: 'https://github.com/primefaces/sakai-vue',
                target: '_blank'
            }
        ]
    }
]);

const store = useAuthStore();
const user = computed(() => store.user);

onMounted(() => {
    console.log('user', user);
})
</script>

<template>
    <div v-if="user" class="text-green-500 my-4">
        <i class="pi pi-user mr-2"></i>
        {{user?.displayName}}
    </div>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
