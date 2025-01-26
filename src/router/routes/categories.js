import AppCategoryLayout from "@/layout/AppCategoryLayout.vue";

export default [
    {
        path: '/',
        component: AppCategoryLayout,
        children: [
            {
                path: 'categories',
                name: 'categories',
                children: [
                    {
                        path: 'houses',
                        name: 'houses',
                        children: [
                            {
                                path: 'sell',
                                name: 'housesSell',
                                component: () => import('@/views/pages/houses/lists/sell.vue'),
                                meta: {
                                    breadcrumb: [
                                        { name: 'Головна', route: '/', icon: 'pi pi-home' },
                                        { name: 'Категорії', route: '/categories' },
                                        { name: 'Будинки', route: '/categories/houses' },
                                        { name: 'Продаж', route: '/categories/houses/sell' }
                                    ]
                                }
                            },
                            {
                                path: 'rent',
                                name: 'housesRent',
                                component: () => import('@/views/pages/houses/lists/rent.vue'),
                                meta: {
                                    breadcrumb: [
                                        { name: 'Головна', route: '/', icon: 'pi pi-home' },
                                        { name: 'Категорії', route: '/categories' },
                                        { name: 'Будинки', route: '/categories/houses' },
                                        { name: 'Оренда', route: '/categories/houses/rent' }
                                    ]
                                }
                            },
                            {
                                path: 'exchange',
                                name: 'housesExchange',
                                component: () => import('@/views/pages/houses/lists/exchange.vue'),
                                meta: {
                                    breadcrumb: [
                                        { name: 'Головна', route: '/', icon: 'pi pi-home' },
                                        { name: 'Категорії', route: '/categories' },
                                        { name: 'Будинки', route: '/categories/houses' },
                                        { name: 'Обмін', route: '/categories/houses/exchange' }
                                    ]
                                }
                            },
                            {
                                path: 'daily',
                                name: 'housesDaily',
                                component: () => import('@/views/pages/houses/lists/daily.vue'),
                                meta: {
                                    breadcrumb: [
                                        { name: 'Головна', route: '/', icon: 'pi pi-home' },
                                        { name: 'Категорії', route: '/categories' },
                                        { name: 'Будинки', route: '/categories/houses' },
                                        { name: 'Подобова оренда', route: '/categories/houses/daily' }
                                    ]
                                }
                            }
                        ]
                    },
                    {
                        path: 'apartments',
                        name: 'apartments',
                        children: [
                            {
                                path: 'sell',
                                name: 'apartmentsSell',
                                component: () => import('@/views/pages/apartments/lists/sell.vue'),
                                meta: {
                                    breadcrumb: [
                                        { name: 'Головна', route: '/', icon: 'pi pi-home' },
                                        { name: 'Категорії', route: '/categories' },
                                        { name: 'Квартири', route: '/categories/apartments' },
                                        { name: 'Продаж', route: '/categories/apartments/sell' }
                                    ]
                                }
                            },
                            {
                                path: 'rent',
                                name: 'apartmentsRent',
                                component: () => import('@/views/pages/apartments/lists/rent.vue'),
                                meta: {
                                    breadcrumb: [
                                        { name: 'Головна', route: '/', icon: 'pi pi-home' },
                                        { name: 'Категорії', route: '/categories' },
                                        { name: 'Квартири', route: '/categories/apartments' },
                                        { name: 'Оренда', route: '/categories/apartments/rent' }
                                    ]
                                }
                            },
                            {
                                path: 'daily',
                                name: 'apartmentsDaily',
                                component: () => import('@/views/pages/apartments/lists/daily.vue'),
                                meta: {
                                    breadcrumb: [
                                        { name: 'Головна', route: '/', icon: 'pi pi-home' },
                                        { name: 'Категорії', route: '/categories' },
                                        { name: 'Квартири', route: '/categories/apartments' },
                                        { name: 'Подобова оренда', route: '/categories/apartments/daily' }
                                    ]
                                }
                            },
                            {
                                path: 'exchange',
                                name: 'apartmentsExchange',
                                component: () => import('@/views/pages/apartments/lists/exchange.vue'),
                                meta: {
                                    breadcrumb: [
                                        { name: 'Головна', route: '/', icon: 'pi pi-home' },
                                        { name: 'Категорії', route: '/categories' },
                                        { name: 'Квартири', route: '/categories/apartments' },
                                        { name: 'Обмін', route: '/categories/apartments/exchange' }
                                    ]
                                }
                            }
                        ]
                    },
                    {
                        path: 'offices',
                        name: 'offices',
                        children: [
                            {
                                path: 'sell',
                                name: 'officesSell',
                                component: () => import('@/views/pages/offices/lists/sell.vue'),
                                meta: {
                                    breadcrumb: [
                                        { name: 'Головна', route: '/', icon: 'pi pi-home' },
                                        { name: 'Категорії', route: '/categories' },
                                        { name: 'Офіси', route: '/categories/offices' },
                                        { name: 'Продаж', route: '/categories/offices/sell' }
                                    ]
                                }
                            },
                            {
                                path: 'rent',
                                name: 'officesRent',
                                component: () => import('@/views/pages/offices/lists/rent.vue'),
                                meta: {
                                    breadcrumb: [
                                        { name: 'Головна', route: '/', icon: 'pi pi-home' },
                                        { name: 'Категорії', route: '/categories' },
                                        { name: 'Офіси', route: '/categories/offices' },
                                        { name: 'Оренда', route: '/categories/offices/rent' }
                                    ]
                                }
                            },
                            {
                                path: 'daily',
                                name: 'officesDaily',
                                component: () => import('@/views/pages/offices/lists/daily.vue'),
                                meta: {
                                    breadcrumb: [
                                        { name: 'Головна', route: '/', icon: 'pi pi-home' },
                                        { name: 'Категорії', route: '/categories' },
                                        { name: 'Офіси', route: '/categories/offices' },
                                        { name: 'Подобова оренда', route: '/categories/offices/daily' }
                                    ]
                                }
                            },
                            {
                                path: 'exchange',
                                name: 'officesExchange',
                                component: () => import('@/views/pages/offices/lists/exchange.vue'),
                                meta: {
                                    breadcrumb: [
                                        { name: 'Головна', route: '/', icon: 'pi pi-home' },
                                        { name: 'Категорії', route: '/categories' },
                                        { name: 'Офіси', route: '/categories/offices' },
                                        { name: 'Обмін', route: '/categories/offices/exchange' }
                                    ]
                                }
                            }
                        ]
                    },
                    {
                        path: 'commercial',
                        name: 'commercial',
                        children: [
                            {
                                path: 'sell',
                                name: 'commercialSell',
                                component: () => import('@/views/pages/commercial/lists/sell.vue'),
                                meta: {
                                    breadcrumb: [
                                        { name: 'Головна', route: '/', icon: 'pi pi-home' },
                                        { name: 'Категорії', route: '/categories' },
                                        { name: 'Комерційна нерухомість', route: '/categories/commercial' },
                                        { name: 'Продаж', route: '/categories/commercial/sell' }
                                    ]
                                }
                            },
                            {
                                path: 'rent',
                                name: 'commercialRent',
                                component: () => import('@/views/pages/commercial/lists/rent.vue'),
                                meta: {
                                    breadcrumb: [
                                        { name: 'Головна', route: '/', icon: 'pi pi-home' },
                                        { name: 'Категорії', route: '/categories' },
                                        { name: 'Комерційна нерухомість', route: '/categories/commercial' },
                                        { name: 'Оренда', route: '/categories/commercial/rent' }
                                    ]
                                }
                            },
                            {
                                path: 'daily',
                                name: 'commercialDaily',
                                component: () => import('@/views/pages/commercial/lists/daily.vue'),
                                meta: {
                                    breadcrumb: [
                                        { name: 'Головна', route: '/', icon: 'pi pi-home' },
                                        { name: 'Категорії', route: '/categories' },
                                        { name: 'Комерційна нерухомість', route: '/categories/commercial' },
                                        { name: 'Подобова оренда', route: '/categories/commercial/daily' }
                                    ]
                                }
                            },
                            {
                                path: 'exchange',
                                name: 'commercialExchange',
                                component: () => import('@/views/pages/commercial/lists/exchange.vue'),
                                meta: {
                                    breadcrumb: [
                                        { name: 'Головна', route: '/', icon: 'pi pi-home' },
                                        { name: 'Категорії', route: '/categories' },
                                        { name: 'Комерційна нерухомість', route: '/categories/commercial' },
                                        { name: 'Обмін', route: '/categories/commercial/exchange' }
                                    ]
                                }
                            }
                        ]
                    },
                    {
                        path: 'land',
                        name: 'land',
                        children: [
                            {
                                path: 'sell',
                                name: 'landSell',
                                component: () => import('@/views/pages/land/lists/sell.vue'),
                                meta: {
                                    breadcrumb: [
                                        { name: 'Головна', route: '/', icon: 'pi pi-home' },
                                        { name: 'Категорії', route: '/categories' },
                                        { name: 'Земельні ділянки', route: '/categories/land' },
                                        { name: 'Продаж', route: '/categories/land/sell' }
                                    ]
                                }
                            },
                            {
                                path: 'rent',
                                name: 'landRent',
                                component: () => import('@/views/pages/land/lists/rent.vue'),
                                meta: {
                                    breadcrumb: [
                                        { name: 'Головна', route: '/', icon: 'pi pi-home' },
                                        { name: 'Категорії', route: '/categories' },
                                        { name: 'Земельні ділянки', route: '/categories/land' },
                                        { name: 'Оренда', route: '/categories/land/rent' }
                                    ]
                                }
                            },
                            {
                                path: 'daily',
                                name: 'landDaily',
                                component: () => import('@/views/pages/land/lists/daily.vue'),
                                meta: {
                                    breadcrumb: [
                                        { name: 'Головна', route: '/', icon: 'pi pi-home' },
                                        { name: 'Категорії', route: '/categories' },
                                        { name: 'Земельні ділянки', route: '/categories/land' },
                                        { name: 'Подобова оренда', route: '/categories/land/daily' }
                                    ]
                                }
                            },
                            {
                                path: 'exchange',
                                name: 'landExchange',
                                component: () => import('@/views/pages/land/lists/exchange.vue'),
                                meta: {
                                    breadcrumb: [
                                        { name: 'Головна', route: '/', icon: 'pi pi-home' },
                                        { name: 'Категорії', route: '/categories' },
                                        { name: 'Земельні ділянки', route: '/categories/land' },
                                        { name: 'Обмін', route: '/categories/land/exchange' }
                                    ]
                                }
                            }
                        ]
                    },
                    {
                        path: 'other',
                        name: 'other',
                        children: [
                            {
                                path: 'sell',
                                name: 'otherSell',
                                component: () => import('@/views/pages/other/lists/sell.vue'),
                                meta: {
                                    breadcrumb: [
                                        { name: 'Головна', route: '/', icon: 'pi pi-home' },
                                        { name: 'Категорії', route: '/categories' },
                                        { name: 'Інше', route: '/categories/other' },
                                        { name: 'Продаж', route: '/categories/other/sell' }
                                    ]
                                }
                            },
                            {
                                path: 'rent',
                                name: 'otherRent',
                                component: () => import('@/views/pages/other/lists/rent.vue'),
                                meta: {
                                    breadcrumb: [
                                        { name: 'Головна', route: '/', icon: 'pi pi-home' },
                                        { name: 'Категорії', route: '/categories' },
                                        { name: 'Інше', route: '/categories/other' },
                                        { name: 'Оренда', route: '/categories/other/rent' }
                                    ]
                                }
                            },
                            {
                                path: 'daily',
                                name: 'otherDaily',
                                component: () => import('@/views/pages/other/lists/daily.vue'),
                                meta: {
                                    breadcrumb: [
                                        { name: 'Головна', route: '/', icon: 'pi pi-home' },
                                        { name: 'Категорії', route: '/categories' },
                                        { name: 'Інше', route: '/categories/other' },
                                        { name: 'Подобова оренда', route: '/categories/other/daily' }
                                    ]
                                }
                            },
                            {
                                path: 'exchange',
                                name: 'otherExchange',
                                component: () => import('@/views/pages/other/lists/exchange.vue'),
                                meta: {
                                    breadcrumb: [
                                        { name: 'Головна', route: '/', icon: 'pi pi-home' },
                                        { name: 'Категорії', route: '/categories' },
                                        { name: 'Інше', route: '/categories/other' },
                                        { name: 'Обмін', route: '/categories/other/exchange' }
                                    ]
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    }
];
