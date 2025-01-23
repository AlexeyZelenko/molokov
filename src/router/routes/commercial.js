export default [
    {
        path: '/pages/commercial/add',
        name: 'commercialAdd',
        component: () => import('@/views/pages/commercial/Add.vue')
    },
    {
        path: '/pages/commercial/list',
        name: 'commercialList',
        component: () => import('@/views/pages/commercial/List.vue')
    },
    {
        path: '/pages/commercial/table',
        name: 'commercialTable',
        component: () => import('@/views/pages/commercial/Table.vue')
    },
    {
        path: '/pages/commercial/edit/:id',
        name: 'commercialEdit',
        component: () => import('@/views/pages/commercial/Edit.vue')
    },
    {
        path: '/pages/commercial/view/:id',
        name: 'commercialView',
        component: () => import('@/views/pages/commercial/View.vue')
    }
]
