import AppCategoryLayout from "@/layout/AppCategoryLayout.vue";

export default [
    {
        path: '/',
        component: AppCategoryLayout,
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
        ]
    },
    {
        path: '/landing',
        name: 'landing',
        component: () => import('@/views/pages/Landing.vue')
    }
];
