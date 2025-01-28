export default [
    {
        path: '/users/user/profile',
        name: 'userProfile',
        component: () => import('@/views/users/user/Profile.vue'),
        meta: {
            requiresAuth: true,
            breadcrumb: [
                { name: 'Головна', route: '/', icon: 'pi pi-home' },
                { name: 'Профіль', route: '/pages/users/user/profile' }
            ]
        }
    },
    {
        path: '/users/user/clients',
        name: 'userProfileClients',
        component: () => import('@/views/users/user/ListClients.vue'),
        meta: {
            requiresAuth: true,
            breadcrumb: [
                { name: 'Головна', route: '/', icon: 'pi pi-home' },
                { name: 'Клієнти', route: '/pages/users/user/ListClients' }
            ]
        }
    },
    {
        path: '/users/user/propertyLists',
        name: 'userProfileClientsPropertiesLists',
        component: () => import('@/views/users/user/propertyList.vue'),
        meta: {
            requiresAuth: true,
            breadcrumb: [
                { name: 'Головна', route: '/', icon: 'pi pi-home' },
                { name: 'Клієнти', route: '/pages/users/user/ListClients' },
                { name: 'Список нерухомості', route: '/pages/users/user/propertyList' }
            ]
        }
    }
]
