export default [
    {
        path: '/pages/offices/add',
        name: 'officesAdd',
        component: () => import('@/views/pages/offices/Add.vue')
    },
    {
        path: '/pages/offices/list',
        name: 'officesList',
        component: () => import('@/views/pages/offices/List.vue')
    },
    {
        path: '/pages/offices/table',
        name: 'officesTable',
        component: () => import('@/views/pages/offices/Table.vue')
    },
    {
        path: '/pages/offices/edit/:id',
        name: 'officesEdit',
        component: () => import('@/views/pages/offices/Edit.vue')
    },
    {
        path: '/pages/offices/view/:id',
        name: 'officesView',
        component: () => import('@/views/pages/offices/View.vue')
    }
]
