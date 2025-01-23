import authRoutes from './auth';
import propertyRoutes from './properties';
import housesRoutes from './houses';
import apartmentsRoutes from './apartments';
import dashboardRoutes from './dashboard';
import uikitRoutes from './uikit';

export default [
    {
        path: '/',
        name: 'home',
        component: () => import('@/views/pages/Landing.vue')
    },
    {
        path: '/',
        component: () => import('@/layout/AppLayout.vue'),
        children: [
            ...dashboardRoutes,
            ...uikitRoutes,
            ...housesRoutes,
            ...apartmentsRoutes
        ]
    },
    ...propertyRoutes,
    ...authRoutes,
    {
        path: '/:pathMatch(.*)*',
        name: 'notfound',
        component: () => import('@/views/pages/NotFound.vue')
    }
];
