<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/store/authFirebase';
import { useUserStore } from '@/store/userStore';
import AppMenuItem from './AppMenuItem.vue';

const store = useAuthStore();
const userStore = useUserStore();
const userId = computed(() => {
    return store?.user?.uid;
});

const user = computed(() => {
    return store?.user;
});

const model = ref([
    {
        label: 'Головна',
        items: [
            { label: 'Головна', icon: 'pi pi-fw pi-home', to: '/landing' },
            { label: 'Аналітика', icon: 'pi pi-fw pi-chart-line', to: '/dashboard' }
        ]
    },
    {
        label: 'Нерухомість',
        icon: 'pi pi-fw pi-building',
        items: [
            {
                label: 'Квартири',
                icon: 'pi pi-fw pi-building',
                items: [
                    {
                        label: 'Продаж',
                        icon: 'pi pi-fw pi-tag',
                        to: '/categories/apartments/sell'
                    },
                    {
                        label: 'Оренда',
                        icon: 'pi pi-fw pi-calendar',
                        to: '/categories/apartments/rent'
                    },
                    {
                        label: 'Обмін',
                        icon: 'pi pi-fw pi-sync',
                        to: '/categories/apartments/exchange'
                    },
                    {
                        label: 'Подобово',
                        icon: 'pi pi-fw pi-clock',
                        to: '/categories/apartments/daily'
                    },
                    {
                        label: 'Інше',
                        icon: 'pi pi-fw pi-ellipsis-h',
                        to: '/categories/apartments/other',
                    }
                ]
            },
            {
                label: 'Кімнати',
                icon: 'pi pi-fw pi-building',
                items: [
                    {
                        label: 'Продаж',
                        icon: 'pi pi-fw pi-tag',
                        to: '/categories/rooms/sell'
                    },
                    {
                        label: 'Оренда',
                        icon: 'pi pi-fw pi-calendar',
                        to: '/categories/rooms/rent'
                    },
                    {
                        label: 'Обмін',
                        icon: 'pi pi-fw pi-sync',
                        to: '/categories/rooms/exchange'
                    },
                    {
                        label: 'Подобово',
                        icon: 'pi pi-fw pi-clock',
                        to: '/categories/rooms/daily'
                    },
                    {
                        label: 'Інше',
                        icon: 'pi pi-fw pi-ellipsis-h',
                        to: '/categories/rooms/other',
                    }
                ]
            },
            {
                label: 'Будинки',
                icon: 'pi pi-fw pi-home',
                items: [
                    {
                        label: 'Продаж',
                        icon: 'pi pi-fw pi-tag',
                        to: '/categories/houses/sell'
                    },
                    {
                        label: 'Оренда',
                        icon: 'pi pi-fw pi-calendar',
                        to: '/categories/houses/rent'
                    },
                    {
                        label: 'Обмін',
                        icon: 'pi pi-fw pi-sync',
                        to: '/categories/houses/exchange'
                    },
                    {
                        label: 'Подобово',
                        icon: 'pi pi-fw pi-clock',
                        to: '/categories/houses/daily'
                    }
                ]
            },
            {
                label: 'Приміщення',
                icon: 'pi pi-fw pi-building',
                items: [
                    {
                        label: 'Продаж',
                        icon: 'pi pi-fw pi-tag',
                        to: '/categories/offices/sell'
                    },
                    {
                        label: 'Оренда',
                        icon: 'pi pi-fw pi-calendar',
                        to: '/categories/offices/rent'
                    },
                    {
                        label: 'Обмін',
                        icon: 'pi pi-fw pi-sync',
                        to: '/categories/offices/exchange'
                    },
                    {
                        label: 'Подобово',
                        icon: 'pi pi-fw pi-clock',
                        to: '/categories/offices/daily'
                    }
                ]
            },
            {
                label: 'Гаражи',
                icon: 'pi pi-fw pi-building',
                items: [
                    {
                        label: 'Продаж',
                        icon: 'pi pi-fw pi-tag',
                        to: '/categories/garages/sell'
                    },
                    {
                        label: 'Оренда',
                        icon: 'pi pi-fw pi-calendar',
                        to: '/categories/garages/rent'
                    },
                    {
                        label: 'Обмін',
                        icon: 'pi pi-fw pi-sync',
                        to: '/categories/garages/exchange'
                    },
                    {
                        label: 'Подобово',
                        icon: 'pi pi-fw pi-clock',
                        to: '/categories/garages/daily'
                    }
                ]
            },
            {
                label: 'Будівлі',
                icon: 'pi pi-fw pi-building',
                items: [
                    {
                        label: 'Продаж',
                        icon: 'pi pi-fw pi-tag',
                        to: '/categories/commercial/sell'
                    },
                    {
                        label: 'Оренда',
                        icon: 'pi pi-fw pi-calendar',
                        to: '/categories/commercial/rent'
                    },
                    {
                        label: 'Обмін',
                        icon: 'pi pi-fw pi-sync',
                        to: '/categories/commercial/exchange'
                    },
                    {
                        label: 'Подобово',
                        icon: 'pi pi-fw pi-clock',
                        to: '/categories/commercial/daily'
                    }
                ]
            },
            {
                label: 'Земельні ділянки',
                icon: 'pi pi-fw pi-map',
                items: [
                    {
                        label: 'Продаж',
                        icon: 'pi pi-fw pi-tag',
                        to: '/categories/land/sell'
                    },
                    {
                        label: 'Оренда',
                        icon: 'pi pi-fw pi-calendar',
                        to: '/categories/land/rent'
                    },
                    {
                        label: 'Обмін',
                        icon: 'pi pi-fw pi-sync',
                        to: '/categories/land/exchange'
                    },
                    {
                        label: 'Подобово',
                        icon: 'pi pi-fw pi-clock',
                        to: '/categories/land/daily'
                    }
                ]
            },
            {
                label: 'Інше',
                icon: 'pi pi-fw pi-ellipsis-h',
                items: [
                    {
                        label: 'Продаж',
                        icon: 'pi pi-fw pi-tag',
                        to: '/categories/other/sell'
                    },
                    {
                        label: 'Оренда',
                        icon: 'pi pi-fw pi-calendar',
                        to: '/categories/other/rent'
                    },
                    {
                        label: 'Обмін',
                        icon: 'pi pi-fw pi-sync',
                        to: '/categories/other/exchange'
                    },
                    {
                        label: 'Подобово',
                        icon: 'pi pi-fw pi-clock',
                        to: '/categories/other/daily'
                    }
                ]
            },
        ]
    },
    {
        label: 'Профіль',
        icon: 'pi pi-fw pi-user',
        roles: ['admin', 'customer'],
        items: [
            {
                label: 'Додати нерухомість',
                icon: 'pi pi-fw pi-plus',
                roles: ['admin', 'customer'],
                items: [
                    {
                        label: 'Квартиру',
                        icon: 'pi pi-fw pi-plus',
                        to: '/pages/apartments/add'
                    },
                    {
                        label: 'Кімнату',
                        icon: 'pi pi-fw pi-plus',
                        to: '/pages/rooms/add'
                    },
                    {
                        label: 'Будинок',
                        icon: 'pi pi-fw pi-plus',
                        to: '/pages/houses/add'
                    },
                    {
                        label: 'Приміщення',
                        icon: 'pi pi-fw pi-plus',
                        to: '/pages/offices/add'
                    },
                    {
                        label: 'Гаражи',
                        icon: 'pi pi-fw pi-plus',
                        to: '/pages/garages/add'
                    },
                    {
                        label: 'Будівлі',
                        icon: 'pi pi-fw pi-plus',
                        to: '/pages/commercial/add'
                    },
                    {
                        label: 'Земельні ділянки',
                        icon: 'pi pi-fw pi-plus',
                        to: '/pages/land/add'
                    },
                    {
                        label: 'Інше',
                        icon: 'pi pi-fw pi-plus',
                        to: '/pages/other/add'
                    },
                ]
            },
            {
                label: 'Налаштування',
                icon: 'pi pi-fw pi-cog',
                items: [
                    {
                        label: 'Мій профіль',
                        icon: 'pi pi-fw pi-user-edit',
                        to: '/users/user/profile'
                    },
                ]
            },
            {
                label: 'Мої Клієнти',
                icon: 'pi pi-fw pi-users',
                items: [
                    {
                        label: 'Таблиця клієнтів',
                        icon: 'pi pi-fw pi-table',
                        to: '/users/user/clients'
                    },
                    {
                        label: 'Виборка для клієнтів',
                        icon: 'pi pi-fw pi-filter',
                        to: '/users/user/propertyLists'
                    },
                ]
            },
            {
                label: 'Моя Нерухомість',
                icon: 'pi pi-fw pi-building',
                items: [
                    {
                        label: 'Квартири',
                        icon: 'pi pi-fw pi-building',
                        items: [
                            {
                                label: 'Продаж',
                                icon: 'pi pi-fw pi-tag',
                                to: {
                                    path: `/categories/apartments/sell`,
                                    query: { user: userId.value } }
                            },
                            {
                                label: 'Оренда',
                                icon: 'pi pi-fw pi-calendar',
                                to: '/categories/apartments/rent'
                            },
                            {
                                label: 'Обмін',
                                icon: 'pi pi-fw pi-sync',
                                to: '/categories/apartments/exchange'
                            },
                            {
                                label: 'Подобово',
                                icon: 'pi pi-fw pi-clock',
                                to: '/categories/apartments/daily'
                            },
                            {
                                label: 'Інше',
                                icon: 'pi pi-fw pi-ellipsis-h',
                                to: '/categories/apartments/other',
                            }
                        ]
                    },
                    {
                        label: 'Кімнати',
                        icon: 'pi pi-fw pi-building',
                        items: [
                            {
                                label: 'Продаж',
                                icon: 'pi pi-fw pi-tag',
                                to: '/categories/rooms/sell'
                            },
                            {
                                label: 'Оренда',
                                icon: 'pi pi-fw pi-calendar',
                                to: '/categories/rooms/rent'
                            },
                            {
                                label: 'Обмін',
                                icon: 'pi pi-fw pi-sync',
                                to: '/categories/rooms/exchange'
                            },
                            {
                                label: 'Подобово',
                                icon: 'pi pi-fw pi-clock',
                                to: '/categories/rooms/daily'
                            },
                            {
                                label: 'Інше',
                                icon: 'pi pi-fw pi-ellipsis-h',
                                to: '/categories/rooms/other',
                            }
                        ]
                    },
                    {
                        label: 'Будинки',
                        icon: 'pi pi-fw pi-home',
                        items: [
                            {
                                label: 'Продаж',
                                icon: 'pi pi-fw pi-tag',
                                to: '/categories/houses/sell'
                            },
                            {
                                label: 'Оренда',
                                icon: 'pi pi-fw pi-calendar',
                                to: '/categories/houses/rent'
                            },
                            {
                                label: 'Обмін',
                                icon: 'pi pi-fw pi-sync',
                                to: '/categories/houses/exchange'
                            },
                            {
                                label: 'Подобово',
                                icon: 'pi pi-fw pi-clock',
                                to: '/categories/houses/daily'
                            }
                        ]
                    },
                    {
                        label: 'Приміщення',
                        icon: 'pi pi-fw pi-building',
                        items: [
                            {
                                label: 'Продаж',
                                icon: 'pi pi-fw pi-tag',
                                to: '/categories/offices/sell'
                            },
                            {
                                label: 'Оренда',
                                icon: 'pi pi-fw pi-calendar',
                                to: '/categories/offices/rent'
                            },
                            {
                                label: 'Обмін',
                                icon: 'pi pi-fw pi-sync',
                                to: '/categories/offices/exchange'
                            },
                            {
                                label: 'Подобово',
                                icon: 'pi pi-fw pi-clock',
                                to: '/categories/offices/daily'
                            }
                        ]
                    },
                    {
                        label: 'Гаражи',
                        icon: 'pi pi-fw pi-building',
                        items: [
                            {
                                label: 'Продаж',
                                icon: 'pi pi-fw pi-tag',
                                to: '/categories/garages/sell'
                            },
                            {
                                label: 'Оренда',
                                icon: 'pi pi-fw pi-calendar',
                                to: '/categories/garages/rent'
                            },
                            {
                                label: 'Обмін',
                                icon: 'pi pi-fw pi-sync',
                                to: '/categories/garages/exchange'
                            },
                            {
                                label: 'Подобово',
                                icon: 'pi pi-fw pi-clock',
                                to: '/categories/garages/daily'
                            }
                        ]
                    },
                    {
                        label: 'Будівлі',
                        icon: 'pi pi-fw pi-building',
                        items: [
                            {
                                label: 'Продаж',
                                icon: 'pi pi-fw pi-tag',
                                to: '/categories/commercial/sell'
                            },
                            {
                                label: 'Оренда',
                                icon: 'pi pi-fw pi-calendar',
                                to: '/categories/commercial/rent'
                            },
                            {
                                label: 'Обмін',
                                icon: 'pi pi-fw pi-sync',
                                to: '/categories/commercial/exchange'
                            },
                            {
                                label: 'Подобово',
                                icon: 'pi pi-fw pi-clock',
                                to: '/categories/commercial/daily'
                            }
                        ]
                    },
                    {
                        label: 'Земельні ділянки',
                        icon: 'pi pi-fw pi-map',
                        items: [
                            {
                                label: 'Продаж',
                                icon: 'pi pi-fw pi-tag',
                                to: '/categories/land/sell'
                            },
                            {
                                label: 'Оренда',
                                icon: 'pi pi-fw pi-calendar',
                                to: '/categories/land/rent'
                            },
                            {
                                label: 'Обмін',
                                icon: 'pi pi-fw pi-sync',
                                to: '/categories/land/exchange'
                            },
                            {
                                label: 'Подобово',
                                icon: 'pi pi-fw pi-clock',
                                to: '/categories/land/daily'
                            }
                        ]
                    },
                    {
                        label: 'Інше',
                        icon: 'pi pi-fw pi-ellipsis-h',
                        items: [
                            {
                                label: 'Продаж',
                                icon: 'pi pi-fw pi-tag',
                                to: '/categories/other/sell'
                            },
                            {
                                label: 'Оренда',
                                icon: 'pi pi-fw pi-calendar',
                                to: '/categories/other/rent'
                            },
                            {
                                label: 'Обмін',
                                icon: 'pi pi-fw pi-sync',
                                to: '/categories/other/exchange'
                            },
                            {
                                label: 'Подобово',
                                icon: 'pi pi-fw pi-clock',
                                to: '/categories/other/daily'
                            }
                        ]
                    },
                ]
            },
            {
                label: 'OLX',
                icon: 'pi pi-fw pi-external-link',
                to: '/users/user/olx',
                roles: ['admin'],
            }
        ]
    },
    {
        label: 'Admin',
        icon: 'pi pi-fw pi-cog',
        roles: ['admin'],
        items: [
            {
                label: 'Користувачи',
                icon: 'pi pi-fw pi-users',
                items: [
                    {
                        label: 'Таблиця',
                        icon: 'pi pi-fw pi-table',
                        to: '/users/admin/customers'
                    },
                ]
            },
            {
                label: 'Карта',
                icon: 'pi pi-fw pi-map',
                to: '/users/admin/map'
            },
        ]
    },
    // {
    //     label: 'UI Components',
    //     roles: ['admin'],
    //     items: [
    //         { label: 'Form Layout', icon: 'pi pi-fw pi-id-card', to: '/uikit/formlayout' },
    //         { label: 'Input', icon: 'pi pi-fw pi-check-square', to: '/uikit/input' },
    //         { label: 'Button', icon: 'pi pi-fw pi-mobile', to: '/uikit/button', class: 'rotated-icon' },
    //         { label: 'Table', icon: 'pi pi-fw pi-table', to: '/uikit/table' },
    //         { label: 'List', icon: 'pi pi-fw pi-list', to: '/uikit/list' },
    //         { label: 'Tree', icon: 'pi pi-fw pi-share-alt', to: '/uikit/tree' },
    //         { label: 'Panel', icon: 'pi pi-fw pi-tablet', to: '/uikit/panel' },
    //         { label: 'Overlay', icon: 'pi pi-fw pi-clone', to: '/uikit/overlay' },
    //         { label: 'Media', icon: 'pi pi-fw pi-image', to: '/uikit/media' },
    //         { label: 'Menu', icon: 'pi pi-fw pi-bars', to: '/uikit/menu' },
    //         { label: 'Message', icon: 'pi pi-fw pi-comment', to: '/uikit/message' },
    //         { label: 'File', icon: 'pi pi-fw pi-file', to: '/uikit/file' },
    //         { label: 'Chart', icon: 'pi pi-fw pi-chart-bar', to: '/uikit/charts' },
    //         { label: 'Timeline', icon: 'pi pi-fw pi-calendar', to: '/uikit/timeline' },
    //         { label: 'Misc', icon: 'pi pi-fw pi-circle', to: '/uikit/misc' }
    //     ]
    // },
    // {
    //     label: 'Pages',
    //     icon: 'pi pi-fw pi-file',
    //     roles: ['admin'],
    //     to: '/pages',
    //     items: [
    //         {
    //             label: 'Landing',
    //             icon: 'pi pi-fw pi-globe',
    //             to: '/landing'
    //         },
    //         {
    //             label: 'Auth',
    //             icon: 'pi pi-fw pi-user',
    //             items: [
    //                 {
    //                     label: 'Login',
    //                     icon: 'pi pi-fw pi-sign-in',
    //                     to: '/auth/login'
    //                 },
    //                 {
    //                     label: 'Error',
    //                     icon: 'pi pi-fw pi-times-circle',
    //                     to: '/auth/error'
    //                 },
    //                 {
    //                     label: 'Access Denied',
    //                     icon: 'pi pi-fw pi-lock',
    //                     to: '/auth/access'
    //                 }
    //             ]
    //         },
    //         {
    //             label: 'Crud',
    //             icon: 'pi pi-fw pi-pencil',
    //             to: '/pages/crud'
    //         },
    //         {
    //             label: 'Not Found',
    //             icon: 'pi pi-fw pi-exclamation-circle',
    //             to: '/pages/notfound'
    //         },
    //         {
    //             label: 'Empty',
    //             icon: 'pi pi-fw pi-circle-off',
    //             to: '/pages/empty'
    //         }
    //     ]
    // },
    // {
    //     label: 'Hierarchy',
    //     roles: ['admin'],
    //     items: [
    //         {
    //             label: 'Submenu 1',
    //             icon: 'pi pi-fw pi-bookmark',
    //             items: [
    //                 {
    //                     label: 'Submenu 1.1',
    //                     icon: 'pi pi-fw pi-bookmark',
    //                     items: [
    //                         { label: 'Submenu 1.1.1', icon: 'pi pi-fw pi-bookmark' },
    //                         { label: 'Submenu 1.1.2', icon: 'pi pi-fw pi-bookmark' },
    //                         { label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-bookmark' }
    //                     ]
    //                 },
    //                 {
    //                     label: 'Submenu 1.2',
    //                     icon: 'pi pi-fw pi-bookmark',
    //                     items: [{ label: 'Submenu 1.2.1', icon: 'pi pi-fw pi-bookmark' }]
    //                 }
    //             ]
    //         },
    //         {
    //             label: 'Submenu 2',
    //             icon: 'pi pi-fw pi-bookmark',
    //             items: [
    //                 {
    //                     label: 'Submenu 2.1',
    //                     icon: 'pi pi-fw pi-bookmark',
    //                     items: [
    //                         { label: 'Submenu 2.1.1', icon: 'pi pi-fw pi-bookmark' },
    //                         { label: 'Submenu 2.1.2', icon: 'pi pi-fw pi-bookmark' }
    //                     ]
    //                 },
    //                 {
    //                     label: 'Submenu 2.2',
    //                     icon: 'pi pi-fw pi-bookmark',
    //                     items: [{ label: 'Submenu 2.2.1', icon: 'pi pi-fw pi-bookmark' }]
    //                 }
    //             ]
    //         }
    //     ]
    // },
    // {
    //     label: 'Get Started',
    //     roles: ['admin'],
    //     items: [
    //         {
    //             label: 'Documentation',
    //             icon: 'pi pi-fw pi-book',
    //             to: '/documentation'
    //         },
    //         {
    //             label: 'View Source',
    //             icon: 'pi pi-fw pi-github',
    //             url: 'https://github.com/primefaces/sakai-vue',
    //             target: '_blank'
    //         }
    //     ]
    // }
]);

onMounted(() => {
    userStore.fetchUser()
});
</script>

<template>
    <div v-if="user" class="flex text-green-500 my-4">
        <div class="flex flex-col justify-center items-center space-x-6 mb-2">
            <div class="relative">
                <img
                    v-if="user.avatar"
                    :src="user.avatar"
                    alt="Аватар"
                    class="w-24 h-24 rounded-full object-cover border-4 border-blue-100"
                />
            </div>
            <div>
                <p class="text-lg font-semibold">{{ user.displayName }}</p>
            </div>
        </div>
    </div>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item
                v-if="!item.separator"
                :item="item"
                :index="i"
                :user="user"
            ></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
