export default [
    {
        path: '/',
        component: () => import('@/layout/AppCategoryLayout.vue'),
        children: [
            {
                path: '/properties',
                name: 'properties',
                component: () => import('@/views/pages/categories/index.vue')
            },
            {
                path: '/add-properties',
                name: 'pageAddProperties',
                component: () => import('@/views/pages/AddProperties.vue'),
                meta: {
                    requiresAuth: true,
                    title: 'Додати нерухомість'
                }
            },
            {
                path: '/:category/:subcategory/:id',
                name: 'pageFindProperty',
                component: () => import('@/views/pages/FindPropertiesFromId.vue')
            }
        ]
    },
    {
        path: '/landing',
        name: 'landing',
        component: () => import('@/views/pages/Landing.vue')
    }
];
