import { defineStore } from 'pinia';
import { auth, db } from '@/firebase/config';
import { doc, getDoc, updateDoc, collection, addDoc, query, where, getDocs, serverTimestamp, getFirestore, deleteDoc, setDoc } from 'firebase/firestore';

export const useUserStore = defineStore('user', {
    state: () => ({
        profile: null,
        propertyLists: [],
        user: null,
        clients: [],
        loading: false,
        error: null,
        users: [],
        selectedAgent: null,
        userTypes: [
            {
                id: 'guest',
                role: 'guest',
                name: 'Гість',
                description: 'Незареєстрований користувач, може переглядати оголошення та залишати заявки.',
                permissions: ['view_properties', 'send_contact_form'],
                isDefault: true,
                isEditable: false,
                isRemovable: false,
                showOnRegistration: false
            },
            {
                id: 'buyer',
                role: 'buyer',
                name: 'Покупець / Орендар',
                description: 'Зареєстрований користувач для пошуку та збереження нерухомості.',
                permissions: ['view_properties', 'save_favorites', 'contact_agent', 'receive_notifications'],
                isDefault: false,
                isEditable: false,
                isRemovable: false,
                showOnRegistration: true
            },
            {
                id: 'seller',
                role: 'seller',
                name: 'Продавець / Орендодавець',
                description: 'Користувач, який може додавати та керувати власними оголошеннями.',
                permissions: ['create_listing', 'edit_listing', 'view_listing_stats', 'communicate_with_users'],
                isDefault: false,
                isEditable: false,
                isRemovable: false,
                showOnRegistration: true
            },
            {
                id: 'agent',
                role: 'agent',
                name: 'Агент / Рієлтор',
                description: 'Представник агентства, який працює з оголошеннями клієнтів.',
                permissions: ['manage_client_listings', 'chat_with_clients', 'view_analytics'],
                isDefault: false,
                isEditable: false,
                isRemovable: false,
                showOnRegistration: true
            },
            {
                id: 'agency_owner',
                role: 'agency_owner',
                name: 'Власник агентства нерухомості',
                description: 'Користувач з повним контролем над агентством, його агентами та оголошеннями.',
                permissions: ['manage_agency_profile', 'add_agents', 'remove_agents', 'view_agency_analytics', 'approve_listings', 'view_all_clients', 'assign_roles', 'manage_payments'],
                isDefault: false,
                isEditable: false,
                isRemovable: false,
                showOnRegistration: true
            },
            {
                id: 'admin',
                role: 'admin',
                name: 'Адміністратор',
                description: 'Модератор або адміністратор платформи з повним доступом.',
                permissions: ['manage_users', 'moderate_content', 'view_full_analytics', 'assign_roles'],
                isDefault: false,
                isEditable: false,
                isRemovable: false,
                showOnRegistration: false
            },
            {
                id: 'developer',
                role: 'developer',
                name: 'Розробник',
                description: 'Технічний користувач для підтримки та розвитку платформи.',
                permissions: ['access_dev_tools', 'view_logs', 'manage_system'],
                isDefault: false,
                isEditable: false,
                isRemovable: false,
                showOnRegistration: false
            },
            {
                id: 'super_admin',
                role: 'super_admin',
                name: 'Супер адміністратор',
                description: 'Користувач з повним контролем над усіма аспектами платформи.',
                permissions: ['manage_all_users', 'access_all_data', 'system_configuration'],
                isDefault: false,
                isEditable: false,
                isRemovable: false,
                showOnRegistration: false
            },
            {
                id: 'moderator',
                role: 'moderator',
                name: 'Модератор',
                description: 'Користувач, відповідальний за перевірку та модерацію контенту.',
                permissions: ['moderate_content', 'view_reports'],
                isDefault: false,
                isEditable: false,
                isRemovable: false,
                showOnRegistration: false
            },
            {
                id: 'blocked',
                role: 'blocked',
                name: 'Заблокований',
                description: 'Користувач, який порушив правила платформи.',
                permissions: ['view_properties'],
                isDefault: false,
                isEditable: false,
                isRemovable: false,
                showOnRegistration: false
            }
        ]
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
            if (this.profile?.role?.id === 'admin') {
                await updateDoc(doc(db, 'users', data.id), data);
                this.profile = { ...this.profile, ...data };
            } else {
                await updateDoc(doc(db, 'users', auth.currentUser.uid), data);
                this.profile = { ...this.profile, ...data };
            }
        },

        async createPropertyList({ name, client, properties, category, subcategory }) {
            if (!auth.currentUser) return;

            const newList = {
                userId: auth.currentUser.uid,
                name,
                client,
                properties: properties || [],
                createdAt: new Date(),
                category,
                subcategory
            };

            const docRef = await addDoc(collection(db, 'propertyLists'), newList);
            this.propertyLists.push({ id: docRef.id, ...newList });
        },

        async deletePropertyList(listId) {
            try {
                const listRef = doc(db, 'propertyLists', listId);
                await deleteDoc(listRef);
                // Обновляем локальный список
                this.propertyLists = this.propertyLists.filter((list) => list.id !== listId);
            } catch (error) {
                console.error('Error deleting property list:', error);
                throw error;
            }
        },

        async fetchPropertyLists() {
            if (!auth.currentUser) return;

            const q = query(collection(db, 'propertyLists'), where('userId', '==', auth.currentUser.uid));

            const querySnapshot = await getDocs(q);
            this.propertyLists = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));
        },

        async fetchUserAndClients() {
            this.loading = true;
            try {
                const userId = auth.currentUser?.uid;

                // Отримати дані користувача та клієнтів паралельно
                const [userDoc, clientsSnapshot] = await Promise.all([getDoc(doc(db, 'users', userId)), getDocs(collection(db, 'users', userId, 'clients'))]);

                if (userDoc.exists()) {
                    this.user = { id: userDoc.id, ...userDoc.data() };
                } else {
                    throw new Error('Дані користувача не знайдено');
                }

                const clients = [];
                clientsSnapshot.forEach((doc) => {
                    clients.push({
                        id: doc.id,
                        ...doc.data()
                    });
                });

                this.clients = clients;

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

            try {
                const db = getFirestore();
                if (!userId) return;
                const userRef = doc(db, 'users', userId);
                const userDoc = await getDoc(userRef);

                if (userDoc.exists()) {
                    this.user = {
                        id: userDoc.id,
                        ...userDoc.data()
                    };
                }
            } catch (error) {
                console.error('Failed to fetch user:', error);
                this.error = error.message;
                throw error;
            }
            this.loading = false;
        },

        async getClients() {
            try {
                const userId = auth.currentUser?.uid;

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

                return clients;
            } catch (error) {
                console.error('Помилка при отриманні клієнтів:', error);
                throw error;
            }
        },

        async addClient(client) {
            try {
                const userId = auth.currentUser?.uid;

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

                this.clients.push(newClient);
                return newClient;
            } catch (error) {
                console.error('Помилка при додаванні клієнта:', error);
                throw error;
            }
        },

        async updateClient(clientId, updatedData) {
            const userId = auth.currentUser?.uid;

            // Посилання на документ клієнта в Firestore
            const clientRef = doc(db, 'users', userId, 'clients', clientId);

            try {
                // Оновлюємо документ клієнта в Firestore
                await updateDoc(clientRef, updatedData);

                // Оновлюємо локальний стан клієнтів
                const updatedClients = this.clients.map((client) => (client.id === clientId ? { ...client, ...updatedData } : client));

                this.clients = updatedClients; // Оновлюємо локальний стан
            } catch (error) {
                console.error('Помилка при оновленні клієнта:', error);
                throw error; // Передаємо помилку далі для обробки
            }
        },

        async deleteClient(clientId) {
            const userId = auth.currentUser?.uid;

            // Посилання на документ клієнта в Firestore
            const clientRef = doc(db, 'users', userId, 'clients', clientId);

            try {
                // Видаляємо документ клієнта з Firestore
                await deleteDoc(clientRef);

                // Оновлюємо локальний стан клієнтів
                const updatedClients = this.clients.filter((client) => client.id !== clientId);
                this.clients = updatedClients; // Оновлюємо локальний стан
            } catch (error) {
                console.error('Помилка при видаленні клієнта:', error);
                throw error; // Передаємо помилку далі для обробки
            }
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
                const propertyExists = properties.some((prop) => (typeof prop === 'object' ? prop.propertyId === propertyId : prop === propertyId));

                if (!propertyExists) {
                    await updateDoc(listRef, {
                        properties: [...properties, propertyObject]
                    });
                }
            }
        },

        async fetchUsers() {
            try {
                this.loading = true;
                this.error = null;
                const querySnapshot = await getDocs(collection(db, 'users'));
                this.users = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                }));
                return this.users;
            } catch (err) {
                console.error('Failed to fetch users:', err);
                this.error = err.message;
                throw err;
            } finally {
                this.loading = false;
            }
        },

        async updateUserRole(userId, newRole) {
            try {
                this.loading = true;
                this.error = null;

                // First check if the user document exists
                const userRef = doc(db, 'users', userId);
                const userDoc = await getDoc(userRef);

                if (!userDoc.exists()) {
                    // If the document doesn't exist, create it with the new role
                    await setDoc(userRef, {
                        role: newRole,
                        email: this.users.find((u) => u.id === userId)?.email || ''
                    });
                } else {
                    // Update the existing document
                    await updateDoc(userRef, {
                        role: newRole
                    });
                }

                // Refresh the users list
                await this.fetchUsers();
            } catch (err) {
                console.error('Failed to update role:', err);
                this.error = err.message;
                throw new Error(err.message || 'Failed to update user role');
            } finally {
                this.loading = false;
            }
        },

        clearUserData() {
            this.profile = null;
            this.propertyLists = [];
            this.user = null;
            this.clients = [];
            this.loading = false;
        },

        setSelectedAgent(selectedAgent) {
            this.selectedAgent = selectedAgent;
        }
    }
});
