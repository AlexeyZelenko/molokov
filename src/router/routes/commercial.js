export default [
    {
        path: '/pages/commercial/add',
        name: 'commercialAdd',
        component: () => import('@/views/pages/commercial/Add.vue'),
        meta: {
            requiresAuth: true,
            breadcrumb: [
                {name: 'Головна', route: '/', icon: 'pi pi-home'},
                {name: 'Комерційна нерухомість', route: '/pages/commercial'},
                {name: 'Додати об\'єкт нерухомості', route: '/pages/commercial/add'}
            ]
        }
    },
    {
        path: '/pages/commercial/edit/:id',
        name: 'commercialEdit',
        component: () => import('@/views/pages/commercial/Edit.vue'),
        meta: {
            requiresAuth: true,
            breadcrumb: [
                {name: 'Головна', route: '/', icon: 'pi pi-home'},
                {name: 'Комерційна нерухомість', route: '/pages/commercial'},
                {name: 'Редагувати об\'єкт нерухомості', route: '/pages/commercial/edit'}
            ]
        }
    },
    {
        path: '/pages/commercial/view/:id',
        name: 'commercialView',
        component: () => import('@/views/pages/commercial/View.vue'),
        meta: {
            breadcrumb: [
                {name: 'Головна', route: '/', icon: 'pi pi-home'},
                {name: 'Комерційна нерухомість', route: '/pages/commercial'},
                {name: 'Перегляд об\'єкта нерухомості', route: '/pages/commercial/view'}
            ]
        }
    }
]
