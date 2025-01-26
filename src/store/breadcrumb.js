// stores/breadcrumb.js
import { defineStore } from 'pinia';

export const useBreadcrumbStore = defineStore('breadcrumb', {
    state: () => ({
        items: [] // Массив для хранения элементов breadcrumb
    }),
    actions: {
        setBreadcrumb(newBreadcrumb) {
            console.log('Setting breadcrumb:', newBreadcrumb);
            if (JSON.stringify(this.items) !== JSON.stringify(newBreadcrumb)) {
                this.items = newBreadcrumb.map((item) => ({
                    name: item.name,
                    link: item.link || "/",
                    icon: item.icon || null
                }));
                console.log('Breadcrumb updated:', this.items);
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
            console.log('Getting breadcrumb:', this.items);
            return this.items;
        }
    }
});
