export default [
    {
        path: '/pages/apartments/add',
        name: 'addApartments',
        component: () => import('@/views/pages/apartments/Add.vue'),
        meta: {
            requiresAuth: true,
            breadcrumb: [
                { name: 'Головна', route: '/', icon: 'pi pi-home' },
                { name: 'Квартири', route: '/pages/apartments' },
                { name: 'Додати об\'єкт нерухомості', route: '/pages/apartments/add' }
            ]
        }
    },
    {
        path: '/pages/apartments/edit/:id',
        name: 'editApartments',
        component: () => import('@/views/pages/apartments/Edit.vue'),
        meta: {
            requiresAuth: true,
            breadcrumb: [
                { name: 'Головна', route: '/', icon: 'pi pi-home' },
                { name: 'Квартири', route: '/pages/apartments' },
                { name: 'Редагувати об\'єкт нерухомості', route: '/pages/apartments/edit' }
            ]
        }
    },
    {
        path: '/pages/apartments/view/:id',
        name: 'viewApartments',
        component: () => import('@/views/pages/apartments/View.vue'),
        meta: {
            breadcrumb: [
                { name: 'Головна', route: '/', icon: 'pi pi-home' },
                { name: 'Квартири', route: '/pages/apartments' },
                { name: 'Перегляд об\'єкту нерухомості', route: '/pages/apartments/view' }
            ]
        }
    }
]
