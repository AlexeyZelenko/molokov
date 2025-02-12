import { defineStore } from 'pinia';
import { db } from '@/firebase/config';
import {
    collection,
    query,
    where,
    getDocs,
    orderBy,
    limit,
    documentId
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

            return properties.filter((property) => {
                // Переменная для отслеживания, нужно ли продолжать проверку
                let isMatch = true;

                Object.entries(filters).forEach(([key, value]) => {
                    // Проверка на минимальную цену
                    if (key === 'minPrice' && value !== null && value !== undefined) {
                        isMatch = property.price >= Number(value);
                    }

                    // Проверка на максимальную цену
                    if (key === 'maxPrice' && value !== null && value !== undefined) {
                        isMatch = property.price <= Number(value);
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

        async getProperties(filters = {}, specificIds = []) {
            try {
                this.loading = true;
                this.error = null;

                // Проверяем обязательные фильтры
                if (!filters.category || !filters.subcategory) {
                    throw new Error('Category and subcategory are required');
                }

                this.getComponentFilters(filters);
                const collectionPath = `properties/${filters.category}/${filters.subcategory}`;
                const constraints = [];

                // Если переданы конкретные ID, используем их для фильтрации
                if (specificIds && specificIds.length > 0) {
                    const BATCH_SIZE = 10;
                    const batches = [];

                    // Разбиваем массив ID на группы
                    for (let i = 0; i < specificIds.length; i += BATCH_SIZE) {
                        batches.push(specificIds.slice(i, i + BATCH_SIZE));
                    }

                    // Выполняем запросы для каждой группы ID
                    const results = await Promise.all(
                        batches.map(async (batchIds) => {
                            const q = query(
                                collection(db, collectionPath),
                                where(documentId(), 'in', batchIds),
                                orderBy('createdAt', 'desc')
                            );
                            const snapshot = await getDocs(q);
                            return snapshot.docs;
                        })
                    );

                    // Обрабатываем результаты
                    this.properties = results.flat().map(doc => ({
                        id: doc.id,
                        ...this.processDocumentData(doc.data())
                    }));

                } else {
                    // Обычный поиск с фильтрами
                    for (const [key, value] of Object.entries(filters)) {
                        if (['category', 'subcategory'].includes(key) ||
                            value === undefined ||
                            value === null ||
                            value === '') {
                            continue;
                        }

                        if (typeof value === 'object' && !Array.isArray(value)) {
                            for (const [nestedKey, nestedValue] of Object.entries(value)) {
                                if (nestedValue !== undefined && nestedValue !== null && nestedValue !== '') {
                                    constraints.push(where(`${key}.${nestedKey}`, '==', nestedValue));
                                }
                            }
                            continue;
                        }

                        if (Array.isArray(value) && value.length > 0) {
                            constraints.push(where(key, 'array-contains-any', value));
                            continue;
                        }

                        if (typeof value !== 'object') {
                            constraints.push(where(key, '==', value));
                        }
                    }

                    constraints.push(orderBy('createdAt', 'desc'));
                    constraints.push(limit(100));

                    const q = query(collection(db, collectionPath), ...constraints);
                    const querySnapshot = await getDocs(q);

                    this.properties = querySnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...this.processDocumentData(doc.data())
                    }));
                }
            } catch (error) {
                this.handleError(error, filters, specificIds);
            } finally {
                this.loading = false;
            }
        },

// Вспомогательный метод для обработки данных документа
        processDocumentData(data) {
            const timestamps = ['createdAt', 'updatedAt'];
            timestamps.forEach(field => {
                if (data[field]?.toDate) {
                    data[field] = data[field].toDate();
                }
            });
            return data;
        },

// Вспомогательный метод для обработки ошибок
        handleError(error, filters, specificIds = []) {
            this.error = null;
            this.properties = [];

            if (error.code === 'permission-denied') {
                this.error = 'У вас нет прав доступа к этим данным';
            } else if (error.code === 'not-found') {
                this.error = 'Данные не найдены';
            } else if (error.message.includes('The query requires an index')) {
                const indexUrl = error.message.match(/https:\/\/console\.firebase\.google\.com[^\s]*/)?.[0];
                this.error = `Необходимо создать индекс для этого запроса. ${indexUrl ? `\nСоздать индекс: ${indexUrl}` : ''}`;
            } else {
                this.error = 'Произошла ошибка при загрузке данных';
            }

            console.error('Error fetching properties:', {
                code: error.code,
                message: error.message,
                filters,
                specificIds,
                collectionPath: filters.category && filters.subcategory ?
                    `properties/${filters.category}/${filters.subcategory}` :
                    'unknown'
            });

            throw error;
        },

        setFilters(filters) {
            this.filters = filters;
        },
    },
});
