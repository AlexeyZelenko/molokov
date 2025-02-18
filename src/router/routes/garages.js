export default [
    {
        path: '/pages/garages/add',
        name: 'addgarages',
        component: () => import('@/views/pages/garages/Add.vue'),
        meta: {
            requiresAuth: true,
            breadcrumb: [
                { name: 'Головна', route: '/', icon: 'pi pi-home' },
                { name: 'Квартири', route: '/pages/garages' },
                { name: 'Додати об\'єкт нерухомості', route: '/pages/garages/add' }
            ]
        }
    },
    {
        path: '/pages/garages/edit/:id',
        name: 'editgarages',
        component: () => import('@/views/pages/garages/Edit.vue'),
        meta: {
            requiresAuth: true,
            breadcrumb: [
                { name: 'Головна', route: '/', icon: 'pi pi-home' },
                { name: 'Квартири', route: '/pages/garages' },
                { name: 'Редагувати об\'єкт нерухомості', route: '/pages/garages/edit' }
            ]
        }
    },
    {
        path: '/pages/garages/view/:id',
        name: 'viewgarages',
        component: () => import('@/views/pages/garages/View.vue'),
        meta: {
            breadcrumb: [
                { name: 'Головна', route: '/', icon: 'pi pi-home' },
                { name: 'Квартири', route: '/pages/garages' },
                { name: 'Перегляд об\'єкту нерухомості', route: '/pages/garages/view' }
            ]
        }
    }
]
