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
    getDocs
} from 'firebase/firestore';

export const useUserStore = defineStore('user', {
    state: () => ({
        profile: null,
        propertyLists: []
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

        async createPropertyList(name, clientName) {
            if (!auth.currentUser) return;

            const newList = {
                userId: auth.currentUser.uid,
                name,
                clientName,
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
        }
    }
});
