export default [
    {
        path: '/pages/land/add',
        name: 'landAdd',
        component: () => import('@/views/pages/land/Add.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/pages/land/list',
        name: 'landList',
        component: () => import('@/views/pages/land/List.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/pages/land/table',
        name: 'landTable',
        component: () => import('@/views/pages/land/Table.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/pages/land/edit/:id',
        name: 'landEdit',
        component: () => import('@/views/pages/land/Edit.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/pages/land/view/:id',
        name: 'landView',
        component: () => import('@/views/pages/land/View.vue')
    }
]
