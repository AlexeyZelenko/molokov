export default [
    {
        path: '/pages/offices/add',
        name: 'officesAdd',
        component: () => import('@/views/pages/offices/Add.vue'),
        meta: {
            requiresAuth: true,
            breadcrumb: [
                { name: 'Головна', route: '/', icon: 'pi pi-home' },
                { name: 'Офіси', route: '/pages/offices' },
                { name: 'Додати об\'єкт нерухомості', route: '/pages/offices/add' }
            ]
        }
    },
    {
        path: '/pages/offices/edit/:id',
        name: 'officesEdit',
        component: () => import('@/views/pages/offices/Edit.vue'),
        meta: {
            requiresAuth: true,
            breadcrumb: [
                { name: 'Головна', route: '/', icon: 'pi pi-home' },
                { name: 'Офіси', route: '/pages/offices' },
                { name: 'Редагувати об\'єкт нерухомості', route: '/pages/offices/edit' }
            ]
        }
    },
    {
        path: '/pages/offices/view/:id',
        name: 'officesView',
        component: () => import('@/views/pages/offices/View.vue'),
        meta: {
            breadcrumb: [
                { name: 'Головна', route: '/', icon: 'pi pi-home' },
                { name: 'Офіси', route: '/pages/offices' },
                { name: 'Перегляд об\'єкту нерухомості', route: '/pages/offices/view' }
            ]
        }
    }
]
