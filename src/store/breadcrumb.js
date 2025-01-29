// stores/breadcrumb.js
import { defineStore } from 'pinia';

export const useBreadcrumbStore = defineStore('breadcrumb', {
    state: () => ({
        items: [] // Массив для хранения элементов breadcrumb
    }),
    actions: {
        setBreadcrumb(newBreadcrumb) {
            if (JSON.stringify(this.items) !== JSON.stringify(newBreadcrumb)) {
                this.items = newBreadcrumb.map((item) => ({
                    name: item.name,
                    link: item.link || "/",
                    icon: item.icon || null
                }));
            } else {
                console.log('Breadcrumb not changed');
            }
        },
        clearBreadcrumb() {
            this.items = [];
        }
    },
    getters: {
        getBreadcrumbItems() {
            return this.items;
        }
    }
});
