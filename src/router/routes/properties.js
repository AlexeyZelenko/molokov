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
                path: '/cherkasy-areas',
                name: 'cherkasy-areas',
                component: () => import('@/views/CherkasyAreas.vue')
            },
        ]
    },
    {
        path: '/landing',
        name: 'landing',
        component: () => import('@/views/pages/Landing.vue')
    },
];
