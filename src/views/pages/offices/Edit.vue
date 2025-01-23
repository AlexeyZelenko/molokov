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
                    <Select
                        v-model="property.category"
                        :options="dropdowns.category"
                        optionLabel="name"
                        placeholder="Select"
                    />
                    <div class="font-semibold text-xl">Мета використання</div>
                    <Select v-model="property.subcategory" :options="dropdowns.subcategory" optionLabel="name" placeholder="Select" />

                    <div v-if="property.subcategory && property.subcategory.code === 'SALE'" class="font-semibold text-xl">Ціна USD</div>
                    <InputGroup v-if="property.subcategory && property.subcategory.code === 'SALE'">
                        <InputNumber
                            v-model="property.priceUSD"
                            showButtons mode="decimal"
                            currency="UAH"
                            locale="uk-UA"
                            required
                        ></InputNumber>
                        <InputGroupAddon>$</InputGroupAddon>
                        <InputGroupAddon>.00</InputGroupAddon>
                    </InputGroup>

                    <div v-if="property.subcategory && property.subcategory.code !== 'SALE'" class="font-semibold text-xl">Вартість оренди</div>
                    <InputGroup v-if="property.subcategory && property.subcategory.code !== 'SALE'">
                        <InputNumber
                            v-model="property.priceUSD"
                            showButtons mode="decimal"
                            currency="UAH" locale="uk-UA" required
                        ></InputNumber>
                        <InputGroupAddon>$</InputGroupAddon>
                        <InputGroupAddon>.00</InputGroupAddon>
                    </InputGroup>
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

                    <GoogleMapAddApartment
                        style="width: 100%; height: 500px"
                        :area="property.address.area"
                        :center="property.address.markerPosition"
                        @update-marker-position="updateMarkerPosition"
                    ></GoogleMapAddApartment>
                    {{property.address}}

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
                    <Textarea v-model="property.description" placeholder="Додадковий опис об'єкта" :autoResize="true" rows="7" cols="50" />
                </div>
            </div>

            <div class="field col-12">
                <label>Фотографії</label>
                <FileUpload
                    name="advanced"
                    @uploader="onFileSelect"
                    :multiple="true"
                    accept="image/*"
                    :maxFileSize="1000000"
                    customUpload
                    chooseLabel="Обрати"
                    uploadLabel="Завантажити"
                    cancelLabel="Скасувати"
                />
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
import { ref, onBeforeMount, computed, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {db, storage} from '@/firebase/config';
import { doc, getDoc, updateDoc, addDoc, collection } from 'firebase/firestore';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
import { useApartmentsStore } from '@/store/apartments';
import Select from "primevue/select";
import GoogleMapAddApartment from "@/components/googleMap/AddApartment.vue";
import { formatFirebaseTimestamp } from '@/utils/dateUtils';
import compressWithCompressor from "@/service/Compressor";

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
        area: { code: null, name: null },
        street: '',
        city: '',
        markerPosition: null
    },
    owner: { username: '', phone: '', message: '' }
});

let dropdowns = reactive([]);
const route = useRoute();
const router = useRouter();
const propertyId = route.params.id;

onBeforeMount(async () => {
    dropdowns = store.dropdowns;

    if (propertyId) {
        isEdit.value = true;
        await loadPropertyData(propertyId); // Асинхронная операция для загрузки данных
    } else {
        isEdit.value = false;
    }
});

const loadPropertyData = async (id) => {
    try {
        const propertyRef = doc(db, 'properties', id);
        const propertyDoc = await getDoc(propertyRef);

        if (propertyDoc.exists()) {
            property.value = propertyDoc.data(); // Заполняем форму данными объекта
        } else {
            console.error('Об\'єкт не знайдений!');
        }
    } catch (error) {
        console.error('Ошибка при загрузке объекта:', error);
    }
};

const updateMarkerPosition = (position) => {
    property.value.address.markerPosition = position;
};

const saveProperty = async () => {
    try {
        saving.value = true;
        const propertyData = {
            ...property.value,
            updatedAt: new Date() // Обновляем время
        };

        if (isEdit.value) {
            // Обновляем данные объекта в Firebase, если редактируем
            await updateDoc(doc(db, 'properties', propertyId), propertyData);
            toast.add({ severity: 'success', summary: 'Успішно', detail: 'Об\'єкт оновлено', life: 3000 });
        } else {
            // Сохраняем новый объект в Firebase
            await addDoc(collection(db, 'properties'), propertyData);
            toast.add({ severity: 'success', summary: 'Успішно', detail: 'Об\'єкт додано', life: 3000 });
        }

        router.push('/properties'); // Перенаправляем на страницу списка объектов
    } catch (error) {
        console.error('Ошибка при сохранении объекта:', error);
        toast.add({ severity: 'error', summary: 'Помилка', detail: 'Помилка збереження об\'єкту', life: 3000 });
    } finally {
        saving.value = false;
    }
};

const onFileSelect = async (event) => {
    try {
        const files = event.files;
        if (!files || files.length === 0) {
            throw new Error("No files selected");
        }

        for (let file of files) {
            if (file) {
                try {
                    // Перевірка типу та розміру файлів перед стисненням
                    if (file.size > 10 * 1024 * 1024) { // Приклад: перевірка на максимальний розмір 10 MB
                        throw new Error('File size exceeds limit of 10MB');
                    }

                    // Стиснення зображення
                    const compressedFile = await compressWithCompressor(file);

                    // Зберігаємо файл у Firebase Storage
                    const storageReference = storageRef(storage, `properties/${Date.now()}_${file.name}`);
                    const snapshot = await uploadBytes(storageReference, compressedFile); // Завантажуємо стиснуте зображення
                    const downloadURL = await getDownloadURL(snapshot.ref); // Отримуємо URL стиснутого зображення

                    // Додаємо URL в масив зображень
                    property.value.images.push(downloadURL);
                } catch (error) {
                    console.error('Ошибка сжатия или загрузки файла:', error);
                    toast.add({ severity: 'error', summary: 'Помилка', detail: `Помилка стиснення або завантаження: ${error.message}`, life: 3000 });
                }
            }
        }

        // Успішне завантаження
        toast.add({ severity: 'success', summary: 'Успішно', detail: 'Фото завантажено', life: 3000 });
    } catch (error) {
        console.error('Error during file selection or upload:', error);
        toast.add({ severity: 'error', summary: 'Помилка', detail: 'Помилка завантаження фото: ' + error.message, life: 3000 });
    }
};
</script>


<style scoped>
.location-picker {
    width: 100%;
}
</style>
