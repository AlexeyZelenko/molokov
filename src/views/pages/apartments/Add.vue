<template>
    <h1 class="mb-4">Додати об'єкт нерухомості</h1>
    <Form v-slot="$form" :initialValues :resolver="resolver" @submit="saveProperty">
        <Fluid class="flex flex-col md:flex-row gap-8">
            <div class="md:w-1/2">
                <div class="card flex flex-col gap-4"  >
                    <div class="font-semibold text-xl">Назва</div>
                    <FloatLabel>
                        <InputText id="nameProperty" name="nameProperty" type="text" v-model="property.title" required />
                        <label for="nameProperty">Назва оголошення</label>
                        <Message
                            v-if="$form.nameProperty?.invalid"
                            severity="error" size="small"
                            variant="simple">
                            {{ $form.nameProperty.error?.message }}
                        </Message>
                    </FloatLabel>
                    <div class="font-semibold text-xl">Тип нерухомості</div>
                    <Select
                        id="categoryProperty"
                        name="categoryProperty"
                        v-model="property.category"
                        :options="dropdowns.category.filter(item => item.code === 'apartments')"
                        optionLabel="name"
                        placeholder="Select" required
                    />
                    <Message
                        v-if="$form.categoryProperty?.invalid"
                        severity="error" size="small"
                        variant="simple">
                        {{ $form.categoryProperty.error?.message }}
                    </Message>

                    <div class="font-semibold text-xl">Мета використання</div>
                    <Select name="subcategoryProperty" v-model="property.subcategory" :options="dropdowns.subcategory" optionLabel="name" placeholder="Select" required/>
                    <Message
                        v-if="$form.subcategoryProperty?.invalid"
                        severity="error" size="small"
                        variant="simple">
                        {{ $form.subcategoryProperty.error?.message }}
                    </Message>


                    <div v-if="property.subcategory && property.subcategory.code === 'sell' && property.subcategory.code !== 'exchange'" required class="font-semibold text-xl">Ціна USD</div>
                    <InputGroup v-if="property.subcategory && property.subcategory.code === 'sell' && property.subcategory.code !== 'exchange'">
                        <InputNumber
                            id="priceUSDProperty"
                            name="priceUSDProperty"
                            v-model="property.priceUSD"
                            showButtons mode="decimal"
                            currency="UAH"
                            locale="uk-UA"
                            required
                        ></InputNumber>
                        <InputGroupAddon>$</InputGroupAddon>
                        <InputGroupAddon>.00</InputGroupAddon>
                    </InputGroup>
                    <Message
                        v-if="$form.priceUSDProperty?.invalid"
                        severity="error" size="small"
                        variant="simple">
                        {{ $form.priceUSDProperty.error?.message }}
                    </Message>

                    <div v-if="property.subcategory && property.subcategory.code !== 'sell' && property.subcategory.code !== 'exchange'" class="font-semibold text-xl">Вартість оренди</div>
                    <InputGroup v-if="property.subcategory && property.subcategory.code !== 'sell' && property.subcategory.code !== 'exchange'">
                        <InputNumber
                            name="priceProperty"
                            v-model="property.priceUSD"
                            showButtons mode="decimal"
                            currency="UAH" locale="uk-UA" required
                        ></InputNumber>
                        <InputGroupAddon>грн</InputGroupAddon>
                        <InputGroupAddon>.00</InputGroupAddon>
                    </InputGroup>
                    <Message
                        v-if="$form.priceProperty?.invalid"
                        severity="error" size="small"
                        variant="simple">
                        {{ $form.priceProperty.error?.message }}
                    </Message>
                </div>

                <div class="card flex flex-col gap-4">
                    <div class="font-semibold text-xl">Розташування</div>

                    <div class="font-semibold text-sm">Область</div>
                    <Select name="addressRegionProperty" v-model="property.address.region" :options="dropdowns.regions" optionLabel="name" placeholder="Select" required/>
                    <Message
                        v-if="$form.addressRegionProperty?.invalid"
                        severity="error" size="small"
                        variant="simple">
                        {{ $form.addressRegionProperty.error?.message }}
                    </Message>

                    <div class="font-semibold text-sm">Місто</div>
                    <div v-if="property.address.region && property.address.region.code === 'CHK'">
                        <Select
                            name="propertyAddressCity"
                            v-model="property.address.city"
                            :options="dropdowns.cities"
                            optionLabel="name"
                            placeholder="Виберіть місто"
                        />
                        <Message
                            v-if="$form.propertyAddressCity?.invalid"
                            severity="error" size="small"
                            variant="simple">
                            {{ $form.propertyAddressCity.error?.message }}
                        </Message>
                    </div>

                    <InputText
                        v-else
                        v-model="property.address.city"
                        placeholder="Місто"
                    />

                    <div class="font-semibold text-sm">Вулиця</div>
                    <InputText v-model="property.address.street" placeholder="Вулиця" />


                    <template v-if="property.address.city && property.address.city.code === '1'">
                        <div class="font-semibold text-sm">Мікрорайон міста Черкаси</div>
                        <Select name="propertyAddressArea" v-model="property.address.area" :options="dropdowns.areas" optionLabel="name" placeholder="Select" />
                        <Message
                            v-if="$form.propertyAddressArea?.invalid"
                            severity="error" size="small"
                            variant="simple">
                            {{ $form.propertyAddressArea.error?.message }}
                        </Message>
                    </template>

                    <GoogleMapAddApartment
                        style="width: 100%; height: 500px"
                        :area="property.address.area"
                        @update-marker-position="updateMarkerPosition"
                    ></GoogleMapAddApartment>

                </div>

                <div class="card flex flex-col gap-4">
                    <div class="font-semibold text-xl">Площа(м²)</div>
                    <div class="font-semibold text-sm">Загальна площа</div>
                    <InputNumber name="propertyApartmentAreaTotalArea" v-model="property.apartmentArea.totalArea"  showButtons mode="decimal" required></InputNumber>
                    <Message
                        v-if="$form.propertyApartmentAreaTotalArea?.invalid"
                        severity="error" size="small"
                        variant="simple">
                        {{ $form.propertyApartmentAreaTotalArea.error?.message }}
                    </Message>

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
                    <InputNumber name="propertyFloorsFloor" v-model="property.floors.floor"  showButtons mode="decimal" required></InputNumber>
                    <Message
                        v-if="$form.propertyFloorsFloor?.invalid"
                        severity="error" size="small"
                        variant="simple">
                        {{ $form.propertyFloorsFloor.error?.message }}
                    </Message>

                    <div class="font-semibold text-sm">Поверховість будівлі</div>
                    <InputNumber v-model="property.floors.totalFloorsBuilding"  showButtons mode="decimal" required></InputNumber>

                    <div class="font-semibold text-sm">Кількість поверхів у приміщенні</div>
                    <InputNumber v-model="property.floors.totalFloors"  showButtons mode="decimal" required></InputNumber>
                </div>

                <div class="card flex flex-col gap-4">
                    <div class="font-semibold text-xl">Кількість кімнат</div>
                    <div class="font-semibold text-sm">Кількість кімнат</div>
                    <InputNumber name="propertyRoomsAll" v-model="property.rooms.all"  showButtons mode="decimal" required></InputNumber>
                    <Message
                        v-if="$form.propertyRoomsAll?.invalid"
                        severity="error" size="small"
                        variant="simple">
                        {{ $form.propertyRoomsAll.error?.message }}
                    </Message>

                    <div class="font-semibold text-sm">Кількість спалень</div>
                    <InputNumber v-model="property.rooms.bedrooms"  showButtons mode="decimal" required></InputNumber>


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
                    <DatePicker
                        :showIcon="true"
                        :showButtonBar="true"
                        v-model="property.facilityReadiness"
                    ></DatePicker>
                </div>
            </div>
        </Fluid>

        <Fluid class="flex flex-col mt-8">
            <div class="card flex flex-col gap-4 w-full">
                <div class="flex flex-col md:flex-row gap-4">
                    <div class="font-semibold text-xl">Додадковий опис об'єкта</div>
                    <Textarea v-model="property.description" placeholder="Додадковий опис об'єкта" :autoResize="true" rows="7" cols="50" />
                </div>
            </div>

            <div class="field col-12">
                <label>Фотографії</label>
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

                    <div v-if="images?.length" class="flex flex-wrap">
                        <div
                            v-for="(imageUrl, index) in images"
                            :key="imageUrl"
                            class="col-3 relative m-4"
                        >
                            <img
                                :src="imageUrl"
                                class="w-full h-auto object-cover"
                                style="height: 100px; width: 100px"
                            />
                            <Button
                                icon="pi pi-trash"
                                class="absolute top-0 right-0 p-button-danger p-button-rounded"
                                @click="removeImage(imageUrl)"
                                style="margin-top: -25px"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Fluid>

        <Fluid class="flex mt-8">
            <div class="card flex flex-col gap-4 ье-2">
                <div class="font-semibold text-xl">Опублікувати</div>
                <ToggleButton v-model="property.public" onLabel="Yes" offLabel="No" :style="{ width: '10em' }" />
            </div>
        </Fluid>

        <Fluid class="flex mt-8">
            <div class="card flex flex-col gap-4 w-full">
                <div class="font-semibold text-xl">Власник нерухомості</div>
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
                        <InputNumber v-model="property.owner.phone" placeholder="Телефон" />
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
import {ref, onBeforeMount, reactive, computed} from 'vue';
import { db, storage } from '@/firebase/config';
import { addDoc, collection } from 'firebase/firestore';
import {
    ref as storageRef,
    uploadBytes,
    getDownloadURL,
    deleteObject
} from 'firebase/storage';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
import Select from "primevue/select";
import compressWithCompressor from '@/service/Compressor';
import { useApartmentsStore } from '@/store/apartments';
import GoogleMapAddApartment from '@/components/googleMap/AddApartment.vue';
import { useAuthStore } from '@/store/authFirebase';

const toast = useToast();
const store = useApartmentsStore();
const authStore = useAuthStore();

const saving = ref(false);

let property = reactive({
    title: '',
    priceUSD: null,
    rooms: {
        all: null,
        bedrooms: null,
        bathrooms: null,
        kitchens: null
    },
    heatingType: null,
    condition: null,
    balconyCount: 0,
    description: '',
    images: [],
    category: null,
    subcategory: '',
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
    utilities: [],
    furniture: null,
    parking: null,
    balconyTerrace: null,
    objectClass: null,
    animal: false,
    facilityReadiness: null,
    public: false,
    address: {
        region: '',
        area: {
            code: null,
            name: null
        },
        street: '',
        city: '',
        markerPosition: null
    },
    owner: {
        username: '',
        phone: '',
        message: ''
    },
    creator: {
        id: null,
        username: null,
        email: null
    }
});

let dropdowns = reactive([]);

onBeforeMount(async () => {
    console.log('authStore', authStore.user);
    dropdowns = store.dropdowns;
});

const images = computed(() => property.images);
const fileUpload = ref(null)

const removeImage = async (imageUrl) => {
    try {
        // Extract the image path from the full URL
        const imagePath = decodeURIComponent(new URL(imageUrl).pathname)
            .split('/o/')[1]
            .split('?')[0];

        const imageRef = storageRef(storage, imagePath);

        // Delete from Firebase Storage
        await deleteObject(imageRef);

        // Remove from local array
        property.images = property.images.filter(url => url !== imageUrl);

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

        property.images.push(...successfulUploads);

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

const updateMarkerPosition = (position) => {
    property.address.markerPosition = position;
};

const saveProperty = async ({ valid }) => {
    if (valid) {
        const utilitiesObject = property.utilities.reduce((acc, current) => {
            acc[current.key] = current;  // Используем `key` как ключ, а объект как значение
            return acc;
        }, {});
        console.log(utilitiesObject);
        console.log(property);

        try {
            saving.value = true;
            const propertyData = {
                ...property,
                utilities: utilitiesObject,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                creator: {
                    id: authStore.user.uid,
                    username: authStore.user.displayName,
                    email: authStore.user.email
                }
            };

            await addDoc(collection(db, 'properties'), propertyData);
            toast.add({ severity: 'success', summary: 'Успішно', detail: 'Об\'єкт додано', life: 3000 });

            // Reset form
            property = {
                title: '',
                priceUSD: null,
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
                    region: '',
                    area: {
                        code: null,
                        name: null
                    },
                    street: '',
                    city: '',
                    markerPosition: null
                },
                owner: {
                    username: '',
                    phone: '',
                    message: ''
                },
                creator: {
                    id: null,
                    username: null,
                    email: null
                }
            };
        } catch (error) {
            console.error('Error saving property:', error);
            toast.add({ severity: 'error', summary: 'Помилка', detail: 'Помилка збереження об\'єкту', life: 3000 });
        } finally {
            saving.value = false;
        }
    } else {
        toast.add({ severity: 'error', summary: 'Form is invalid.', life: 3000 });
    }
};

const initialValues = reactive({
    nameProperty: '',
    categoryProperty: '',
    subcategoryProperty: '',
    priceUSDProperty: '',
    priceProperty: '',
    addressRegionProperty: '',
    propertyAddressCity: '',
    propertyAddressArea: '',
    propertyApartmentAreaTotalArea: '',
    propertyFloorsFloor: '',
});

const resolver = ({ values }) => {
    const errors = {};

    if (!values.nameProperty) {
        errors.nameProperty = [{ message: 'Додайте назву!' }];
    }
    if (!values.categoryProperty) {
        errors.categoryProperty = [{ message: 'Додайте категорію!' }];
    }
    if (!values.subcategoryProperty) {
        errors.subcategoryProperty = [{ message: 'Додайте мету використання!' }];
    }
    if (!values.priceUSDProperty) {
        errors.priceUSDProperty = [{ message: 'Додайте ціну!' }];
    }
    if (!values.priceProperty) {
        errors.priceProperty = [{ message: 'Додайте ціну!' }];
    }
    if (!values.addressRegionProperty) {
        errors.addressRegionProperty = [{ message: 'Обов\'язкове поле!' }];
    }
    if (!values.propertyAddressCity) {
        errors.propertyAddressCity = [{ message: 'Обов\'язкове поле!' }];
    }
    if (!values.propertyAddressArea) {
        errors.propertyAddressArea = [{ message: 'Обов\'язкове поле!' }];
    }
    if (!values.propertyApartmentAreaTotalArea) {
        errors.propertyApartmentAreaTotalArea = [{ message: 'Обов\'язкове поле!' }];
    }
    if (!values.propertyFloorsFloor) {
        errors.propertyFloorsFloor = [{ message: 'Обов\'язкове поле!' }];
    }

    return {
        errors
    };
};

</script>
