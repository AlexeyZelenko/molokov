export default [
    {
        path: '/pages/houses/add',
        name: 'addHouse',
        component: () => import('@/views/pages/houses/Add.vue'),
        meta: {
            requiresAuth: true,
            breadcrumb: [
                { name: 'Головна', route: '/', icon: 'pi pi-home' },
                { name: 'Будинки', route: '/pages/houses' },
                { name: 'Додати об\'єкт нерухомості', route: '/pages/houses/add' }
            ]
        }
    },
    {
        path: '/pages/houses/table',
        name: 'housesTable',
        component: () => import('@/views/pages/houses/Table.vue'),
        meta: {
            requiresAuth: true,
            breadcrumb: [
                { name: 'Головна', route: '/', icon: 'pi pi-home' },
                { name: 'Будинки', route: '/pages/houses' },
                { name: 'Список об\'єктів нерухомості', route: '/pages/houses/table' }
            ]
        }
    },
    {
        path: '/pages/houses/edit/:id',
        name: 'editHouse',
        component: () => import('@/views/pages/houses/Edit.vue'),
        meta: {
            requiresAuth: true,
            breadcrumb: [
                { name: 'Головна', route: '/', icon: 'pi pi-home' },
                { name: 'Будинки', route: '/pages/houses' },
                { name: 'Редагувати об\'єкт нерухомості', route: '/pages/houses/edit' }
            ]
        }
    },
    {
        path: '/pages/houses/view/:id',
        name: 'viewHouse',
        component: () => import('@/views/pages/houses/View.vue'),
        meta: {
            breadcrumb: [
                {name: 'Головна', route: '/', icon: 'pi pi-home'},
                {name: 'Будинки', route: '/pages/houses'},
                {name: 'Перегляд об\'єкту нерухомості', route: '/pages/houses/view'}
            ]
        }
    }
];
