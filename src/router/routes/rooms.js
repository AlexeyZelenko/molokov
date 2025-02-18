export default [
    {
        path: '/pages/rooms/add',
        name: 'addrooms',
        component: () => import('@/views/pages/rooms/Add.vue'),
        meta: {
            requiresAuth: true,
            breadcrumb: [
                { name: 'Головна', route: '/', icon: 'pi pi-home' },
                { name: 'Квартири', route: '/pages/rooms' },
                { name: 'Додати об\'єкт нерухомості', route: '/pages/rooms/add' }
            ]
        }
    },
    {
        path: '/pages/rooms/edit/:id',
        name: 'editrooms',
        component: () => import('@/views/pages/rooms/Edit.vue'),
        meta: {
            requiresAuth: true,
            breadcrumb: [
                { name: 'Головна', route: '/', icon: 'pi pi-home' },
                { name: 'Квартири', route: '/pages/rooms' },
                { name: 'Редагувати об\'єкт нерухомості', route: '/pages/rooms/edit' }
            ]
        }
    },
    {
        path: '/pages/rooms/view/:id',
        name: 'viewrooms',
        component: () => import('@/views/pages/rooms/View.vue'),
        meta: {
            breadcrumb: [
                { name: 'Головна', route: '/', icon: 'pi pi-home' },
                { name: 'Квартири', route: '/pages/rooms' },
                { name: 'Перегляд об\'єкту нерухомості', route: '/pages/rooms/view' }
            ]
        }
    }
]
