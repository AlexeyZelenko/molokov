export default [
    {
        path: '/pages/offices/add',
        name: 'officesAdd',
        component: () => import('@/views/pages/offices/Add.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/pages/offices/list',
        name: 'officesList',
        component: () => import('@/views/pages/offices/List.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/pages/offices/table',
        name: 'officesTable',
        component: () => import('@/views/pages/offices/Table.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/pages/offices/edit/:id',
        name: 'officesEdit',
        component: () => import('@/views/pages/offices/Edit.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/pages/offices/view/:id',
        name: 'officesView',
        component: () => import('@/views/pages/offices/View.vue')
    }
]
