import { defineStore } from 'pinia';
import { db } from '@/firebase/config';
import { collection, query, where, getDocs, orderBy, limit, documentId, FieldPath } from 'firebase/firestore';
import { log10 } from 'chart.js/helpers';

export const usePropertiesStore = defineStore('properties', {
    state: () => ({
        properties: [],
        loading: false,
        error: null,
        filters: {},
        selectedSort: 'relevance',
        currentComponent: 'ApartmentsSell',
        categoryStructure: {
            apartments: {
                name: 'Квартири',
                subcategories: {
                    rent: { name: 'Аренда' },
                    sell: { name: 'Продажа' },
                    exchange: { name: 'Обмен' },
                    daily: { name: 'Посуточно' }
                }
            },
            rooms: {
                name: 'Квартири',
                subcategories: {
                    rent: { name: 'Аренда' },
                    sell: { name: 'Продажа' },
                    exchange: { name: 'Обмен' },
                    daily: { name: 'Посуточно' }
                }
            },
            offices: {
                name: 'Квартири',
                subcategories: {
                    rent: { name: 'Аренда' },
                    sell: { name: 'Продажа' },
                    exchange: { name: 'Обмен' },
                    daily: { name: 'Посуточно' }
                }
            },
            houses: {
                name: 'Будинки',
                subcategories: {
                    rent: { name: 'Аренда' },
                    sell: { name: 'Продажа' },
                    exchange: { name: 'Обмен' },
                    daily: { name: 'Посуточно' }
                }
            },
            land: {
                name: 'Земельні ділянки',
                subcategories: {
                    rent: { name: 'Аренда' },
                    sell: { name: 'Продажа' },
                    exchange: { name: 'Обмен' },
                    daily: { name: 'Посуточно' }
                }
            },
            commercial: {
                name: 'Комерційна нерухомість',
                subcategories: {
                    rent: { name: 'Аренда' },
                    sell: { name: 'Продажа' },
                    exchange: { name: 'Обмен' },
                    daily: { name: 'Посуточно' }
                }
            },
            garages: {
                name: 'Гаражі',
                subcategories: {
                    rent: { name: 'Аренда' },
                    sell: { name: 'Продажа' },
                    exchange: { name: 'Обмен' },
                    daily: { name: 'Посуточно' }
                }
            },
            other: {
                name: 'Інше',
                subcategories: {
                    rent: { name: 'Аренда' },
                    sell: { name: 'Продажа' },
                    exchange: { name: 'Обмен' },
                    daily: { name: 'Посуточно' }
                }
            }
        }
    }),

    getters: {
        getPropertiesByCategoryAndSubcategory: (state) => (category, subcategory) => {
            return state.properties.filter((property) => property.category.code === category && property.subcategory.code === subcategory);
        },
        getPropertiesByCategory: (state) => (category) => {
            return state.properties.filter((property) => property.category.name === category);
        },

        getPropertiesBySubcategory: (state) => (subcategory) => {
            return state.properties.filter((property) => property.subcategory === subcategory);
        },

        getFilteredProperties: (state) => {
            const { filters, properties, selectedSort } = state;

            let filteredProperties = properties;

            if (Object.keys(filters).length > 0) {
                filteredProperties = properties.filter((property) => {
                    let isMatch = true;

                    Object.entries(filters).forEach(([key, value]) => {
                        if (value === null || value === undefined) return;

                        // Фильтр по цене
                        if (key === 'minPrice') isMatch &&= property.price >= Number(value);
                        if (key === 'maxPrice') isMatch &&= property.price <= Number(value);

                        // Фильтр по этажности
                        if (key === 'minFloor') isMatch &&= property.floors?.floor >= Number(value);
                        if (key === 'maxFloor') isMatch &&= property.floors?.floor <= Number(value);

                        // Фильтр по площади
                        if (key === 'minArea') isMatch &&= property.apartmentArea?.totalArea >= Number(value);
                        if (key === 'maxArea') isMatch &&= property.apartmentArea?.totalArea <= Number(value);
                        if (key === 'minAreaLiving') isMatch &&= property.apartmentArea?.livingArea >= Number(value);
                        if (key === 'maxAreaLiving') isMatch &&= property.apartmentArea?.livingArea <= Number(value);
                        if (key === 'minAreaKitchen') isMatch &&= property.apartmentArea?.kitchenArea >= Number(value);
                        if (key === 'maxAreaKitchen') isMatch &&= property.apartmentArea?.kitchenArea <= Number(value);

                        // Фильтр по количеству комнат
                        if (key === 'rooms.all' && Array.isArray(value) && value.length > 0) {
                            isMatch &&= value.includes(property.rooms?.all);
                        }

                        // Фильтр по поверховості
                        if (key === 'floors.totalFloors' && Array.isArray(value) && value.length > 0) {
                            isMatch &&= value.includes(property.floors?.totalFloors);
                        }

                        // Фильтр по вложенным объектам (например, category.code, subcategory.code)
                        else if (key.includes('.') && key !== 'rooms.all' && key !== 'floors.totalFloors') {
                            const fieldValue = key.split('.').reduce((obj, subKey) => obj?.[subKey], property);
                            isMatch &&= fieldValue === value;
                        }

                        // Обычные фильтры (если ключ совпадает с полем объекта)
                        if (property[key] !== undefined) {
                            isMatch &&= String(property[key]) === String(value);
                        }
                    });

                    return isMatch;
                });
            }

            // Добавляем сортировку
            if (selectedSort === 'price_asc') {
                filteredProperties.sort((a, b) => a.price - b.price);
            } else if (selectedSort === 'price_desc') {
                filteredProperties.sort((a, b) => b.price - a.price);
            } else if (selectedSort === 'area_asc') {
                filteredProperties.sort((a, b) => (a.apartmentArea?.totalArea || 0) - (b.apartmentArea?.totalArea || 0));
            } else if (selectedSort === 'area_desc') {
                filteredProperties.sort((a, b) => (b.apartmentArea?.totalArea || 0) - (a.apartmentArea?.totalArea || 0));
            }

            return filteredProperties;
        }
    },

    actions: {
        componentMap: {
            apartments: {
                sell: 'ApartmentsSell',
                rent: 'ApartmentsRent'
            },
            house: {
                sell: 'HousesSell',
                rent: 'HousesRent'
            }
        },

        determineComponent(category, subcategory) {
            const componentMap = {
                apartments: {
                    sell: 'ApartmentsSell',
                    rent: 'ApartmentsRent'
                },
                house: {
                    sell: 'HousesSell',
                    rent: 'HousesRent'
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

                if (!filters.category || !filters.subcategory) {
                    throw new Error('Category and subcategory are required');
                }

                this.getComponentFilters(filters);
                const collectionPath = `properties/${filters.category}/${filters.subcategory}`;
                const constraints = [];

                if (specificIds && specificIds.length > 0) {
                    const BATCH_SIZE = 10;
                    const batches = [];

                    for (let i = 0; i < specificIds.length; i += BATCH_SIZE) {
                        batches.push(specificIds.slice(i, i + BATCH_SIZE));
                    }

                    const results = await Promise.all(
                        batches.map(async (batchIds) => {
                            if (batchIds.length > 0) {
                                const q = query(collection(db, collectionPath), where(documentId(), 'in', batchIds), orderBy('createdAt', 'desc'));
                                const snapshot = await getDocs(q);
                                return snapshot.docs;
                            }
                            return [];
                        })
                    );

                    this.properties = results.flat().map((doc) => ({
                        id: doc.id,
                        ...this.processDocumentData(doc.data())
                    }));
                } else {
                    for (const [key, value] of Object.entries(filters)) {
                        if (['category', 'subcategory'].includes(key) || value === undefined || value === null || value === '') {
                            continue;
                        }

                        if (typeof value === 'object' && value !== null && !Array.isArray(value) && Object.keys(value).length > 0) {
                            for (const [nestedKey, nestedValue] of Object.entries(value)) {
                                if (nestedValue !== undefined && nestedValue !== null && nestedValue !== '') {
                                    constraints.push(where(`${key}.${nestedKey}`, '==', nestedValue));
                                }
                            }
                            continue;
                        }

                        if (Array.isArray(value) && value.length > 0 && value.length <= 10) {
                            constraints.push(where(key, 'array-contains-any', value));
                            continue;
                        }

                        if (typeof value !== 'object') {
                            constraints.push(where(key, '==', value));
                        }
                    }

                    // Оптимизация фильтрации на уровне запроса
                    // constraints.push(where('isPublic', '==', true));
                    constraints.push(orderBy('createdAt', 'desc'));
                    constraints.push(limit(100));

                    const q = query(collection(db, collectionPath), ...constraints);
                    const querySnapshot = await getDocs(q);

                    this.properties = querySnapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...this.processDocumentData(doc.data())
                    }));
                }
            } catch (error) {
                this.handleError(error, filters, specificIds);
                console.error('Error fetching properties:', error);
            } finally {
                this.loading = false;
            }
        },

        // Вспомогательный метод для обработки данных документа
        processDocumentData(data) {
            const timestamps = ['createdAt', 'updatedAt'];
            timestamps.forEach((field) => {
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
                collectionPath: filters.category && filters.subcategory ? `properties/${filters.category}/${filters.subcategory}` : 'unknown'
            });

            throw error;
        },

        setFilters(filters) {
            this.filters = filters;
        },

        /**
         * Найти продукт по его ID во всех коллекциях и подколлекциях
         * @param {string} id - ID продукта
         * @returns {object|null} - Найденный продукт или null, если не найден
         */
        async findPropertyById(category, subcategory, id) {
            if (!id) {
                console.warn('❗ ID продукта не указан.');
                return null;
            }

            this.loading = true;
            this.error = null;

            try {
                // Основные коллекции (например, "apartments", "houses", "land" и т.д.)
                const mainCollections = ['apartments', 'houses', 'land', 'commercial', 'garage', 'other', 'rooms', 'offices'];

                const collectionPath = `properties/${category}/${subcategory}`;
                console.log(`🔍 Поиск в коллекции: ${collectionPath}`);

                const q = query(collection(db, collectionPath), where('idProperty', '==', Number(id)));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const doc = querySnapshot.docs[0];
                    console.log('✅ Продукт найден:', doc.id, doc.data());
                    this.loading = false;
                    return { id: doc.id, ...doc.data() };
                }

                console.warn('⚠️ Продукт с таким ID не найден.');
                return null;
            } catch (error) {
                console.error('❌ Ошибка при поиске продукта:', error);
                this.error = error.message;
                return null;
            } finally {
                this.loading = false;
            }
        },

        setSelectedSort(sortType) {
            this.selectedSort = sortType;
        }
    }
});
