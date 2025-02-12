export default [
    {
        path: '/pages/land/add',
        name: 'landAdd',
        component: () => import('@/views/pages/land/Add.vue'),
        meta: {
            requiresAuth: true,
            breadcrumb: [
                { name: 'Головна', route: '/', icon: 'pi pi-home' },
                { name: 'Земельні ділянки', route: '/pages/land' },
                { name: 'Додати об\'єкт нерухомості', route: '/pages/land/add' }
            ]
        }
    },
    {
        path: '/pages/land/edit/:id',
        name: 'landEdit',
        component: () => import('@/views/pages/land/Edit.vue'),
        meta: {
            requiresAuth: true,
            breadcrumb: [
                { name: 'Головна', route: '/', icon: 'pi pi-home' },
                { name: 'Земельні ділянки', route: '/pages/land' },
                { name: 'Редагувати об\'єкт нерухомості', route: '/pages/land/edit' }
            ]
        }
    },
    {
        path: '/pages/land/view/:id',
        name: 'landView',
        component: () => import('@/views/pages/land/View.vue'),
        meta: {
            breadcrumb: [
                { name: 'Головна', route: '/', icon: 'pi pi-home' },
                { name: 'Земельні ділянки', route: '/pages/land' },
                { name: 'Перегляд об\'єкту нерухомості', route: '/pages/land/view' }
            ]
        }
    }
]
