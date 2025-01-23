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
                                component: () => import('@/views/pages/houses/lists/sell.vue')
                            },
                            {
                                path: 'rent',
                                name: 'housesRent',
                                component: () => import('@/views/pages/houses/lists/rent.vue')
                            },
                            {
                                path: 'exchange',
                                name: 'housesExchange',
                                component: () => import('@/views/pages/houses/lists/exchange.vue')
                            },
                            {
                                path: 'daily',
                                name: 'housesDaily',
                                component: () => import('@/views/pages/houses/lists/daily.vue')
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
                                component: () => import('@/views/pages/apartments/lists/sell.vue')
                            },
                            {
                                path: 'rent',
                                name: 'apartmentsRent',
                                component: () => import('@/views/pages/apartments/lists/rent.vue')
                            },
                            {
                                path: 'daily',
                                name: 'apartmentsDaily',
                                component: () => import('@/views/pages/apartments/lists/daily.vue')
                            },
                            {
                                path: 'exchange',
                                name: 'apartmentsExchange',
                                component: () => import('@/views/pages/apartments/lists/exchange.vue')
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
                                component: () => import('@/views/pages/offices/lists/sell.vue')
                            },
                            {
                                path: 'rent',
                                name: 'officesRent',
                                component: () => import('@/views/pages/offices/lists/rent.vue')
                            },
                            {
                                path: 'daily',
                                name: 'officesDaily',
                                component: () => import('@/views/pages/offices/lists/daily.vue')
                            },
                            {
                                path: 'exchange',
                                name: 'officesExchange',
                                component: () => import('@/views/pages/offices/lists/exchange.vue')
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
                                component: () => import('@/views/pages/commercial/lists/sell.vue')
                            },
                            {
                                path: 'rent',
                                name: 'commercialRent',
                                component: () => import('@/views/pages/commercial/lists/rent.vue')
                            },
                            {
                                path: 'daily',
                                name: 'commercialDaily',
                                component: () => import('@/views/pages/commercial/lists/daily.vue')
                            },
                            {
                                path: 'exchange',
                                name: 'commercialExchange',
                                component: () => import('@/views/pages/commercial/lists/exchange.vue')
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
                                component: () => import('@/views/pages/land/lists/sell.vue')
                            },
                            {
                                path: 'rent',
                                name: 'landRent',
                                component: () => import('@/views/pages/land/lists/rent.vue')
                            },
                            {
                                path: 'daily',
                                name: 'landDaily',
                                component: () => import('@/views/pages/land/lists/daily.vue')
                            },
                            {
                                path: 'exchange',
                                name: 'landExchange',
                                component: () => import('@/views/pages/land/lists/exchange.vue')
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
                                component: () => import('@/views/pages/other/lists/sell.vue')
                            },
                            {
                                path: 'rent',
                                name: 'otherRent',
                                component: () => import('@/views/pages/other/lists/rent.vue')
                            },
                            {
                                path: 'daily',
                                name: 'otherDaily',
                                component: () => import('@/views/pages/other/lists/daily.vue')
                            },
                            {
                                path: 'exchange',
                                name: 'otherExchange',
                                component: () => import('@/views/pages/other/lists/exchange.vue')
                            }
                        ]
                    }
                ]
            }
        ]
    }
];
