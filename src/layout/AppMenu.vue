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
            {
                label: 'Додати нерухомість',
                icon: 'pi pi-fw pi-plus',
                to: '/add-properties',
                roles: ['admin', 'agent', 'seller', 'agency_owner', 'developer', 'super_admin', 'moderator']
            }
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
                        to: '/categories/apartments/other'
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
                        to: '/categories/rooms/other'
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
            }
        ]
    },
    {
        label: 'Профіль',
        icon: 'pi pi-fw pi-user',
        roles: ['admin', 'agent', 'seller', 'agency_owner', 'developer', 'super_admin', 'moderator'],
        items: [
            {
                label: 'Додати нерухомість',
                icon: 'pi pi-fw pi-plus',
                roles: ['admin', 'agent', 'seller', 'agency_owner', 'developer', 'super_admin', 'moderator'],
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
                    }
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
                    }
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
                    }
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
                                    query: { user: userId.value }
                                }
                            },
                            {
                                label: 'Оренда',
                                icon: 'pi pi-fw pi-calendar',
                                to: {
                                    path: '/categories/apartments/rent',
                                    query: { user: userId.value }
                                }
                            },
                            {
                                label: 'Обмін',
                                icon: 'pi pi-fw pi-sync',
                                to: {
                                    path: '/categories/apartments/exchange',
                                    query: { user: userId.value }
                                }
                            },
                            {
                                label: 'Подобово',
                                icon: 'pi pi-fw pi-clock',
                                to: {
                                    path: '/categories/apartments/daily',
                                    query: { user: userId.value }
                                }
                            },
                            {
                                label: 'Інше',
                                icon: 'pi pi-fw pi-ellipsis-h',
                                to: {
                                    path: '/categories/apartments/other',
                                    query: { user: userId.value }
                                }
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
                                to: {
                                    path: '/categories/rooms/sell',
                                    query: { user: userId.value }
                                }
                            },
                            {
                                label: 'Оренда',
                                icon: 'pi pi-fw pi-calendar',
                                to: {
                                    path: '/categories/rooms/rent',
                                    query: { user: userId.value }
                                }
                            },
                            {
                                label: 'Обмін',
                                icon: 'pi pi-fw pi-sync',
                                to: {
                                    path: '/categories/rooms/exchange',
                                    query: { user: userId.value }
                                }
                            },
                            {
                                label: 'Подобово',
                                icon: 'pi pi-fw pi-clock',
                                to: {
                                    path: '/categories/rooms/daily',
                                    query: { user: userId.value }
                                }
                            },
                            {
                                label: 'Інше',
                                icon: 'pi pi-fw pi-ellipsis-h',
                                to: {
                                    path: '/categories/rooms/other',
                                    query: { user: userId.value }
                                }
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
                                to: {
                                    path: '/categories/houses/sell',
                                    query: { user: userId.value }
                                }
                            },
                            {
                                label: 'Оренда',
                                icon: 'pi pi-fw pi-calendar',
                                to: {
                                    path: '/categories/houses/rent',
                                    query: { user: userId.value }
                                }
                            },
                            {
                                label: 'Обмін',
                                icon: 'pi pi-fw pi-sync',
                                to: {
                                    path: '/categories/houses/exchange',
                                    query: { user: userId.value }
                                }
                            },
                            {
                                label: 'Подобово',
                                icon: 'pi pi-fw pi-clock',
                                to: {
                                    path: '/categories/houses/daily',
                                    query: { user: userId.value }
                                }
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
                                to: {
                                    path: '/categories/offices/sell',
                                    query: { user: userId.value }
                                }
                            },
                            {
                                label: 'Оренда',
                                icon: 'pi pi-fw pi-calendar',
                                to: {
                                    path: '/categories/offices/rent',
                                    query: { user: userId.value }
                                }
                            },
                            {
                                label: 'Обмін',
                                icon: 'pi pi-fw pi-sync',
                                to: {
                                    path: '/categories/offices/exchange',
                                    query: { user: userId.value }
                                }
                            },
                            {
                                label: 'Подобово',
                                icon: 'pi pi-fw pi-clock',
                                to: {
                                    path: '/categories/offices/daily',
                                    query: { user: userId.value }
                                }
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
                                to: {
                                    path: '/categories/garages/sell',
                                    query: { user: userId.value }
                                }
                            },
                            {
                                label: 'Оренда',
                                icon: 'pi pi-fw pi-calendar',
                                to: {
                                    path: '/categories/garages/rent',
                                    query: { user: userId.value }
                                }
                            },
                            {
                                label: 'Обмін',
                                icon: 'pi pi-fw pi-sync',
                                to: {
                                    path: '/categories/garages/exchange',
                                    query: { user: userId.value }
                                }
                            },
                            {
                                label: 'Подобово',
                                icon: 'pi pi-fw pi-clock',
                                to: {
                                    path: '/categories/garages/daily',
                                    query: { user: userId.value }
                                }
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
                                to: {
                                    path: '/categories/commercial/sell',
                                    query: { user: userId.value }
                                }
                            },
                            {
                                label: 'Оренда',
                                icon: 'pi pi-fw pi-calendar',
                                to: {
                                    path: '/categories/commercial/rent',
                                    query: { user: userId.value }
                                }
                            },
                            {
                                label: 'Обмін',
                                icon: 'pi pi-fw pi-sync',
                                to: {
                                    path: '/categories/commercial/exchange',
                                    query: { user: userId.value }
                                }
                            },
                            {
                                label: 'Подобово',
                                icon: 'pi pi-fw pi-clock',
                                to: {
                                    path: '/categories/commercial/daily',
                                    query: { user: userId.value }
                                }
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
                                to: {
                                    path: '/categories/land/sell',
                                    query: { user: userId.value }
                                }
                            },
                            {
                                label: 'Оренда',
                                icon: 'pi pi-fw pi-calendar',
                                to: {
                                    path: '/categories/land/rent',
                                    query: { user: userId.value }
                                }
                            },
                            {
                                label: 'Обмін',
                                icon: 'pi pi-fw pi-sync',
                                to: {
                                    path: '/categories/land/exchange',
                                    query: { user: userId.value }
                                }
                            },
                            {
                                label: 'Подобово',
                                icon: 'pi pi-fw pi-clock',
                                to: {
                                    path: '/categories/land/daily',
                                    query: { user: userId.value }
                                }
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
                                to: {
                                    path: '/categories/other/sell',
                                    query: { user: userId.value }
                                }
                            },
                            {
                                label: 'Оренда',
                                icon: 'pi pi-fw pi-calendar',
                                to: {
                                    path: '/categories/other/rent',
                                    query: { user: userId.value }
                                }
                            },
                            {
                                label: 'Обмін',
                                icon: 'pi pi-fw pi-sync',
                                to: {
                                    path: '/categories/other/exchange',
                                    query: { user: userId.value }
                                }
                            },
                            {
                                label: 'Подобово',
                                icon: 'pi pi-fw pi-clock',
                                to: {
                                    path: '/categories/other/daily',
                                    query: { user: userId.value }
                                }
                            }
                        ]
                    }
                ]
            }
            // {
            //     label: 'OLX',
            //     icon: 'pi pi-fw pi-external-link',
            //     to: '/users/user/olx',
            //     roles: ['admin']
            // }
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
                    }
                ]
            },
            {
                label: 'Карта',
                icon: 'pi pi-fw pi-map',
                to: '/users/admin/map'
            }
        ]
    }
]);

onMounted(() => {
    userStore.fetchUser();
});
</script>

<template>
    <div v-if="user" class="flex text-green-500 my-4">
        <div class="flex flex-col justify-center items-center space-x-6 mb-2">
            <div class="relative">
                <img v-if="user.avatar" :src="user.avatar" alt="Аватар" class="w-24 h-24 rounded-full object-cover border-4 border-blue-100" />
            </div>
            <div>
                <p class="text-lg font-semibold">{{ user.displayName }}</p>
            </div>
        </div>
    </div>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i" :user="user"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
