import { defineStore } from 'pinia';
import { useApartmentsStore } from "@/store/apartments";

export const useAreasStore = defineStore('areas', {
    state: () => ({
        selectedArea: null,
        realEstateItems: [
            {
                id: 1,
                title: 'Квартири',
                key: 'apartments',
                image: '/images/apartments.webp',
                actions: [
                    {type: 'sell', label: 'Продаж', icon: 'pi pi-home'},
                    {type: 'rent', label: 'Оренда', icon: 'pi pi-key'},
                    {type: 'exchange', label: 'Обмін', icon: 'pi pi-sync'},
                    {type: 'daily', label: 'Подобово', icon: 'pi pi-clock'}
                ],
            },
            {
                id: 2,
                title: 'Кімнати',
                key: 'rooms',
                image: '/images/rooms.webp',
                actions: [
                    {type: 'sell', label: 'Продаж', icon: 'pi pi-home'},
                    {type: 'rent', label: 'Оренда', icon: 'pi pi-key'},
                    {type: 'exchange', label: 'Обмін', icon: 'pi pi-sync'},
                    {type: 'daily', label: 'Подобово', icon: 'pi pi-clock'}
                ],
            },
            {
                id: 3,
                title: 'Гаражи',
                key: 'garages',
                image: '/images/garages.webp',
                actions: [
                    {type: 'sell', label: 'Продаж', icon: 'pi pi-home'},
                    {type: 'rent', label: 'Оренда', icon: 'pi pi-key'},
                    {type: 'exchange', label: 'Обмін', icon: 'pi pi-sync'},
                    {type: 'daily', label: 'Подобово', icon: 'pi pi-clock'}
                ],
            },
            {
                id: 4,
                title: 'Приватний сектор',
                key: 'houses',
                image: '/images/houses.webp',
                actions: [
                    {type: 'sell', label: 'Продаж', icon: 'pi pi-home'},
                    {type: 'rent', label: 'Оренда', icon: 'pi pi-key'},
                    {type: 'exchange', label: 'Обмін', icon: 'pi pi-sync'},
                    {type: 'daily', label: 'Подобово', icon: 'pi pi-clock'}
                ],
            },
            {
                id: 5,
                title: 'Приміщення',
                key: 'offices',
                image: '/images/commercial.webp',
                actions: [
                    {type: 'sell', label: 'Продаж', icon: 'pi pi-home'},
                    {type: 'rent', label: 'Оренда', icon: 'pi pi-key'},
                    {type: 'exchange', label: 'Обмін', icon: 'pi pi-sync'},
                    {type: 'daily', label: 'Подобово', icon: 'pi pi-clock'}
                ],
            },
            {
                id: 6,
                title: 'Будівлі',
                key: 'commercial',
                image: '/images/buildings.webp',
                actions: [
                    {type: 'sell', label: 'Продаж', icon: 'pi pi-home'},
                    {type: 'rent', label: 'Оренда', icon: 'pi pi-key'},
                    {type: 'exchange', label: 'Обмін', icon: 'pi pi-sync'},
                    {type: 'daily', label: 'Подобово', icon: 'pi pi-clock'}
                ],
            },
            {
                id: 7,
                title: 'Земельні ділянки',
                key: 'land',
                image: '/images/land.webp',
                actions: [
                    {type: 'sell', label: 'Продаж', icon: 'pi pi-home'},
                    {type: 'rent', label: 'Оренда', icon: 'pi pi-key'},
                    {type: 'exchange', label: 'Обмін', icon: 'pi pi-sync'},
                    {type: 'daily', label: 'Подобово', icon: 'pi pi-clock'}
                ],
            },
            {
                id: 8,
                title: 'Інше',
                key: 'other',
                image: '/images/other.webp',
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
        areas() {
            const apartmentsStore = useApartmentsStore();
            return apartmentsStore.dropdowns.areas || [];
        }
    },
    actions: {
        setSelectedArea(area) {
            this.selectedArea = area;
        },
    },
});
