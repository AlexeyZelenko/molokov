import AppCategoryLayout from '@/layout/AppCategoryLayout.vue';
import AppLayout from '@/layout/AppLayout.vue';
import EditItemView from '@/views/pages/categories/EditItemView.vue';
import ItemDetailsView from '@/views/pages/categories/ItemDetailsView.vue';
import AddItemProperty from '@/views/pages/categories/AddItemProperty.vue';
import ListProperties from '@/views/pages/categories/ListProperties.vue';

export default [
    {
        path: '/',
        component: AppLayout,
        children: [
            {
                path: '/pages/:category/edit/:subcategory/:id',
                name: 'editItem',
                component: EditItemView,
                // props: true,
                meta: {
                    requiresAuth: true,
                    breadcrumb: [{ name: 'Головна', route: '/', icon: 'pi pi-home' }, { name: "Редагування об'єкта нерухомості" }]
                }
            },
            {
                path: '/pages/:category/view/:subcategory/:id',
                name: `itemDetails`,
                component: ItemDetailsView,
                meta: {
                    breadcrumb: [
                        {
                            name: 'Головна',
                            route: '/',
                            icon: 'pi pi-home'
                        },
                        {
                            name: "Деталі об'єкта нерухомості"
                        }
                    ]
                }
            },
            {
                path: '/pages/:category/add',
                name: 'addPropertyItem',
                component: AddItemProperty,
                meta: {
                    requiresAuth: true,
                    breadcrumb: [{ name: 'Головна', route: '/', icon: 'pi pi-home' }, { name: "Додати об'єкт нерухомості" }]
                }
            }
        ]
    },
    {
        path: '/',
        component: AppCategoryLayout,
        children: [
            {
                path: '/categories/:category/:subcategory',
                name: 'listProperties',
                component: ListProperties,
                params: true,
                query: true,
                meta: {
                    breadcrumb: [{ name: 'Головна', route: '/', icon: 'pi pi-home' }, { name: "Список об'єктів нерухомості" }]
                }
            }
        ]
    }
];
