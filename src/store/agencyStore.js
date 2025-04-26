import { defineStore } from 'pinia';
import { db, storage } from '@/firebase/config';
import { collection, addDoc, doc, updateDoc, deleteDoc, getDocs, getDoc } from 'firebase/firestore';
import { ref as storageRef, deleteObject } from 'firebase/storage';

export const useAgencyStore = defineStore('agency', {
    state: () => ({
        agencies: [],
        loading: false,
        error: null
    }),
    actions: {
        async createAgency(agencyData) {
            this.loading = true;
            this.error = null;

            try {
                // Создаём документ
                const docRef = await addDoc(collection(db, 'agencies'), agencyData);

                // Обновляем тот же документ, добавляя ID внутрь
                await updateDoc(doc(db, 'agencies', docRef.id), {
                    id: docRef.id
                });

                return {
                    id: docRef.id,
                    ...agencyData
                };
            } catch (error) {
                this.error = error.message;
                console.error('Error creating agency:', error);
                throw error;
            } finally {
                this.loading = false;
            }
        },
        async updateAgency(agencyId, agencyData) {
            this.loading = true;
            this.error = null;
            try {
                const agencyDocRef = doc(db, 'agencies', agencyId);
                await updateDoc(agencyDocRef, agencyData);
            } catch (error) {
                this.error = error.message;
                console.error('Error updating agency:', error);
                throw error;
            } finally {
                this.loading = false;
            }
        },
        async deleteAgency(agencyId) {
            this.loading = true;
            this.error = null;
            const agencyDocRef = doc(db, 'agencies', agencyId);

            try {
                const agencyDocSnap = await getDoc(agencyDocRef);

                if (agencyDocSnap.exists()) {
                    const agencyData = agencyDocSnap.data();

                    if (agencyData.logoUrl) {
                        try {
                            const imageUrl = agencyData.logoUrl;

                            const bucketName = storage.config.storageBucket; // Використовуйте optional chaining
                            const baseUrl = "https://firebasestorage.googleapis.com/v0/b/";

                            const pathStartIndex = imageUrl.indexOf(`/o/`);
                            const pathEndIndex = imageUrl.indexOf('?');

                            if (pathStartIndex !== -1 && pathEndIndex !== -1 && bucketName && imageUrl.startsWith(baseUrl + bucketName + '/o/')) {
                                const encodedPath = imageUrl.substring(pathStartIndex + 3, pathEndIndex);
                                const filePath = decodeURIComponent(encodedPath);

                                const imageRef = storageRef(storage, filePath);
                                await deleteObject(imageRef);

                            } else {
                                // Цей блок буде виконано, якщо bucketName undefined або URL не відповідає очікуваному формату
                                console.warn('Could not parse storage path from URL or bucket name missing in config. URL:', imageUrl, 'BucketName from config:', bucketName);
                                // Якщо ви впевнені, що URL завжди стандартний, можна спробувати витягти бакет напряму з URL тут для логування або подальшої діагностики
                                const bucketMatch = imageUrl.match(/firebasestorage\.googleapis\.com\/v0\/b\/([^/]+)\/o\//);
                                if(bucketMatch && bucketMatch[1]){
                                    console.warn('Bucket name extracted from URL:', bucketMatch[1]);
                                }

                            }

                        } catch (storageError) {
                            console.error('Error deleting image from Storage (may not be critical):', storageError);
                        }
                    }

                    await deleteDoc(agencyDocRef);
                    console.log('Agency document successfully deleted:', agencyId);
                    this.agencies = this.agencies.filter(agency => agency.id !== agencyId);

                } else {
                    console.warn('Agency document not found:', agencyId);
                }

            } catch (firestoreError) {
                this.error = firestoreError.message;
                console.error('Error deleting agency document:', firestoreError);
                throw firestoreError;
            } finally {
                this.loading = false;
            }
        },
        async fetchAgencies() {
            this.loading = true;
            this.error = null;
            try {
                const querySnapshot = await getDocs(collection(db, 'agencies'));
                this.agencies = querySnapshot.docs.map((doc) => ({
                    id: doc.id, // Include the document ID
                    ...doc.data()
                }));
            } catch (error) {
                this.error = error.message;
                console.error('Error fetching agencies:', error);
            } finally {
                this.loading = false;
            }
        },
        getAgencyById(id) {
            return this.agencies.find((agency) => agency.id === id);
        },
        async fetchAgencyById(id) {
            this.isLoading = true;
            this.error = null;
            try {
                // Отримуємо посилання на документ за ID
                const agencyDocRef = doc(db, 'agencies', id);

                // Отримуємо сам документ
                const agencyDocSnap = await getDoc(agencyDocRef);

                if (agencyDocSnap.exists()) {
                    // Документ існує, повертаємо його дані разом з ID
                    const agencyData = agencyDocSnap.data();
                    this.isLoading = false;
                    return { id: agencyDocSnap.id, ...agencyData };
                } else {
                    // Документ не знайдено
                    this.isLoading = false;
                    console.warn(`Agency with ID ${id} not found.`);
                    return null;
                }
            } catch (err) {
                this.isLoading = false;
                this.error = err;
                console.error(`Error fetching agency by ID ${id}:`, err);
                throw err; // Перекидаємо помилку для обробки в компоненті
            }
        }
    }
});
