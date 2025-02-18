export default [
    {
        path: '/users/admin/customers',
        name: 'customers',
        component: () => import('@/views/admin/Customers.vue'),
        meta: {
            requiresAdmin: true,
            breadcrumb: [
                { name: 'Головна', route: '/', icon: 'pi pi-home' },
                { name: 'Користувачи', route: '/pages/users/admin/customers' }
            ]
        }
    },
    {
        path: '/users/admin/map',
        name: 'map',
        component: () => import('@/views/admin/Map.vue'),
        meta: {
            requiresAdmin: true,
            breadcrumb: [
                { name: 'Головна', route: '/', icon: 'pi pi-home' },
                { name: 'Карта', route: '/pages/users/admin/map' }
            ]
        }
    },
]
