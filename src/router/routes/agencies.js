export default [
    {
        path: '/',
        component: () => import('@/layout/AppLayoutAgencies.vue'),
        children: [
            {
                path: '/agents',
                name: 'agentsList',
                component: () => import('@/views/agencies/agents/ListAgents.vue'),
                meta: {
                    requiresAuth: false,
                    breadcrumb: [
                        { name: 'Головна', route: '/', icon: 'pi pi-home' },
                        { name: 'Агенти', route: '/ListAgents' }
                    ]
                }
            },
            {
                path: '/agents/:id',
                name: 'agentsId',
                component: () => import('@/views/agencies/agents/AgentId.vue'),
                meta: {
                    requiresAuth: false,
                    breadcrumb: [
                        { name: 'Головна', route: '/', icon: 'pi pi-home' },
                        { name: 'Агенти', route: '/ListAgents' },
                        { name: 'Агент', route: '/agents/:id' }
                    ]
                }
            },
            {
                path: '/agencies',
                name: 'agenciesList',
                component: () => import('@/views/agencies/ListAgencies.vue'),
                meta: {
                    requiresAuth: false,
                    breadcrumb: [
                        { name: 'Головна', route: '/', icon: 'pi pi-home' },
                        { name: 'Агенції', route: '/ListAgencies' }
                    ]
                }
            },
            {
                path: '/register-agency',
                name: 'registerAgency',
                requiresAuth: true,
                component: () => import('@/views/agencies/RegisterAgency.vue'),
                props: true,
                meta: {
                    requiresAuth: false,
                    breadcrumb: [
                        { name: 'Головна', route: '/', icon: 'pi pi-home' },
                        { name: 'Реєстрація агенції', route: '/register-agency' }
                    ]
                }
            }
        ]
    }
];
