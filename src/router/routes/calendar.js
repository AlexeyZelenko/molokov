export default [
    {
        path: '/',
        component: () => import('@/layout/AppLayout.vue'),
        children: [
            {
                path: '/calendar',
                name: 'calendar',
                component: () => import('@/views/calendar/CalendarDashboard.vue'),
                meta: {
                    requiresAuth: true,
                    breadcrumb: [
                        { name: 'Головна', route: '/', icon: 'pi pi-home' },
                        { name: 'Календар', route: '/calendar' }
                    ]
                }
            }
        ]
    }
]; 