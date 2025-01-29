import AppLayout from "@/layout/AppLayout.vue";

export default [
    {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: {
            breadcrumb: [
                { name: 'Головна', route: '/', icon: 'pi pi-home' },
                { name: 'Dashboard', route: '/dashboard' }
            ]
        }
    },
    {
        path: '/uikit/formlayout',
        name: 'formlayout',
        component: () => import('@/views/uikit/FormLayout.vue')
    },
    {
        path: '/uikit/input',
        name: 'input',
        component: () => import('@/views/uikit/InputDoc.vue')
    },
    {
        path: '/uikit/button',
        name: 'button',
        component: () => import('@/views/uikit/ButtonDoc.vue')
    },
    {
        path: '/uikit/table',
        name: 'table',
        component: () => import('@/views/uikit/TableDoc.vue')
    },
    {
        path: '/uikit/list',
        name: 'list',
        component: () => import('@/views/uikit/ListDoc.vue')
    },
    {
        path: '/uikit/tree',
        name: 'tree',
        component: () => import('@/views/uikit/TreeDoc.vue')
    },
    {
        path: '/uikit/panel',
        name: 'panel',
        component: () => import('@/views/uikit/PanelsDoc.vue')
    },

    {
        path: '/uikit/overlay',
        name: 'overlay',
        component: () => import('@/views/uikit/OverlayDoc.vue')
    },
    {
        path: '/uikit/media',
        name: 'media',
        component: () => import('@/views/uikit/MediaDoc.vue')
    },
    {
        path: '/uikit/message',
        name: 'message',
        component: () => import('@/views/uikit/MessagesDoc.vue')
    },
    {
        path: '/uikit/file',
        name: 'file',
        component: () => import('@/views/uikit/FileDoc.vue')
    },
    {
        path: '/uikit/menu',
        name: 'menu',
        component: () => import('@/views/uikit/MenuDoc.vue')
    },
    {
        path: '/uikit/charts',
        name: 'charts',
        component: () => import('@/views/uikit/ChartDoc.vue')
    },
    {
        path: '/uikit/misc',
        name: 'misc',
        component: () => import('@/views/uikit/MiscDoc.vue')
    },
    {
        path: '/uikit/timeline',
        name: 'timeline',
        component: () => import('@/views/uikit/TimelineDoc.vue')
    },
    {
        path: '/pages/empty',
        name: 'empty',
        component: () => import('@/views/pages/Empty.vue')
    },
    {
        path: '/pages/crud',
        name: 'crud',
        component: () => import('@/views/pages/Crud.vue')
    },
    {
        path: '/documentation',
        name: 'documentation',
        component: () => import('@/views/pages/Documentation.vue')
    },
    {
        path: '/pages/apartments/add',
        name: 'addApartments',
        component: () => import('@/views/pages/apartments/Add.vue')
    },
    {
        path: '/pages/apartments/list',
        name: 'apartmentsList',
        component: () => import('@/views/pages/apartments/List.vue')
    },
    {
        path: '/pages/apartments/table',
        name: 'apartmentsTable',
        component: () => import('@/views/pages/apartments/Table.vue')
    },
    {
        path: '/pages/apartments/edit/:id',
        name: 'editApartments',
        component: () => import('@/views/pages/apartments/Edit.vue')
    },
    {
        path: '/pages/apartments/view/:id',
        name: 'viewApartments',
        component: () => import('@/views/pages/apartments/View.vue')
    },
    {
        path: '/pages/houses/add',
        name: 'addApartments',
        component: () => import('@/views/pages/apartments/Add.vue')
    },
    {
        path: '/pages/houses/list',
        name: 'apartmentsList',
        component: () => import('@/views/pages/apartments/List.vue')
    },
    {
        path: '/pages/houses/table',
        name: 'apartmentsTable',
        component: () => import('@/views/pages/apartments/Table.vue')
    },
    {
        path: '/pages/houses/edit/:id',
        name: 'editApartments',
        component: () => import('@/views/pages/apartments/Edit.vue')
    },
    {
        path: '/pages/houses/view/:id',
        name: 'viewApartments',
        component: () => import('@/views/pages/apartments/View.vue')
    },
];
