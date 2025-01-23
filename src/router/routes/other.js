export default [
    {
        path: '/pages/other/add',
        name: 'otherAdd',
        component: () => import('@/views/pages/other/Add.vue')
    },
    {
        path: '/pages/other/list',
        name: 'otherList',
        component: () => import('@/views/pages/other/List.vue')
    },
    {
        path: '/pages/other/table',
        name: 'otherTable',
        component: () => import('@/views/pages/other/Table.vue')
    },
    {
        path: '/pages/other/edit/:id',
        name: 'otherEdit',
        component: () => import('@/views/pages/other/Edit.vue')
    },
    {
        path: '/pages/other/view/:id',
        name: 'otherView',
        component: () => import('@/views/pages/other/View.vue')
    }
]
