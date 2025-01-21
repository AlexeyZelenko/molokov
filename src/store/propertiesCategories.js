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
        filters: {}
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

            console.log('Current filters:', filters); // Логируем текущие фильтры
            console.log('All properties:', properties); // Логируем все объекты недвижимости

            if (Object.keys(filters).length === 0) {
                console.log('No filters applied. Returning all properties.');
                return properties; // Если нет фильтров, возвращаем все объекты
            }

            const filteredProperties = properties.filter((property) => {
                // Переменная для отслеживания, нужно ли продолжать проверку
                let isMatch = true;

                Object.entries(filters).forEach(([key, value]) => {
                    // Логирование для каждого свойства
                    console.log(`Checking property: ${property.id}`);
                    console.log(`Checking key: ${key}, value: ${value}`);

                    // Проверка на минимальную цену
                    if (key === 'minPrice' && value !== null && value !== undefined) {
                        isMatch = property.priceUSD >= Number(value);
                        console.log(`Price match for minPrice: ${isMatch}`);
                    }

                    // Проверка на максимальную цену
                    if (key === 'maxPrice' && value !== null && value !== undefined) {
                        isMatch = property.priceUSD <= Number(value);
                        console.log(`Price match for maxPrice: ${isMatch}`);
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
                        console.log(`Match result for ${key}: ${isMatch}`);
                    }

                    // Обычные фильтры (не вложенные и не объекты)
                    if (isMatch && key && property[key] !== undefined) {
                        isMatch = property[key] === value;
                        console.log(`Match result for ${key}: ${isMatch}`);
                    }
                });

                // Возвращаем объект, если он прошел все фильтры
                return isMatch;
            });

            console.log('Filtered properties:', filteredProperties); // Логируем отфильтрованные объекты

            return filteredProperties;
        }
    },

    actions: {
        async getProperties(filters = {}) {
            try {
                this.loading = true;
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
            console.log('setFilters', filters);
            this.filters = filters;
        },
    },
});
