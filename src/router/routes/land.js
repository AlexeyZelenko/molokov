export default [
    {
        path: '/pages/land/add',
        name: 'landAdd',
        component: () => import('@/views/pages/land/Add.vue')
    },
    {
        path: '/pages/land/list',
        name: 'landList',
        component: () => import('@/views/pages/land/List.vue')
    },
    {
        path: '/pages/land/table',
        name: 'landTable',
        component: () => import('@/views/pages/land/Table.vue')
    },
    {
        path: '/pages/land/edit/:id',
        name: 'landEdit',
        component: () => import('@/views/pages/land/Edit.vue')
    },
    {
        path: '/pages/land/view/:id',
        name: 'landView',
        component: () => import('@/views/pages/land/View.vue')
    }
]
