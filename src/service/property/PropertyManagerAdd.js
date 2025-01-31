import { reactive } from 'vue';
import { db, storage } from '@/firebase/config';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import compressWithCompressor from '@/service/Compressor';
import { HouseSell, HouseRent, HouseRentDaily, HouseExchange } from '@/models/Property/House';
import { ApartmentSell, ApartmentExchange, ApartmentRent, ApartmentRentDaily} from '@/models/Property/Apartment';

export class PropertyManager {
    constructor(authStore, store, toast) {
        this.authStore = authStore;
        this.store = store;
        this.toast = toast;
        this.contact = authStore.user;

        this.property = reactive(this.getInitialState('houses-sell'));
    }

    getInitialState(propertyType) {
        console.log("propertyType >>", propertyType);
        const modelMap = {
            'houses-sell': () => new HouseSell(),
            'houses-rent': () => new HouseRent(),
            'houses-daily': () => new HouseRentDaily(),
            'houses-exchange': () => new HouseExchange(),
            'apartment-sell': () => new ApartmentSell(),
            'apartment-rent': () => new ApartmentRent(),
            'apartment-daily': () => new ApartmentRentDaily(),
            'apartment-exchange': () => new ApartmentExchange()
        };

        return modelMap[propertyType] ? modelMap[propertyType]() : new ApartmentSell();
    };


    setPropertyType(propertyType) {
        console.log("propertyType", propertyType);
        const currentImages = this.property.images;
        const currentAddress = this.property.address;

        // Обновляем объект без потери реактивности
        Object.assign(this.property, this.getInitialState(propertyType));

        console.log("this.property", this.property);

        // Восстанавливаем данные, которые нужно сохранить
        this.property.images = currentImages;
        this.property.address = currentAddress;
    };


    resetForm(propertyType) {
        this.setPropertyType(propertyType);
        this.property.images = [];
    }

    async removeImage(imageUrl) {
        try {
            const imagePath = decodeURIComponent(new URL(imageUrl).pathname).split('/o/')[1].split('?')[0];
            const imageRef = storageRef(storage, imagePath);

            await deleteObject(imageRef);
            const index = this.property.images.findIndex(url => url === imageUrl);
            if (index !== -1) {
                this.property.images.splice(index, 1);
            }

            this.toast.add({ severity: 'success', summary: 'Deleted', detail: 'Зображення успішно видалено', life: 3000 });
        } catch (error) {
            console.error('Error deleting image:', error);
            this.toast.add({ severity: 'error', summary: 'Error', detail: 'Не вдалося видалити зображення', life: 3000 });
        }
    }

    async uploadImages(files) {
        const startTime = Date.now();
        const uploadLogs = [];

        try {
            if (!files || files.length === 0) {
                throw new Error("Файли не вибрані");
            }

            const validFiles = files.filter(file => {
                const isValidType = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
                const isValidSize = file.size <= 10 * 1024 * 1024;

                if (!isValidType) uploadLogs.push(`Невірний тип файлу: ${file.name}`);
                if (!isValidSize) uploadLogs.push(`Файл занадто великий: ${file.name}`);

                return isValidType && isValidSize;
            });

            if (validFiles.length === 0) {
                throw new Error('Немає файлів для завантаження');
            }

            const uploadPromises = validFiles.map(async (file) => {
                try {
                    const fileStartTime = Date.now();
                    const compressedFile = await compressWithCompressor(file);

                    const storageReference = storageRef(storage, `properties/${Date.now()}_${file.name}`);
                    const snapshot = await uploadBytes(storageReference, compressedFile);
                    const downloadURL = await getDownloadURL(snapshot.ref);

                    uploadLogs.push(`Завантаження успішне: ${file.name}`);
                    return downloadURL;
                } catch (error) {
                    uploadLogs.push(`Помилка завантаження: ${file.name} - ${error.message}`);
                    throw error;
                }
            });

            const uploadedUrls = await Promise.allSettled(uploadPromises);

            const successfulUploads = uploadedUrls
                .filter(result => result.status === 'fulfilled')
                .map(result => result.value);

            this.property.images.push(...successfulUploads);

            const totalTime = Date.now() - startTime;
            const successCount = successfulUploads.length;
            const totalFiles = files.length;


            this.toast.add({
                severity: successCount === totalFiles ? 'success' : 'warn',
                summary: 'Завантаження файлів',
                detail: `Завантажено ${successCount}/${totalFiles} файлів за ${totalTime}ms`,
                life: 5000
            });

        } catch (error) {
            this.toast.removeGroup('headless');
            console.error('Помилка завантаження файлів:', error);
            this.toast.add({
                severity: 'error',
                summary: 'Помилка завантаження',
                detail: `Деталі: ${error.message}`,
                life: 5000
            });
        }
    }

    updateMarkerPosition(position) {
        this.property.address.markerPosition = position;
    }

    getFormattedDescription() {
        return this.property.description.replace(/\n/g, '<br>').replace(/ {2,}/g, match => '&nbsp;'.repeat(match.length));
    }

    async saveProperty() {
        console.log("this.property", this.property);
        try {
            const utilitiesObject = this.property.utilities.reduce((acc, current) => {
                acc[current.key] = current;
                return acc;
            }, {});

            const lastPropertyId = await this.store.getLastPropertyId;

            console.log("this.property - save >>", this.property, this.contact);
            const propertyData = {
                ...this.property,
                utilities: utilitiesObject,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                idProperty: Number(lastPropertyId) + 1,
                description: this.getFormattedDescription(),
                creator: {
                    id: this.contact.id || this.contact.uid || null,
                    username: this.contact.displayName || null,
                    email: this.contact.email || null,
                    phone: this.contact.phones || null,
                    message: this.property.creator?.message || null
                }
            };
            console.log("propertyData", propertyData);

            await addDoc(collection(db, `properties/${this.property.category.code}/${this.property.subcategory.code}`), propertyData);
            await this.store.updateLastPropertyId(lastPropertyId + 1);

            // Сбрасываем форму используя новую функцию
            const propertyType = this.property.category.code + '-' + this.property.subcategory.code;
            this.resetForm(propertyType);

            this.toast.add({ severity: 'success', summary: 'Успішно', detail: 'Об\'єкт додано', life: 3000 });
        } catch (error) {
            console.error('Error saving property:', error);
            this.toast.add({ severity: 'error', summary: 'Помилка', detail: 'Помилка збереження об\'єкту', life: 3000 });
        }
    }
}
