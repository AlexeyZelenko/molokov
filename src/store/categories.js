import { defineStore } from 'pinia';

export const useCategoriesStore = defineStore('categories', {
    state: () => ({
        categories: [
            {
                id: 1,
                title: 'Квартири',
                key: 'apartments',
                image: '/images/apartments.jpg',
                actions: [
                    {type: 'sell', label: 'Продаж', icon: 'pi pi-home'},
                    {type: 'rent', label: 'Оренда', icon: 'pi pi-key'},
                    {type: 'exchange', label: 'Обмін', icon: 'pi pi-sync'},
                    {type: 'daily', label: 'Подобово', icon: 'pi pi-clock'}
                ],
            }
        ]
    }),
    getters: {
        getAllCategories: (state) => state.categories
    }
});
