import { createRouter, createWebHistory } from 'vue-router';
import { authGuard, setupRouterGuards } from './guards';
import routes from './routes';

const router = createRouter({
    history: createWebHistory(),
    routes
});

// Global navigation guard
router.beforeEach(authGuard);

setupRouterGuards(router);

export default router;
