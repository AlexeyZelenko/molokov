import { defineStore } from 'pinia';
import { ref } from 'vue';
import { db, storage } from '@/firebase/config';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

export const usePropertyStore = defineStore('property', () => {
    const property = ref({
        title: '',
        price: null,
        area: null,
        rooms: null,
        floor: null,
        totalFloors: null,
        district: '',
        street: '',
        houseNumber: '',
        constructionYear: null,
        wallMaterial: null,
        heatingType: null,
        condition: null,
        balconyCount: 0,
        hasParking: false,
        hasElevator: false,
        hasFurniture: false,
        description: '',
        images: [],
        category: '',
        subcategory: '',
    });

    const loading = ref(true);
    const saving = ref(false);

    const wallMaterials = [
        { name: 'Цегла', value: 'brick' },
        { name: 'Панель', value: 'panel' },
        { name: 'Моноліт', value: 'monolith' },
        { name: 'Піноблок', value: 'foamBlock' }
    ];

    const heatingTypes = [
        { name: 'Централізоване', value: 'central' },
        { name: 'Автономне', value: 'autonomous' },
        { name: 'Індивідуальне', value: 'individual' }
    ];

    const conditions = [
        { name: 'Євроремонт', value: 'euro' },
        { name: 'Житловий стан', value: 'living' },
        { name: 'Потребує ремонту', value: 'needsRepair' },
        { name: 'Від забудовника', value: 'developer' }
    ];

    const getProperty = async (propertyId) => {
        console.log('Fetching property:', propertyId);
        loading.value = true;
        try {
            const docRef = doc(db, 'properties', propertyId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                property.value = { id: docSnap.id, ...docSnap.data() };
                console.log('Property fetched:', property.value);
            } else {
                throw new Error('Property not found');
            }
        } catch (error) {
            console.error('Error fetching property:', error);
        } finally {
            loading.value = false;
            console.log('Property loaded:', loading.value);
        }
    };

    const updateProperty = async () => {
        try {
            saving.value = true;
            const propertyId = property.value.id;
            const docRef = doc(db, 'properties', propertyId);

            const propertyData = {
                ...property.value,
                updatedAt: serverTimestamp()
            };

            delete propertyData.id;
            await updateDoc(docRef, propertyData);
        } catch (error) {
            console.error('Error updating property:', error);
        } finally {
            saving.value = false;
        }
    };

    const onFileSelect = async (event) => {
        try {
            const files = event.files;
            for (let file of files) {
                const storageReference = storageRef(storage, `properties/${Date.now()}_${file.name}`);
                const snapshot = await uploadBytes(storageReference, file);
                const downloadURL = await getDownloadURL(snapshot.ref);
                property.value.images.push(downloadURL);
            }
        } catch (error) {
            console.error('Error uploading files:', error);
        }
    };

    const removeImage = async (index) => {
        try {
            const imageUrl = property.value.images[index];
            const imagePath = imageUrl.split('properties%2F')[1].split('?')[0];
            const imageRef = storageRef(storage, `properties/${imagePath}`);

            await deleteObject(imageRef);
            property.value.images.splice(index, 1);
        } catch (error) {
            console.error('Error removing image:', error);
        }
    };

    return {
        property,
        loading,
        saving,
        wallMaterials,
        heatingTypes,
        conditions,
        getProperty,
        updateProperty,
        onFileSelect,
        removeImage
    };
});
