export default [
    {
        path: '/',
        component: () => import('@/layout/AppLayout.vue'),
        children: [
            {
                path: '/pages/:category/edit/:subcategory/:id',
                name: 'editItem',
                component: ( ) => import('@/views/pages/categories/EditItemView.vue'),
                meta: {
                    requiresAuth: true,
                    breadcrumb: [{ name: 'Головна', route: '/', icon: 'pi pi-home' }, { name: "Редагування об'єкта нерухомості" }]
                }
            },
            {
                path: '/pages/:category/view/:subcategory/:id',
                name: `itemDetails`,
                component: () => import('@/views/pages/categories/ItemDetailsView.vue'),
                meta: {
                    breadcrumb: [
                        {
                            name: 'Головна',
                            route: '/',
                            icon: 'pi pi-home'
                        },
                        {
                            name: "Деталі об'єкта нерухомості"
                        }
                    ]
                }
            },
            {
                path: '/pages/:category/add',
                name: 'addPropertyItem',
                component: () => import('@/views/pages/categories/AddItemProperty.vue'),
                meta: {
                    requiresAuth: true,
                    breadcrumb: [{ name: 'Головна', route: '/', icon: 'pi pi-home' }, { name: "Додати об'єкт нерухомості" }]
                }
            }
        ]
    },
    {
        path: '/',
        component: () => import('@/layout/AppCategoryLayout.vue'),
        children: [
            {
                path: '/categories/:category/:subcategory',
                name: 'listProperties',
                component: () => import('@/views/pages/categories/ListProperties.vue'),
                params: true,
                query: true,
                meta: {
                    breadcrumb: [{ name: 'Головна', route: '/', icon: 'pi pi-home' }, { name: "Список об'єктів нерухомості" }]
                }
            }
        ]
    }
];
