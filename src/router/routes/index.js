import authRoutes from './auth';
import propertyRoutes from './properties';
import housesRoutes from './houses';
import apartmentsRoutes from './apartments';
import officesRoutes from './offices';
import commercialRoutes from './commercial';
import landRoutes from './land';
import otherRoutes from './other';
import dashboardRoutes from './dashboard';
import uikitRoutes from './uikit';
import categoriesRoutes from './categories';
import profileRoutes from './profile';
import adminRoutes from './admin';

export default [
    {
        path: '/',
        name: 'home',
        component: () => import('@/views/pages/Landing.vue'),
        meta: {
            breadcrumb: [
                { name: 'Головна', route: '/', icon: 'pi pi-home' }
            ]
        }
    },
    {
        path: '/',
        component: () => import('@/layout/AppLayout.vue'),
        children: [
            ...dashboardRoutes,
            ...uikitRoutes,
            ...housesRoutes,
            ...apartmentsRoutes,
            ...officesRoutes,
            ...commercialRoutes,
            ...landRoutes,
            ...otherRoutes,
            ...profileRoutes,
            ...adminRoutes
        ]
    },
    ...categoriesRoutes,
    ...propertyRoutes,
    ...authRoutes,
    {
        path: '/:pathMatch(.*)*',
        name: 'notfound',
        component: () => import('@/views/pages/NotFound.vue')
    }
];
