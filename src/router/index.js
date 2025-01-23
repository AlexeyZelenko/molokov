import { createRouter, createWebHistory } from 'vue-router';
import { authGuard } from './guards';
import routes from './routes';

const router = createRouter({
    history: createWebHistory(),
    routes
});

// Global navigation guard
router.beforeEach(authGuard);

export default router;
