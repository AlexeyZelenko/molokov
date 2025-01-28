import { defineStore } from 'pinia';
import { auth, db } from '@/firebase/config';
import {
    doc,
    getDoc,
    updateDoc,
    collection,
    addDoc,
    query,
    where,
    getDocs,
    serverTimestamp,
    getFirestore,
} from 'firebase/firestore';

export const useUserStore = defineStore('user', {
    state: () => ({
        profile: null,
        propertyLists: [],
        user: null,
        clients: [],
        loading: false,
    }),

    actions: {
        async fetchUserProfile() {
            if (!auth.currentUser) return;

            const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
            if (userDoc.exists()) {
                this.profile = { id: userDoc.id, ...userDoc.data() };
            }
        },

        async updateProfile(data) {
            if (!auth.currentUser || !this.profile) return;

            await updateDoc(doc(db, 'users', auth.currentUser.uid), data);
            this.profile = { ...this.profile, ...data };
        },

        async createPropertyList(name, clientName, id) {
            if (!auth.currentUser) return;

            const newList = {
                userId: auth.currentUser.uid,
                name,
                clientName,
                clientId: id,
                properties: [],
                createdAt: new Date()
            };

            const docRef = await addDoc(collection(db, 'propertyLists'), newList);
            this.propertyLists.push({ id: docRef.id, ...newList });
        },

        async fetchPropertyLists() {
            if (!auth.currentUser) return;

            const q = query(
                collection(db, 'propertyLists'),
                where('userId', '==', auth.currentUser.uid)
            );

            const querySnapshot = await getDocs(q);
            this.propertyLists = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        },

        async fetchUserAndClients() {
            this.loading = true;
            try {
                const userId = auth.currentUser?.uid;

                if (!userId) throw new Error('Користувач не авторизований');

                const db = getFirestore();

                // Отримати дані користувача
                const userRef = doc(db, 'users', userId);
                const userDoc = await getDoc(userRef);

                if (userDoc.exists()) {
                    this.user = { id: userDoc.id, ...userDoc.data() };
                }

                // Отримати дані клієнтів
                const clientsRef = collection(db, 'users', userId, 'clients');
                const querySnapshot = await getDocs(clientsRef);

                const clients = [];
                querySnapshot.forEach((doc) => {
                    clients.push({
                        id: doc.id,
                        ...doc.data()
                    });
                });

                this.clients = clients;

                console.log('user:', this.user);
                console.log('clients:', clients);

                return { user: this.user, clients };
            } catch (error) {
                console.error('Помилка при отриманні даних:', error);
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async fetchUser() {
            this.loading = true;
            const userId = auth.currentUser?.uid;

            if (!userId) throw new Error('Користувач не авторизований');

            const db = getFirestore();
            const userRef = doc(db, 'users', userId);
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
                this.user = { id: userDoc.id, ...userDoc.data() };
            }

            this.loading = false;
        },

        async getClients() {
            try {
                const userId = auth.currentUser?.uid;
                if (!userId) {
                    throw new Error('Користувач не авторизований');
                }

                // Отримати посилання на колекцію 'clients' для поточного користувача
                const clientsRef = collection(db, 'users', userId, 'clients');

                // Отримати всі документи з колекції 'clients'
                const querySnapshot = await getDocs(clientsRef);

                // Створити масив клієнтів
                const clients = [];
                querySnapshot.forEach((doc) => {
                    // Додати дані клієнта разом з його ID
                    clients.push({
                        id: doc.id,
                        ...doc.data()
                    });
                });

                console.log('clients:', clients);
                return clients;
            } catch (error) {
                console.error('Помилка при отриманні клієнтів:', error);
                throw error;
            }
        },

        async addClient(client) {
            try {
                const userId = auth.currentUser?.uid;
                if (!userId) {
                    throw new Error('Користувач не авторизований');
                }

                console.log('client:', client);

                // Create a new document in 'clients' subcollection
                const clientsRef = collection(db, 'users', userId, 'clients');

                const clientWithMetadata = {
                    ...client,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                };

                const docRef = await addDoc(clientsRef, clientWithMetadata);

                // Add the ID to the client object
                const newClient = {
                    ...clientWithMetadata,
                    id: docRef.id
                };

                console.log('newClient:', newClient);

                this.clients.push(newClient);
                return newClient;
            } catch (error) {
                console.error('Помилка при додаванні клієнта:', error);
                throw error;
            }
        },

        async updateClient(clientId, updatedData) {
            console.log('clientId:', clientId, 'updatedData:', updatedData);
            const userId = auth.currentUser?.uid;

            if (!userId) throw new Error('Користувач не авторизований');

            const userRef = doc(db, 'users', userId);

            // Оновлюємо клієнта в масиві
            const updatedClients = this.clients.map((client) =>
                client.id === clientId ? { ...client, ...updatedData } : client
            );

            await updateDoc(userRef, {
                clients: updatedClients,
            });

            this.clients = updatedClients; // Оновлюємо локальний стан
        },

        async deleteClient(clientId) {
            const userId = auth.currentUser?.uid;

            if (!userId) throw new Error('Користувач не авторизований');

            const userRef = doc(db, 'users', userId);

            // Видаляємо клієнта з масиву
            const updatedClients = this.clients.filter((client) => client.id !== clientId);

            await updateDoc(userRef, {
                clients: updatedClients,
            });

            this.clients = updatedClients; // Оновлюємо локальний стан
        },

        async addPropertyToList(listId, propertyId) {
            const listRef = doc(db, 'propertyLists', listId);
            const listDoc = await getDoc(listRef);

            if (listDoc.exists()) {
                const properties = listDoc.data().properties || [];
                if (!properties.includes(propertyId)) {
                    await updateDoc(listRef, {
                        properties: [...properties, propertyId]
                    });
                }
            }
        },

        async addAdToPropertyList(listId, propertyId, ad) {
            console.log('listId:', listId, 'ad:', ad);
            const listRef = doc(db, 'propertyLists', listId);
            const listDoc = await getDoc(listRef);

            // Create property object with additional data
            const propertyObject = {
                propertyId,
                category: ad.category,
                subcategory: ad.subcategory
            };

            if (listDoc.exists()) {
                const properties = listDoc.data().properties || [];

                // Check if property already exists using propertyId
                const propertyExists = properties.some(
                    prop => typeof prop === 'object'
                        ? prop.propertyId === propertyId
                        : prop === propertyId
                );

                if (!propertyExists) {
                    await updateDoc(listRef, {
                        properties: [...properties, propertyObject]
                    });
                }
            }
        }
    }
});
