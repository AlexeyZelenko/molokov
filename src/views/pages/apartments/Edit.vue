<template>
    <h1>{{ isEdit ? 'Редагувати об\'єкт нерухомості' : 'Додати об\'єкт нерухомості' }}</h1>
    <Form v-slot="$form" @submit="saveProperty">
        <Fluid class="flex flex-col md:flex-row gap-8">
            <div class="md:w-1/2">
                <div class="card flex flex-col gap-4"  >
                    <div class="font-semibold text-xl">Назва</div>
                    <FloatLabel>
                        <InputText id="username" type="text" v-model="property.title" required />
                        <label for="username">Назва оголошення</label>
                        <Message
                            v-if="$form.username?.invalid"
                            severity="error" size="small"
                            variant="simple">
                            {{ $form.username.error?.message }}
                        </Message>
                    </FloatLabel>
                    <div class="font-semibold text-xl">Тип нерухомості</div>
                    <Select v-model="property.category" :options="dropdowns.category" optionLabel="name" placeholder="Select" />
                    <div class="font-semibold text-xl">Мета використання</div>
                    <Select v-model="property.subcategory" :options="dropdowns.subcategory" optionLabel="name" placeholder="Select" />

                    <div class="font-semibold text-xl">Вартість</div>
                    <InputGroup>
                        <InputGroupAddon>грн</InputGroupAddon>
                        <InputNumber
                            v-model="property.price"
                            :class="{ 'p-invalid': property.price }"
                            showButtons
                            mode="decimal"
                            :min="0"
                            required
                        />
                        <InputGroupAddon>.00</InputGroupAddon>
                    </InputGroup>
                    <PriceConverter
                        :price="property.price"
                        :subcategory="property.subcategory"
                    />
                </div>

                <div class="card flex flex-col gap-4">
                    <div class="font-semibold text-xl">Розташування</div>
                    <div class="font-semibold text-sm">Область</div>
                    <Select v-model="property.address.region" :options="dropdowns.regions" optionLabel="name" placeholder="Select" />

                    <div class="font-semibold text-sm">Місто</div>
                    <Select
                        v-if="property.address.region && property.address.region.code === 'CHK'"
                        v-model="property.address.city"
                        :options="dropdowns.cities"
                        optionLabel="name"
                        placeholder="Виберіть місто"
                    />
                    <InputText
                        v-else
                        v-model="property.address.city"
                        placeholder="Місто"
                    />

                    <div class="font-semibold text-sm">Вулиця</div>
                    <InputText v-model="property.address.street" placeholder="Вулиця" />

                    <template v-if="property.address.city && property.address.city.code === '1'">
                        <div class="font-semibold text-sm">Мікрорайон міста Черкаси</div>
                        <Select v-model="property.address.area" :options="dropdowns.areas" optionLabel="name" placeholder="Select" />
                    </template>

<!--                    <GoogleMapAddApartment-->
<!--                        style="width: 100%; height: 500px"-->
<!--                        :area="property.address.area"-->
<!--                        :center="property.address.markerPosition"-->
<!--                        :disabled="true"-->
<!--                    />-->

                    <MapWithMarkerEdit
                        v-if="property.address.markerPosition"
                        :area="property.address.area"
                        :property="property"
                        :marker="property.address.markerPosition ?? [49.4444, 32.0598]"
                        v-model:marker="property.address.markerPosition"
                    />

                </div>
                <div class="card flex flex-col gap-4">
                    <div class="font-semibold text-xl">Площа(м²)</div>
                    <div class="font-semibold text-sm">Загальна площа</div>
                    <InputNumber v-model="property.apartmentArea.totalArea"  showButtons mode="decimal" required></InputNumber>

                    <div class="font-semibold text-sm">Жила площа квартири</div>
                    <InputNumber v-model="property.apartmentArea.livingArea"  showButtons mode="decimal" required></InputNumber>

                    <div class="font-semibold text-sm">Площа кухні</div>
                    <InputNumber v-model="property.apartmentArea.kitchenArea"  showButtons mode="decimal" required></InputNumber>
                </div>

                <div class="card flex flex-col gap-4">
                    <div class="font-semibold text-xl">Тип опалення</div>
                    <Select v-model="property.heatingType" :options="dropdowns.heatingTypes" optionLabel="name" placeholder="Вибрати" />
                </div>

                <div class="card flex flex-col gap-4">
                    <div class="font-semibold text-xl">Комунальні послуги</div>
                    <MultiSelect
                        v-model="property.utilities"
                        :options="dropdowns.utilities"
                        optionLabel="name"
                        placeholder="Комунальні послуги"
                        :filter="true"
                    >
                        <template #value="slotProps">
                            <div class="inline-flex items-center py-1 px-2 bg-primary text-primary-contrast rounded-border mr-2" v-for="option of slotProps.value" :key="option.code">
                                <span :class="'mr-2 flag flag-' + option.code.toLowerCase()" style="width: 18px; height: 12px" />
                                <div>{{ option.name }}</div>
                            </div>
                            <template v-if="!slotProps.value || slotProps.value.length === 0">
                                <div class="p-1">Вибрати комунальні послуги</div>
                            </template>
                        </template>
                        <template #option="slotProps">
                            <div class="flex items-center">
                                <span :class="'mr-2 flag flag-' + slotProps.option.code.toLowerCase()" style="width: 18px; height: 12px" />
                                <div>{{ slotProps.option.name }}</div>
                            </div>
                        </template>
                    </MultiSelect>
                </div>

                <div class="card flex flex-col gap-4">
                    <div class="font-semibold text-xl">Меблі</div>
                    <Select v-model="property.furniture" :options="dropdowns.furniture" optionLabel="name" placeholder="Вибрати" />
                </div>

                <div class="card flex flex-col gap-4">
                    <div class="font-semibold text-xl">Паркування</div>
                    <Select v-model="property.parking" :options="dropdowns.parking" optionLabel="name" placeholder="Вибрати" />
                </div>

                <div class="card flex flex-col gap-4">
                    <div class="font-semibold text-xl">Балкон / Тераса</div>
                    <Select v-model="property.balconyTerrace" :options="dropdowns.balconyTerrace" optionLabel="name" placeholder="Вибрати" />
                </div>
            </div>
            <div class="md:w-1/2">
                <div class="card flex flex-col gap-4">
                    <div class="font-semibold text-xl">Поверховість</div>
                    <div class="font-semibold text-sm">Поверх</div>
                    <InputNumber v-model="property.floors.floor"  showButtons mode="decimal" required></InputNumber>

                    <div class="font-semibold text-sm">Поверховість будівлі</div>
                    <InputNumber v-model="property.floors.totalFloorsBuilding"  showButtons mode="decimal" required></InputNumber>

                    <div class="font-semibold text-sm">Кількість поверхів у приміщенні</div>
                    <InputNumber v-model="property.floors.totalFloors"  showButtons mode="decimal" required></InputNumber>
                </div>

                <div class="card flex flex-col gap-4">
                    <div class="font-semibold text-xl">Кількість кімнат</div>
                    <div class="font-semibold text-sm">Кількість кімнат</div>
                    <InputNumber v-model="property.rooms.all"  showButtons mode="decimal" required></InputNumber>

                    <div class="font-semibold text-sm">Кількість спалень</div>
                    <InputNumber v-model="property.rooms.bedrooms"  showButtons mode="decimal" required></InputNumber>

                    <div class="font-semibold text-sm">Кількість санвузлів</div>
                    <InputNumber v-model="property.rooms.bathrooms"  showButtons mode="decimal" required></InputNumber>

                    <div class="font-semibold text-sm">Кількість ванних кімнат</div>
                    <InputNumber v-model="property.rooms.bathrooms"  showButtons mode="decimal" required></InputNumber>

                    <div class="font-semibold text-sm">Кількість кухонь</div>
                    <InputNumber v-model="property.rooms.kitchens"  showButtons mode="decimal" required></InputNumber>
                </div>

                <div class="card flex flex-col gap-4">
                    <div class="font-semibold text-xl">Стан нерухомості</div>
                    <SelectButton v-model="property.condition" :options="dropdowns.conditions" optionLabel="name" />

                    <div class="font-semibold text-xl">Ремонт</div>
                    <Select v-model="property.reconditioning" :options="dropdowns.reconditioning" optionLabel="name" placeholder="Select" />
                </div>

                <div class="card flex flex-col gap-4">
                    <div class="font-semibold text-xl">Тип будівлі</div>
                    <Select v-model="property.buildingType" :options="dropdowns.buildingTypes" optionLabel="name" placeholder="Select" />
                </div>

                <div class="card flex flex-col gap-4">
                    <div class="font-semibold text-xl">Клас об'єкта</div>
                    <Select v-model="property.objectClass" :options="dropdowns.objectClass" optionLabel="name" placeholder="Select" />
                </div>

                <div class="card flex flex-col gap-4">
                    <div class="font-semibold text-xl">Проживання тварин</div>
                    <ToggleButton v-model="property.animal" onLabel="Yes" offLabel="No" :style="{ width: '10em' }" />
                </div>

                <div class="card flex flex-col gap-4">
                    <div class="font-semibold text-xl">Готовність об'єкта</div>
                    <DatePicker :showIcon="true" :showButtonBar="true" v-model="formattedFacilityReadiness" />
                </div>
            </div>
        </Fluid>

        <Fluid class="flex flex-col mt-8">
            <div class="card flex flex-col gap-4 w-full">
                <div class="flex flex-col md:flex-row gap-4">
                    <div class="font-semibold text-xl">Додадковий опис об'єкта</div>
                    <Editor v-model="property.description" editorStyle="height: 320px" />
                </div>
            </div>

            <div class="field col-12">
                <label>Фотографії</label>
                <FileUpload
                    ref="fileUpload"
                    name="advanced"
                    @uploader="onFileSelect"
                    :multiple="true"
                    accept="image/*"
                    :maxFileSize="10000000"
                    customUpload
                    chooseLabel="Обрати"
                    uploadLabel="Завантажити"
                    cancelLabel="Скасувати"
                />

                <div v-if="images.length" class="flex flex-wrap">
                    <div
                        v-for="(imageUrl, index) in images"
                        :key="imageUrl"
                        class="col-3 relative m-4 cursor-move"
                        draggable="true"
                        @dragstart="dragStart($event, index)"
                        @dragover.prevent
                        @dragenter.prevent
                        @drop="drop($event, index)"
                    >
                        <img
                            :src="imageUrl"
                            class="w-full h-auto object-cover border-2"
                            :class="{'border-primary': draggedIndex === index, 'border-transparent': draggedIndex !== index}"
                            style="height: 100px; width: 100px"
                        />
                        <div class="absolute top-0 left-0 bg-black bg-opacity-50 text-white px-2 rounded-br">
                            {{ index + 1 }}
                        </div>
                        <Button
                            icon="pi pi-trash"
                            class="absolute top-0 right-0 p-button-danger p-button-rounded"
                            @click="removeImage(imageUrl)"
                            style="margin-top: -10px; margin-right: -10px"
                        />
                    </div>
                </div>
            </div>
        </Fluid>

        <Fluid class="flex mt-8">
            <div class="flex items-center">
                <div class="font-semibold text-xl mr-2">Опублікувати</div>
                <ToggleSwitch v-model="property.isPublic" />
            </div>
        </Fluid>

        <Fluid class="flex mt-8">
            <div class="card flex flex-col gap-4 w-full">
                <div class="font-semibold text-xl">Власник</div>
                <div class="flex flex-col md:flex-row gap-4">
                    <InputGroup>
                        <InputGroupAddon>
                            <i class="pi pi-user"></i>
                        </InputGroupAddon>
                        <InputText v-model="property.owner.username" placeholder="Username" />
                    </InputGroup>
                    <InputGroup>
                        <InputGroupAddon>
                            <i class="pi pi-phone"></i>
                        </InputGroupAddon>
                        <InputMask
                            id="phone"
                            v-model="property.owner.phone"
                            type="phones"
                            mask="+38(0**) 999-99-99"
                            class="mb-4" fluid
                            placeholder="+38(999) 999-9999"
                        />
                    </InputGroup>
                </div>
                <div class="flex flex-col md:flex-row gap-4">
                    <div class="font-semibold text-xl">Додадково</div>
                    <Textarea v-model="property.owner.message" placeholder="Your Message" :autoResize="true" rows="3" cols="30" />
                </div>
            </div>
        </Fluid>

        <Fluid class="flex mt-8">
            <div class="field max-w-60">
                <Button type="submit" label="Зберегти" icon="pi pi-check" :loading="saving" />
            </div>
        </Fluid>
    </Form>

    <Toast />
</template>

<script setup>
import { ref, onBeforeMount, computed, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {db, storage} from '@/firebase/config';
import { doc, getDoc, updateDoc, addDoc, collection, arrayRemove } from 'firebase/firestore';
import {
    ref as storageRef,
    uploadBytes,
    getDownloadURL,
    deleteObject
} from 'firebase/storage';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
import { useApartmentsStore } from '@/store/apartments';
import Select from "primevue/select";
import GoogleMapAddApartment from "@/components/googleMap/AddApartment.vue";
import { formatFirebaseTimestamp } from '@/utils/dateUtils';
import compressWithCompressor from "@/service/Compressor";
import PriceConverter from '@/components/price/PriceConverter.vue';
import MapWithMarkerEdit from "@/components/maps/MapWithMarkerEdit.vue";

// Стейт для дата-пикера
const formattedFacilityReadiness = computed({
    get() {
        return property.value.facilityReadiness
            ? formatFirebaseTimestamp(property.value.facilityReadiness)
            : '';
    },
    set(newValue) {
        const timestamp = new Date(newValue).getTime() / 1000;
        property.value.facilityReadiness = { seconds: timestamp, nanoseconds: 0 };
    }
});

const toast = useToast();
const store = useApartmentsStore();
const saving = ref(false);
const isEdit = ref(false);
const property = ref({
    title: '',
    price: null,
    rooms: {
        all: null,
        bedrooms: null,
        bathrooms: null,
        kitchens: null
    },
    houseNumber: '',
    constructionYear: null,
    heatingType: null,
    condition: null,
    balconyCount: 0,
    description: '',
    images: [],
    category: null,
    subcategory: null,
    createdAt: null,
    updatedAt: null,
    apartmentArea: {
        totalArea: null,
        livingArea: null,
        kitchenArea: null
    },
    floors : {
        floor: null,
        totalFloors: null,
        totalFloorsBuilding: null
    },
    reconditioning: null,
    buildingType: null,
    furniture: null,
    parking: null,
    balconyTerrace: null,
    objectClass: null,
    animal: false,
    facilityReadiness: null,
    public: false,
    address: {
        region: null,
        city: '',
        street: '',
        markerPosition: null
    },
    owner: { username: '', phone: '', message: '' }
});

let dropdowns = reactive([]);
const route = useRoute();
const router = useRouter();
const category = route.query.category;
const subcategory = route.query.subcategory;
const id = route.params.id;

const images = computed(() => property.value.images);
const fileUpload = ref(null)

// Состояние для операций drag-and-drop
const draggedIndex = ref(null);

// Методы для drag-and-drop
const dragStart = (event, index) => {
    draggedIndex.value = index;
    event.dataTransfer.effectAllowed = 'move';
    // Устанавливаем прозрачное изображение для более плавного перетаскивания
    const dragImg = document.createElement('img');
    dragImg.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    event.dataTransfer.setDragImage(dragImg, 0, 0);
};

const drop = async (event, dropIndex) => {
    event.preventDefault();
    if (draggedIndex.value === null || draggedIndex.value === dropIndex) {
        draggedIndex.value = null;
        return;
    }

    // Создаем копию массива изображений
    const updatedImages = [...property.value.images];

    // Перемещаем элемент
    const [movedItem] = updatedImages.splice(draggedIndex.value, 1);
    updatedImages.splice(dropIndex, 0, movedItem);

    // Обновляем массив
    property.value.images = updatedImages;

    // Обновляем порядок в Firestore, если это редактирование существующего объекта
    if (isEdit.value && id) {
        try {
            const propertyDocRef = doc(db, `properties/${category}/${subcategory}`, id);
            await updateDoc(propertyDocRef, {
                images: updatedImages
            });

            toast.add({
                severity: 'success',
                summary: 'Порядок обновлен',
                detail: 'Порядок фотографий успешно обновлен',
                life: 2000
            });
        } catch (error) {
            console.error('Ошибка при обновлении порядка фото:', error);
            toast.add({
                severity: 'error',
                summary: 'Ошибка',
                detail: 'Не удалось обновить порядок фотографий',
                life: 3000
            });
            // Возвращаем исходный порядок при ошибке
            property.value.images = [...property.value.images];
        }
    }

    // Сбрасываем индекс перетаскивания
    draggedIndex.value = null;
};

const removeImage = async (imageUrl) => {
    try {
        // Extract the image path from the full URL
        const imagePath = decodeURIComponent(new URL(imageUrl).pathname)
            .split('/o/')[1]
            .split('?')[0];

        const imageRef = storageRef(storage, imagePath);

        // Delete from Firebase Storage
        await deleteObject(imageRef);

        // Remove from Firestore document
        if (id) {
            const propertyDocRef = doc(db, `properties/${category}/${subcategory}`, id);
            await updateDoc(propertyDocRef, {
                images: arrayRemove(imageUrl)
            });
        }

        // Remove from local array
        property.value.images = property.value.images.filter(url => url !== imageUrl);

        toast.add({
            severity: 'success',
            summary: 'Видалено',
            detail: 'Фото успішно видалено',
            life: 3000
        });
    } catch (error) {
        console.error('Помилка видалення фото:', error);
        toast.add({
            severity: 'error',
            summary: 'Помилка',
            detail: 'Не вдалося видалити фото',
            life: 3000
        });
    }
};

onBeforeMount(async () => {
    Object.assign(dropdowns, store.dropdowns);

    if (id) {
        isEdit.value = true;
        await loadPropertyData(id, category, subcategory);
    }
});

const loadPropertyData = async (id, category, subcategory) => {
    try {
        const propertyRef = doc(db, `properties/${category}/${subcategory}`, id);
        const propertyDoc = await getDoc(propertyRef);

        if (propertyDoc.exists()) {
            property.value = propertyDoc.data();
        } else {
            toast.add({
                severity: 'error',
                summary: 'Помилка',
                detail: 'Об\'єкт не знайдений',
                life: 3000
            });
        }
    } catch (error) {
        console.error('Помилка при завантаженні об\'єкту:', error);
        toast.add({
            severity: 'error',
            summary: 'Помилка',
            detail: 'Не вдалося завантажити об\'єкт',
            life: 3000
        });
    }
};

const updateMarkerPosition = (position) => {
    property.value.address.markerPosition = position;
};

const formattedDescription = computed(() => {
    return property.value.description
        .replace(/\n/g, '<br>')
        .replace(/ {2,}/g, match => '&nbsp;'.repeat(match.length));
});

const saveProperty = async () => {
    try {
        saving.value = true;
        const propertyData = {
            ...property.value,
            description: formattedDescription.value,
            updatedAt: new Date()
        };

        if (isEdit.value) {
            await updateDoc(doc(db, `properties/${category}/${subcategory}`, id), propertyData);
            toast.add({
                severity: 'success',
                summary: 'Успішно',
                detail: 'Об\'єкт оновлено',
                life: 3000
            });
        } else {
            await addDoc(collection(db, `properties/${propertyData.category}/${propertyData.subcategory}`), propertyData);
            toast.add({
                severity: 'success',
                summary: 'Успішно',
                detail: 'Об\'єкт додано',
                life: 3000
            });
        }

        // router.push(`/categories/apartments/${property.value.subcategory.code}`);
    } catch (error) {
        console.error('Помилка при збереженні об\'єкту:', error);
        toast.add({
            severity: 'error',
            summary: 'Помилка',
            detail: 'Помилка збереження об\'єкту',
            life: 3000
        });
    } finally {
        saving.value = false;
    }
};

const onFileSelect = async (event) => {
    const startTime = Date.now();
    const uploadLogs = [];

    try {
        const files = event.files;
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

        property.value.images.push(...successfulUploads);

        const totalTime = Date.now() - startTime;
        const successCount = successfulUploads.length;
        const totalFiles = files.length;

        toast.add({
            severity: successCount === totalFiles ? 'success' : 'warn',
            summary: 'Завантаження файлів',
            detail: `Завантажено ${successCount}/${totalFiles} файлів за ${totalTime}ms`,
            life: 5000
        });

        console.group('Деталі завантаження');
        console.log('Журнал завантаження:', uploadLogs);
        console.groupEnd();

    } catch (error) {
        console.error('Помилка завантаження файлів:', error);
        toast.add({
            severity: 'error',
            summary: 'Помилка завантаження',
            detail: `Деталі: ${error.message}`,
            life: 5000
        });
    }
};
</script>


<style scoped>
.location-picker {
    width: 100%;
}

.cursor-move {
    cursor: move;
}

.border-primary {
    border-color: var(--primary-color);
}

.border-transparent {
    border-color: transparent;
}

/* Стили при перетаскивании */
[draggable="true"] {
    transition: transform 0.2s, box-shadow 0.2s;
}

[draggable="true"]:hover {
    z-index: 10;
    transform: scale(1.02);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Анимация для перемещения изображений */
.photo-grid-item {
    transition: all 0.3s ease-in-out;
}
</style>
