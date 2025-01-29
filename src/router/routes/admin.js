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
]
