export default [
    {
        path: '/pages/apartments/add',
        name: 'addApartments',
        component: () => import('@/views/pages/apartments/Add.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/pages/apartments/list',
        name: 'apartmentsList',
        component: () => import('@/views/pages/apartments/List.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/pages/apartments/table',
        name: 'apartmentsTable',
        component: () => import('@/views/pages/apartments/Table.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/pages/apartments/edit/:id',
        name: 'editApartments',
        component: () => import('@/views/pages/apartments/Edit.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/pages/apartments/view/:id',
        name: 'viewApartments',
        component: () => import('@/views/pages/apartments/View.vue')
    }
]
