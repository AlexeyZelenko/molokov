import { reactive } from 'vue';
import { db, storage } from '@/firebase/config';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import compressWithCompressor from '@/service/Compressor';
import { HouseSell, HouseRent, HouseRentDaily, HouseExchange } from '@/models/Property/House';
import { ApartmentSell, ApartmentExchange, ApartmentRent, ApartmentRentDaily} from '@/models/Property/Apartment';
import { OfficeSell, OfficeExchange, OfficeRent, OfficeRentDaily} from '@/models/Property/Office';
import { LandSell, LandExchange, LandRent, LandRentDaily} from '@/models/Property/Land';
import { CommercialSell, CommercialExchange, CommercialRent, CommercialRentDaily} from '@/models/Property/Commercial';
import { OtherSell, OtherExchange, OtherRent, OtherRentDaily} from '@/models/Property/Other';
import { RoomSell, RoomExchange, RoomRent, RoomRentDaily} from '@/models/Property/Rooms';
import { GarageSell, GarageExchange, GarageRent, GarageRentDaily} from '@/models/Property/Garages';

export class PropertyManager {
    constructor(authStore, store, toast) {
        this.authStore = authStore;
        this.store = store;
        this.toast = toast;
        this.contact = authStore.user;

        this.property = reactive(this.getInitialState('houses-sell'));
    }

    static modelMap = {
        houses: {
            sell: HouseSell,
            rent: HouseRent,
            daily: HouseRentDaily,
            exchange: HouseExchange
        },
        apartments: {
            sell: ApartmentSell,
            rent: ApartmentRent,
            daily: ApartmentRentDaily,
            exchange: ApartmentExchange
        },
        offices: {
            sell: OfficeSell,
            rent: OfficeRent,
            daily: OfficeRentDaily,
            exchange: OfficeExchange
        },
        land: {
            sell: LandSell,
            rent: LandRent,
            daily: LandRentDaily,
            exchange: LandExchange
        },
        commercial: {
            sell: CommercialSell,
            rent: CommercialRent,
            daily: CommercialRentDaily,
            exchange: CommercialExchange
        },
        other: {
            sell: OtherSell,
            rent: OtherRent,
            daily: OtherRentDaily,
            exchange: OtherExchange
        },
        rooms: {
            sell: RoomSell,
            rent: RoomRent,
            daily: RoomRentDaily,
            exchange: RoomExchange
        },
        garages: {
            sell: GarageSell,
            rent: GarageRent,
            daily: GarageRentDaily,
            exchange: GarageExchange
        },
    };

    getInitialState(propertyType) {
        const [category, subcategory] = propertyType.split('-');

        // Безопасная проверка
        if (!PropertyManager.modelMap[category]) {
            console.warn(`Категория ${category} не найдена, используется значение по умолчанию`);
            return new ApartmentSell();
        }

        const ModelClass = PropertyManager.modelMap[category]?.[subcategory] || ApartmentSell;
        return new ModelClass();
    }

    setPropertyType(propertyType) {
        const { images, address } = this.property;

        // Обновляем объект без потери реактивности
        Object.assign(this.property, this.getInitialState(propertyType));

        // Восстанавливаем данные, которые нужно сохранить
        this.property.images = images;
        this.property.address = address;
    };

    resetForm(propertyType) {
        this.getInitialState(propertyType);

        this.property.images = [];
    }

    async removeImage(imageUrl) {
        try {
            const imagePath = decodeURIComponent(new URL(imageUrl).pathname).split('/o/')[1].split('?')[0];
            const imageRef = storageRef(storage, imagePath);
            await deleteObject(imageRef);

            this.property.images = this.property.images.filter(url => url !== imageUrl);
            this.toast.add({ severity: 'success', summary: 'Deleted', detail: 'Зображення успішно видалено', life: 3000 });
        } catch (error) {
            console.error('Error deleting image:', error);
            this.toast.add({ severity: 'error', summary: 'Error', detail: 'Не вдалося видалити зображення', life: 3000 });
        }
    }

    async uploadImages(files) {
        const startTime = Date.now();
        const uploadLogs = [];

        if (!files || files.length === 0) {
            this.toast.add({ severity: 'error', summary: 'Error', detail: 'Файли не вибрані', life: 3000 });
            return;
        }

        const validFiles = files.filter(file => {
            const isValidType = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
            const isValidSize = file.size <= 10 * 1024 * 1024;

            if (!isValidType) uploadLogs.push(`Невірний тип файлу: ${file.name}`);
            if (!isValidSize) uploadLogs.push(`Файл занадто великий: ${file.name}`);

            return isValidType && isValidSize;
        });

        if (validFiles.length === 0) {
            this.toast.add({ severity: 'error', summary: 'Error', detail: 'Немає файлів для завантаження', life: 3000 });
            return;
        }

        const uploadPromises = validFiles.map(async (file) => {
            try {
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
    }

    getFormattedDescription() {
        return this.property.description.replace(/\n/g, '<br>').replace(/ {2,}/g, match => '&nbsp;'.repeat(match.length));
    }

    async saveProperty() {
        try {
            let utilitiesObject = {};
            if(this.property.utilities) {
                utilitiesObject = this.property.utilities.reduce((acc, current) => {
                    acc[current.key] = current;
                    return acc;
                }, {});
            } else {
                utilitiesObject = {};
            }


            const lastPropertyId = await this.store.getLastPropertyId;
            const propertyData = {
                ...this.property,
                utilities: utilitiesObject,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                idProperty: Number(lastPropertyId) + 1,
                description: this.getFormattedDescription(),
                creator: {
                    id: this.contact?.id || this.contact?.uid || null,
                    username: this.contact?.name || null,
                    email: this.contact?.email || null,
                    phone: this.contact?.phones || null,
                    message: this.property?.creator?.message || null
                }
            };
            await addDoc(collection(db, `properties/${this.property.category.code}/${this.property.subcategory.code}`), propertyData);
            await this.store.updateLastPropertyId(lastPropertyId + 1);

            const propertyType = `${this.property.category.code}-${this.property.subcategory.code}`;
            this.resetForm(propertyType);

            this.toast.add({ severity: 'success', summary: 'Успішно', detail: 'Об\'єкт додано', life: 3000 });
        } catch (error) {
            console.error('Error saving property:', error);
            this.toast.add({ severity: 'error', summary: 'Помилка', detail: 'Помилка збереження об\'єкту', life: 3000 });
        }
    }
}
