import { defineStore } from 'pinia';
import { db } from '@/firebase/config';
import {
    collection,
    addDoc,
    query,
    where,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
    orderBy,
    limit,
    startAfter,
    increment,
} from 'firebase/firestore';

export const usePropertiesStore = defineStore('properties', {
    state: () => ({
        properties: [],
        loading: false,
        error: null,
        filters: {},
        currentComponent: 'ApartmentsSell'
    }),

    getters: {
        getPropertiesByCategoryAndSubcategory: (state) => (category, subcategory) => {
            return state.properties.filter((property) => property.category.code === category && property.subcategory.code === subcategory)
        },
        getPropertiesByCategory: (state) => (category) => {
            return state.properties.filter((property) => property.category.name === category);
        },

        getPropertiesBySubcategory: (state) => (subcategory) => {
            return state.properties.filter((property) => property.subcategory === subcategory);
        },

        getFilteredProperties: (state) => {
            const { filters, properties } = state;

            if (Object.keys(filters).length === 0) {
                return properties; // Если нет фильтров, возвращаем все объекты
            }

            const filteredProperties = properties.filter((property) => {
                // Переменная для отслеживания, нужно ли продолжать проверку
                let isMatch = true;

                Object.entries(filters).forEach(([key, value]) => {
                    // Проверка на минимальную цену
                    if (key === 'minPrice' && value !== null && value !== undefined) {
                        isMatch = property.priceUSD >= Number(value);
                    }

                    // Проверка на максимальную цену
                    if (key === 'maxPrice' && value !== null && value !== undefined) {
                        isMatch = property.priceUSD <= Number(value);
                    }

                    // Проверка на минимальную этажность
                    if (key === 'minFloor' && value !== null && value !== undefined) {
                        isMatch = property.floors.floor >= Number(value);
                    }

                    // Проверка на максимальную этажность
                    if (key === 'maxFloor' && value !== null && value !== undefined) {
                        isMatch = property.floors.floor <= Number(value);
                    }

                    // Проверка на минимальную площадь - общая площадь
                    if (key === 'minArea' && value !== null && value !== undefined) {
                        isMatch = property.apartmentArea.totalArea >= Number(value);
                    }

                    // Проверка на максимальную площадь - общая площадь
                    if (key === 'maxArea' && value !== null && value !== undefined) {
                        isMatch = property.apartmentArea.totalArea <= Number(value);
                    }

                    // Проверка на минимальную площадь - жилая площадь
                    if (key === 'minAreaLiving' && value !== null && value !== undefined) {
                        isMatch = property.apartmentArea.livingArea >= Number(value);
                    }

                    // Проверка на максимальную площадь - жилая площадь
                    if (key === 'maxAreaLiving' && value !== null && value !== undefined) {
                        isMatch = property.apartmentArea.livingArea <= Number(value);
                    }

                    // Проверка на минимальную площадь - кухня
                    if (key === 'minAreaKitchen' && value !== null && value !== undefined) {
                        isMatch = property.apartmentArea.kitchenArea >= Number(value);
                    }

                    // Проверка на максимальную площадь - кухня
                    if (key === 'maxAreaKitchen' && value !== null && value !== undefined) {
                        isMatch = property.apartmentArea.kitchenArea <= Number(value);
                    }



                    // Если после проверки цены объект не подходит, мы прекращаем дальнейшие проверки
                    if (!isMatch) return;

                    // Обработка вложенных объектов (например, category.code, subcategory.code)
                    if (key.includes('.')) {
                        const keys = key.split('.'); // Разбиваем ключ, например 'subcategory.code'
                        let fieldValue = property;
                        keys.forEach((subKey) => {
                            fieldValue = fieldValue ? fieldValue[subKey] : null; // Погружаемся в объекты по ключам
                        });

                        isMatch = fieldValue === value;
                    }

                    // Обычные фильтры (не вложенные и не объекты)
                    if (isMatch && key && property[key] !== undefined) {
                        isMatch = property[key] === value;
                    }
                });

                // Возвращаем объект, если он прошел все фильтры
                return isMatch;
            });

            return filteredProperties;
        }
    },

    actions: {
        componentMap: {
            'apartments': {
                'sell': 'ApartmentsSell',
                'rent': 'ApartmentsRent'
            },
            'house': {
                'sell': 'HousesSell',
                'rent': 'HousesRent'
            }
        },

        determineComponent(category, subcategory) {
            const componentMap = {
                'apartments': {
                    'sell': 'ApartmentsSell',
                    'rent': 'ApartmentsRent'
                },
                'house': {
                    'sell': 'HousesSell',
                    'rent': 'HousesRent'
                }
            };

            // Normalize and trim inputs
            const normalizedCategory = (category || '').toString().toLowerCase().trim();
            const normalizedSubcategory = (subcategory || '').toString().toLowerCase().trim();

            // Check for exact match and nested access
            const component = componentMap[normalizedCategory]?.[normalizedSubcategory];

            if (component) {
                this.currentComponent = component;
                return component;
            }

            // Fallback strategies
            this.currentComponent = 'ApartmentsSell';
            return 'ApartmentsSell';
        },

        getComponentFilters(filters = {}) {
            const { category = 'apartments', subcategory = 'sell' } = filters;

            return this.determineComponent(category, subcategory);
        },

        async getProperties(filters = {}) {
            try {
                this.loading = true;

                this.getComponentFilters(filters);

                let q = collection(db, 'properties');
                const constraints = [];

                // Применение фильтров
                Object.entries(filters).forEach(([key, value]) => {
                    if (value !== undefined && value !== null && value !== '') {
                        if (key === 'category') {
                            constraints.push(where('category.code', '==', value)); // Применяем фильтр для category.code
                        } else if (key === 'subcategory') {
                            constraints.push(where('subcategory.code', '==', value)); // Применяем фильтр для subcategory.code
                        } else if (Array.isArray(value)) {
                            constraints.push(where(key, 'array-contains-any', value)); // Применяем фильтр для массивов
                        } else {
                            constraints.push(where(key, '==', value)); // Применяем фильтр для обычных значений
                        }
                    }
                });

                constraints.push(orderBy('createdAt', 'desc')); // Сортировка по дате создания

                // Запрос в Firestore без пагинации
                q = query(q, ...constraints);
                const querySnapshot = await getDocs(q);

                const newProperties = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                // Сохраняем все свойства в store
                this.properties = newProperties;

            } catch (error) {
                // Обработка ошибки, если нужно создать индекс
                if (error.message.includes('The query requires an index')) {
                    alert('Создайте индекс для этого запроса. Подробнее: ' + error.message);
                }

                // Логирование ошибки
                console.error('Error fetching properties:', error);
                this.error = error.message;
                throw error;
            } finally {
                this.loading = false;
            }
        },

        setFilters(filters) {
            this.filters = filters;
        },
    },
});
