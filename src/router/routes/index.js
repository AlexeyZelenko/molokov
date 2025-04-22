import authRoutes from './auth';
import propertyRoutes from './properties';
import dashboardRoutes from './dashboard';
import categoriesRoutes from './categories';
import profileRoutes from './profile';
import adminRoutes from './admin';
import agenciesRoutes from './agencies';
import pagesRoutes from './pages';

export default [
    {
        path: '/',
        name: 'home',
        component: () => import('@/views/pages/Landing.vue'),
        meta: {
            breadcrumb: [{ name: 'Головна', route: '/', icon: 'pi pi-home' }]
        }
    },
    {
        path: '/',
        component: () => import('@/layout/AppLayout.vue'),
        children: [...dashboardRoutes, ...profileRoutes, ...adminRoutes]
    },
    ...categoriesRoutes,
    ...propertyRoutes,
    ...authRoutes,
    ...agenciesRoutes,
    ...pagesRoutes,
    {
        path: '/:pathMatch(.*)*',
        name: 'notfound',
        component: () => import('@/views/pages/NotFound.vue')
    }
];
