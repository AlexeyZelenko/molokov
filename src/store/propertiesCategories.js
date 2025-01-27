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

            return properties.filter((property) => {
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
                this.error = null;

                // Проверяем обязательные фильтры
                if (!filters.category || !filters.subcategory) {
                    throw new Error('Category and subcategory are required');
                }

                this.getComponentFilters(filters);

                // Получаем базовую коллекцию
                const collectionPath = `properties/${filters.category}/${filters.subcategory}`;
                let q = collection(db, collectionPath);
                const constraints = [];

                // Обработка фильтров
                for (const [key, value] of Object.entries(filters)) {
                    // Пропускаем служебные поля и пустые значения
                    if (['category', 'subcategory'].includes(key) ||
                        value === undefined ||
                        value === null ||
                        value === '') {
                        continue;
                    }

                    // Обработка вложенных объектов
                    if (typeof value === 'object' && !Array.isArray(value)) {
                        for (const [nestedKey, nestedValue] of Object.entries(value)) {
                            if (nestedValue !== undefined && nestedValue !== null && nestedValue !== '') {
                                constraints.push(where(`${key}.${nestedKey}`, '==', nestedValue));
                            }
                        }
                        continue;
                    }

                    // Обработка массивов
                    if (Array.isArray(value) && value.length > 0) {
                        constraints.push(where(key, 'array-contains-any', value));
                        continue;
                    }

                    // Обработка обычных значений
                    if (typeof value !== 'object') {
                        constraints.push(where(key, '==', value));
                    }
                }

                // Добавляем сортировку
                constraints.push(orderBy('createdAt', 'desc'));

                // Ограничиваем количество результатов для производительности
                constraints.push(limit(100));

                // Применяем все ограничения к запросу
                q = query(q, ...constraints);

                // Выполняем запрос
                const querySnapshot = await getDocs(q);

                // Обрабатываем результаты
                this.properties = querySnapshot.docs.map((doc) => {
                    const data = doc.data();

                    // Преобразуем временные метки Firestore в объекты Date
                    const timestamps = ['createdAt', 'updatedAt'];
                    timestamps.forEach(field => {
                        if (data[field] && typeof data[field].toDate === 'function') {
                            data[field] = data[field].toDate();
                        }
                    });

                    return {
                        id: doc.id,
                        ...data,
                    };
                });

                // Логируем успешное выполнение
                console.log(`Retrieved ${this.properties.length} properties from ${collectionPath}`);

            } catch (error) {
                this.error = null;
                this.properties = [];

                // Обработка специфических ошибок Firestore
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

                // Логируем ошибку для отладки
                console.error('Error fetching properties:', {
                    code: error.code,
                    message: error.message,
                    filters,
                    collectionPath: filters.category?.code && filters.subcategory?.code ?
                        `properties/${filters.category.code}/${filters.subcategory.code}` :
                        'unknown'
                });

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
