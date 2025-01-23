export default [
    {
        path: '/pages/houses/add',
        name: 'addHouse',
        component: () => import('@/views/pages/houses/Add.vue')
    },
    {
        path: '/pages/houses/list',
        name: 'housesList',
        component: () => import('@/views/pages/houses/List.vue')
    },
    {
        path: '/pages/houses/table',
        name: 'housesTable',
        component: () => import('@/views/pages/houses/Table.vue')
    },
    {
        path: '/pages/houses/edit/:id',
        name: 'editHouse',
        component: () => import('@/views/pages/houses/Edit.vue')
    },
    {
        path: '/pages/houses/view/:id',
        name: 'viewHouse',
        component: () => import('@/views/pages/houses/View.vue')
    },
];
