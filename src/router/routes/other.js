export default [
    {
        path: '/pages/other/add',
        name: 'otherAdd',
        component: () => import('@/views/pages/other/Add.vue'),
        meta: {
            requiresAuth: true,
            breadcrumb: [
                { name: 'Головна', route: '/', icon: 'pi pi-home' },
                { name: 'Інше', route: '/pages/other' },
                { name: 'Додати об\'єкт нерухомості', route: '/pages/other/add' }
            ]
        }
    },
    {
        path: '/pages/other/edit/:id',
        name: 'otherEdit',
        component: () => import('@/views/pages/other/Edit.vue'),
        meta: {
            requiresAuth: true,
            breadcrumb: [
                { name: 'Головна', route: '/', icon: 'pi pi-home' },
                { name: 'Інше', route: '/pages/other' },
                { name: 'Редагувати об\'єкт нерухомості', route: '/pages/other/edit' }
            ]
        }
    },
    {
        path: '/pages/other/view/:id',
        name: 'otherView',
        component: () => import('@/views/pages/other/View.vue'),
        meta: {
            breadcrumb: [
                { name: 'Головна', route: '/', icon: 'pi pi-home' },
                { name: 'Інше', route: '/pages/other' },
                { name: 'Перегляд об\'єкту нерухомості', route: '/pages/other/view' }
            ]
        }
    }
]
