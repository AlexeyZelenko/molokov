import { defineStore } from 'pinia';
import { db } from '@/firebase/config';
import {
    collection,
    query,
    where,
    getDocs,
    collectionGroup,
    Timestamp,
    orderBy,
    limit,
    documentId
} from 'firebase/firestore';

export const useAnalyticsStore = defineStore('analytics', {
    state: () => ({
        properties: {},
        loading: false,
        propertiesLastWeek: {},
        customers: [],
    }),
    actions: {
        // async getAllPropertiesSell() {
        //     try {
        //         const querySnapshot = await getDocs(collectionGroup(db, "sell"));
        //         const products = querySnapshot.docs.map(doc => ({
        //             id: doc.id,
        //             ...doc.data()
        //         }));
        //         console.log("Все продукты:", products);
        //         this.propertiesSell = products;
        //     } catch (error) {
        //         console.error("Ошибка при получении продуктов:", error);
        //     }
        // },
        //
        // async getAllPropertiesSellLastWeek() {
        //     try {
        //         // Вычисляем дату 7 дней назад
        //         const sevenDaysAgo = new Date();
        //         sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        //         const sevenDaysTimestamp = Timestamp.fromDate(sevenDaysAgo);
        //
        //         // Запрос с фильтрацией по дате (поле `createdAt` должно быть Timestamp)
        //         const q = query(
        //             collectionGroup(db, "sell"),
        //             where("createdAt", ">=", sevenDaysTimestamp)
        //         );
        //
        //         const querySnapshot = await getDocs(q);
        //         const products = querySnapshot.docs.map(doc => ({
        //             id: doc.id,
        //             ...doc.data()
        //         }));
        //
        //         console.log("Все продукты за последние 7 дней:", products);
        //         console.log("Количество продуктов за 7 дней:", products.length);
        //
        //         this.propertiesSellLastWeek = products.length; // Возвращаем количество
        //     } catch (error) {
        //         console.error("Ошибка при получении продуктов:", error);
        //     }
        // },

        // async getPropertiesByCategory(categoryCode, lastWeek = false) {
        //     this.loading = true;
        //     try {
        //         let q = collectionGroup(db, categoryCode);
        //
        //         if (lastWeek) {
        //             // Вычисляем дату 7 дней назад
        //             const sevenDaysAgo = new Date();
        //             sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        //             const sevenDaysTimestamp = Timestamp.fromDate(sevenDaysAgo);
        //
        //             // Фильтруем по дате
        //             q = query(q, where("createdAt", ">=", sevenDaysTimestamp));
        //         }
        //
        //         const querySnapshot = await getDocs(q);
        //         const products = querySnapshot.docs.map(doc => ({
        //             id: doc.id,
        //             ...doc.data()
        //         }));
        //
        //         if (lastWeek) {
        //             console.log(`Продуктов за последние 7 дней (${categoryCode}):`, products.length);
        //             this.propertiesLastWeek[categoryCode] = products.length;
        //         } else {
        //             console.log(`Все продукты (${categoryCode}):`, products);
        //             this.properties[categoryCode] = products;
        //         }
        //     } catch (error) {
        //         console.error(`Ошибка при получении данных (${categoryCode}):`, error);
        //     } finally {
        //         this.loading = false;
        //     }
        // },

        async getPropertiesByCategories(categories, lastWeek = false) {
            this.loading = true;
            try {
                // Функция для получения данных по одной категории
                const getCategoryData = async (categoryCode) => {
                    let q = collectionGroup(db, categoryCode);

                    if (lastWeek) {
                        // Вычисляем дату 7 дней назад
                        const sevenDaysAgo = new Date();
                        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                        const sevenDaysTimestamp = Timestamp.fromDate(sevenDaysAgo);

                        // Фильтруем по дате
                        q = query(q, where("createdAt", ">=", sevenDaysTimestamp));
                    }

                    const querySnapshot = await getDocs(q);
                    const products = querySnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));

                    return { categoryCode, products };
                };

                // Выполняем запросы для всех категорий параллельно
                const results = await Promise.all(categories.map(categoryCode => getCategoryData(categoryCode)));

                // Обрабатываем результаты
                results.forEach(({ categoryCode, products }) => {
                    if (lastWeek) {
                        console.log(`Продуктов за последние 7 дней (${categoryCode}):`, products.length);
                        this.propertiesLastWeek[categoryCode] = products.length;
                    } else {
                        console.log(`Все продукты (${categoryCode}):`, products);
                        this.properties[categoryCode] = products;
                    }
                });
            } catch (error) {
                console.error('Ошибка при получении данных по категориям:', error);
            } finally {
                this.loading = false;
            }
        }
    }
});
