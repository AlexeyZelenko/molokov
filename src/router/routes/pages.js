export default [
    {
        path: '/',
        component: () => import('@/layout/AppLayoutAgencies.vue'),
        children: [
            {
                path: '/faq',
                name: 'faq',
                component: () => import('@/views/pages/FAQPage.vue'),
                meta: {
                    requiresAuth: true,
                    breadcrumb: [
                        { name: 'Головна', route: '/', icon: 'pi pi-home' },
                        { name: 'FAQ', route: '/pages/faq' }
                    ]
                }
            }
        ]
    }
];
