export default [
    {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('@/views/Dashboard.vue'),
        // meta: { requiresAuth: true }
    },
    {
        path: '/cherkasy-areas',
        name: 'cherkasy-areas',
        component: () => import('@/views/CherkasyAreas.vue')
    },
];
