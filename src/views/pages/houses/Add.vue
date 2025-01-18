<template>
    <h1>Додати об'єкт нерухомості</h1>
    <Form v-slot="$form" :initialValues :resolver @submit.prevent="saveProperty">
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
                    <Select v-model="property.typeEstate" :options="dropdownTypeEstates" optionLabel="name" placeholder="Select" />
                    <div class="font-semibold text-xl">Мета використання</div>
                    <Select v-model="dropdownPurposeOfUse" :options="dropdownPurposeOfUses" optionLabel="name" placeholder="Select" />

                    <div v-if="dropdownPurposeOfUse && dropdownPurposeOfUse.code === 'SALE'" class="font-semibold text-xl">Ціна USD</div>
                    <InputNumber v-if="dropdownPurposeOfUse && dropdownPurposeOfUse.code === 'SALE'" v-model="property.price"  showButtons mode="decimal" currency="UAH" locale="uk-UA" required></InputNumber>

                    <div v-if="dropdownPurposeOfUse && dropdownPurposeOfUse.code !== 'SALE'" class="font-semibold text-xl">Вартість оренди</div>
                    <InputNumber v-if="dropdownPurposeOfUse && dropdownPurposeOfUse.code !== 'SALE'" v-model="property.price"  showButtons mode="decimal" currency="UAH" locale="uk-UA" required></InputNumber>
                </div>

                <div class="card flex flex-col gap-4">
                    <div class="font-semibold text-xl">Розташування</div>
                    <div class="font-semibold text-sm">Область</div>
                    <Select v-model="dropdownRegion" :options="dropdownRegions" optionLabel="name" placeholder="Select" />

                    <div class="font-semibold text-sm">Район</div>
                    <Select v-model="dropdownRegion" :options="dropdownRegions" optionLabel="name" placeholder="Select" />

                    <div class="font-semibold text-sm">Вулиця</div>
                    <Select v-model="dropdownRegion" :options="dropdownRegions" optionLabel="name" placeholder="Select" />
                </div>
                <div class="card flex flex-col gap-4">
                    <div class="font-semibold text-xl">Площа</div>
                    <div class="font-semibold text-sm">Загальна площа</div>
                    <InputNumber v-model="property.apartmentArea.totalArea"  showButtons mode="decimal" required></InputNumber>

                    <div class="font-semibold text-sm">Жила площа квартири</div>
                    <InputNumber v-model="property.apartmentArea.livingArea"  showButtons mode="decimal" required></InputNumber>

                    <div class="font-semibold text-sm">Площа кухні</div>
                    <InputNumber v-model="property.apartmentArea.livingArea"  showButtons mode="decimal" required></InputNumber>
                </div>
            </div>
            <div class="md:w-1/2">
                <div v-if="!landTypeRealEstate || apartmentTypeRealEstate && property.typeEstate" class="card flex flex-col gap-4">
                    <div class="font-semibold text-xl">Поверховість</div>
                    <div class="font-semibold text-sm">Поверх</div>
                    <InputNumber v-model="property.floors.floor"  showButtons mode="decimal" required></InputNumber>

                    <div class="font-semibold text-sm">Поверховість будівлі</div>
                    <InputNumber v-model="property.floors.totalFloorsBuilding"  showButtons mode="decimal" required></InputNumber>

                    <div class="font-semibold text-sm">Кількість поверхів у приміщенні</div>
                    <InputNumber v-model="property.floors.totalFloors"  showButtons mode="decimal" required></InputNumber>
                </div>

                <div v-if="!landTypeRealEstate || apartmentTypeRealEstate && property.typeEstate" class="card flex flex-col gap-4">
                    <div class="font-semibold text-xl">Кількість кімнат</div>
                    <div class="font-semibold text-sm">Кількість кімнат</div>
                    <InputNumber v-model="property.floors.floor"  showButtons mode="decimal" required></InputNumber>

                    <div class="font-semibold text-sm">Кількість спалень</div>
                    <InputNumber v-model="property.floors.totalFloorsBuilding"  showButtons mode="decimal" required></InputNumber>

                    <div class="font-semibold text-sm">Кількість санвузлів</div>
                    <InputNumber v-model="property.floors.totalFloors"  showButtons mode="decimal" required></InputNumber>

                    <div class="font-semibold text-sm">Кількість ванних кімнат</div>
                    <InputNumber v-model="property.floors.totalFloors"  showButtons mode="decimal" required></InputNumber>

                    <div class="font-semibold text-sm">Кількість кухонь</div>
                    <InputNumber v-model="property.floors.totalFloors"  showButtons mode="decimal" required></InputNumber>
                </div>

                <div v-if="!landTypeRealEstate || apartmentTypeRealEstate && property.typeEstate" class="card flex flex-col gap-4">
                    <div class="font-semibold text-xl">Стан нерухомості</div>
                    <div class="font-semibold text-sm">Новобудова</div>
                    <InputNumber v-model="property.floors.floor"  showButtons mode="decimal" required></InputNumber>

                    <div class="font-semibold text-sm">Вторинний ринок</div>
                    <InputNumber v-model="property.floors.totalFloorsBuilding"  showButtons mode="decimal" required></InputNumber>

                    <div class="font-semibold text-sm">Ремонт (потрібен)</div>
                    <InputNumber v-model="property.floors.totalFloors"  showButtons mode="decimal" required></InputNumber>

                    <div class="font-semibold text-sm">Кількість ванних кімнат</div>
                    <InputNumber v-model="property.floors.totalFloors"  showButtons mode="decimal" required></InputNumber>

                    <div class="font-semibold text-sm">Кількість кухонь</div>
                    <InputNumber v-model="property.floors.totalFloors"  showButtons mode="decimal" required></InputNumber>
                </div>

                <div class="card flex flex-col gap-4">

                </div>

                <div class="card flex flex-col gap-4">

                </div>
            </div>
        </Fluid>

        <Fluid class="flex mt-8">
            <div class="card flex flex-col gap-4 w-full">
                <div class="font-semibold text-xl">InputGroup</div>
                <div class="flex flex-col md:flex-row gap-4">
                    <InputGroup>
                        <InputGroupAddon>
                            <i class="pi pi-user"></i>
                        </InputGroupAddon>
                        <InputText placeholder="Username" />
                    </InputGroup>
                    <InputGroup>
                        <InputGroupAddon>
                            <i class="pi pi-clock"></i>
                        </InputGroupAddon>
                        <InputGroupAddon>
                            <i class="pi pi-star-fill"></i>
                        </InputGroupAddon>
                        <InputNumber placeholder="Price" />
                        <InputGroupAddon>$</InputGroupAddon>
                        <InputGroupAddon>.00</InputGroupAddon>
                    </InputGroup>
                </div>
                <div class="flex flex-col md:flex-row gap-4">
                    <InputGroup>
                        <Button label="Search" />
                        <InputText placeholder="Keyword" />
                    </InputGroup>
                    <InputGroup>
                        <InputGroupAddon>
                            <Checkbox v-model="inputGroupValue" :binary="true" />
                        </InputGroupAddon>
                        <InputText placeholder="Confirm" />
                    </InputGroup>
                </div>
            </div>
        </Fluid>
    </Form>

    <div class="card">
        <h1>Додати об'єкт нерухомості</h1>
        <form @submit.prevent="saveProperty" class="formgrid grid">
            <div class="field col-12 md:col-6">
                <label for="title">Назва</label>
                <InputText id="title" v-model="property.title" required />
            </div>

            <div class="field col-12 md:col-6">
                <label for="price">Ціна</label>
                <InputNumber id="price" v-model="property.price" mode="currency" currency="UAH" locale="uk-UA" required />
            </div>

            <div class="field col-12 md:col-6">
                <label for="area">Площа (м²)</label>
                <InputNumber id="area" v-model="property.area" required />
            </div>

            <div class="field col-12 md:col-6">
                <label for="rooms">Кількість кімнат</label>
                <InputNumber id="rooms" v-model="property.rooms" required />
            </div>

            <div class="field col-12 md:col-6">
                <label for="floor">Поверх</label>
                <InputNumber id="floor" v-model="property.floor" required />
            </div>

            <div class="field col-12 md:col-6">
                <label for="totalFloors">Всього поверхів</label>
                <InputNumber id="totalFloors" v-model="property.totalFloors" required />
            </div>

            <div class="field col-12 md:col-6">
                <label for="district">Район</label>
                <InputText id="district" v-model="property.district" required />
            </div>

            <div class="field col-12 md:col-6">
                <label for="street">Вулиця</label>
                <InputText id="street" v-model="property.street" required />
            </div>

            <div class="field col-12 md:col-6">
                <label for="houseNumber">Номер будинку</label>
                <InputText id="houseNumber" v-model="property.houseNumber" required />
            </div>

            <div class="field col-12 md:col-6">
                <label for="constructionYear">Рік побудови</label>
                <InputNumber id="constructionYear" v-model="property.constructionYear" required />
            </div>

            <div class="field col-12 md:col-6">
                <label for="wallMaterial">Матеріал стін</label>
                <Select
                    id="wallMaterial"
                    v-model="property.wallMaterial"
                    :options="wallMaterials"
                    optionLabel="name"
                    optionValue="value"
                    placeholder="Оберіть матеріал"
                    required
                />
            </div>

            <div class="field col-12 md:col-6">
                <label for="heatingType">Тип опалення</label>
                <Select
                    id="heatingType"
                    v-model="property.heatingType"
                    :options="heatingTypes"
                    optionLabel="name"
                    optionValue="value"
                    placeholder="Оберіть тип опалення"
                    required
                />
            </div>

            <div class="field col-12 md:col-6">
                <label for="condition">Стан</label>
                <Select
                    id="condition"
                    v-model="property.condition"
                    :options="conditions"
                    optionLabel="name"
                    optionValue="value"
                    placeholder="Оберіть стан"
                    required
                />
            </div>

            <div class="field col-12 md:col-6">
                <label for="balconyCount">Кількість балконів</label>
                <InputNumber id="balconyCount" v-model="property.balconyCount" />
            </div>

            <div class="field-checkbox col-12 md:col-6">
                <Checkbox id="hasParking" v-model="property.hasParking" :binary="true" />
                <label for="hasParking" class="ml-2">Паркінг</label>
            </div>

            <div class="field-checkbox col-12 md:col-6">
                <Checkbox id="hasElevator" v-model="property.hasElevator" :binary="true" />
                <label for="hasElevator" class="ml-2">Ліфт</label>
            </div>

            <div class="field-checkbox col-12 md:col-6">
                <Checkbox id="hasFurniture" v-model="property.hasFurniture" :binary="true" />
                <label for="hasFurniture" class="ml-2">Меблі</label>
            </div>

            <div class="field col-12">
                <label for="description">Опис</label>
                <Textarea id="description" v-model="property.description" rows="5" required />
            </div>

            <div class="field col-12">
                <label>Фотографії</label>
                <FileUpload
                    mode="advanced"
                    :multiple="true"
                    accept="image/*"
                    :maxFileSize="1000000"
                    @select="onFileSelect"
                    :auto="true"
                    chooseLabel="Обрати"
                    uploadLabel="Завантажити"
                    cancelLabel="Скасувати"
                />
            </div>

            <div class="field col-12">
                <Button type="submit" label="Зберегти" icon="pi pi-check" :loading="saving" />
            </div>
        </form>

        <Toast />
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { db, storage } from '@/firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useToast } from 'primevue/usetoast';
import Checkbox from 'primevue/checkbox';
import Toast from 'primevue/toast';
import Select from "primevue/select";
import {NodeService} from "@/service/NodeService";
import {AreaService} from "@/service/AreaService";


const route = useRoute();
const toast = useToast();
const saving = ref(false);


const dropdownRegions = ref([
    { name: 'Вінницька', code: 'VIN' },
    { name: 'Волинська', code: 'VOL' },
    { name: 'Дніпропетровська', code: 'DNE' },
    { name: 'Донецька', code: 'DON' },
    { name: 'Крим', code: 'CRR' },
    { name: 'Житомирська', code: 'ZHM' },
    { name: 'Закарпатська', code: 'ZAK' },
    { name: 'Запорізька', code: 'ZAP' },
    { name: 'Київська', code: 'KIE' },
    { name: 'Кіровоградська', code: 'KIR' },
    { name: 'Луганська', code: 'LUG' },
    { name: 'Львівська', code: 'LVV' },
    { name: 'Миколаївська', code: 'MYK' },
    { name: 'Одеська', code: 'ODR' },
    { name: 'Полтавська', code: 'PLT' },
    { name: 'Рівненська', code: 'RIV' },
    { name: 'Сумська', code: 'SUM' },
    { name: 'Тернопільська', code: 'TER' },
    { name: 'Харківська', code: 'KH' },
    { name: 'Херсонська', code: 'KHE' },
    { name: 'Хмельницька', code: 'KM' },
    { name: 'Черкаська', code: 'CHK' },
    { name: 'Чернівецька', code: 'CHV' },
    { name: 'Чернігівська', code: 'CHG' },
    { name: 'Івано-Франківська', code: 'IVF' }
]);
const dropdownRegion = ref(null);

const dropdownTypeEstates = ref([
    { name: 'Квартира', code: 'APT' },
    { name: 'Будинок', code: 'HSE' },
    { name: 'Офіс', code: 'OFF' },
    { name: 'Склад', code: 'WH' },
    { name: 'Комерційна нерухомість', code: 'COMM' },
    { name: 'Гараж', code: 'GAR' },
    { name: 'Дача', code: 'COTT' },
    { name: 'Земельна ділянка', code: 'LAND' }
]);

const commercialTypeRealEstate = computed(() => {
    const validCodes = ['OFF', 'WH', 'COMM', 'GAR'];
    return validCodes.includes(property.value.typeEstate?.code);
});

const landTypeRealEstate = computed(() => {
    const validCodes = ['LAND'];
    return validCodes.includes(property.value.typeEstate?.code);
});

const apartmentTypeRealEstate = computed(() => {
    const validCodes = ['APT'];
    return validCodes.includes(property.value.typeEstate?.code);
});

const houseTypeRealEstate = computed(() => {
    const validCodes = ['HSE', 'COTT'];
    return validCodes.includes(property.value.typeEstate?.code);
});



const dropdownPurposeOfUses = ref([
    { name: 'Продаж', code: 'SALE' },
    { name: 'Довгострокова оренда', code: 'LTD' },
    { name: 'Короткострокова оренда', code: 'STL' }
]);
const dropdownPurposeOfUse = ref(null);

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
    createdAt: null,
    updatedAt: null,
    apartmentArea: {
        totalArea: null,
        livingArea: null,
        kitchenArea: null
    },
    typeEstate: null,
    floors : {
        floor: null,
        totalFloors: null,
        totalFloorsBuilding: null
    }
});

const treeSelectNodes = ref(null);

onMounted(() => {
    const { category, subcategory } = route.query;
    property.value.category = category;
    property.value.subcategory = subcategory;

    AreaService.getTreeNodes().then((data) => (treeSelectNodes.value = data));
});

const onFileSelect = async (event) => {
    try {
        const files = event.files;
        for (let file of files) {
            const storageReference = storageRef(storage, `properties/${Date.now()}_${file.name}`);
            const snapshot = await uploadBytes(storageReference, file);
            const downloadURL = await getDownloadURL(snapshot.ref);
            property.value.images.push(downloadURL);
        }
        toast.add({ severity: 'success', summary: 'Успішно', detail: 'Фото завантажено', life: 3000 });
    } catch (error) {
        console.error('Error uploading files:', error);
        toast.add({ severity: 'error', summary: 'Помилка', detail: 'Помилка завантаження фото', life: 3000 });
    }
};

const saveProperty = async () => {
    try {
        saving.value = true;
        const propertyData = {
            ...property.value,
            category: property.value.category || '',
            subcategory: property.value.subcategory || '',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        };

        await addDoc(collection(db, 'properties'), propertyData);
        toast.add({ severity: 'success', summary: 'Успішно', detail: 'Об\'єкт додано', life: 3000 });

        // Reset form
        property.value = {
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
            category: property.value.category,
            subcategory: property.value.subcategory,
            createdAt: null,
            updatedAt: null,
            apartmentArea: {
                totalArea: null,
                livingArea: null,
                kitchenArea: null,
                bathroomArea: null,
                balconyArea: null
            },
            typeEstate: null,
            floors : {
                floor: null,
                totalFloors: null,
                totalFloorsBuilding: null
            }
        };
    } catch (error) {
        console.error('Error saving property:', error);
        toast.add({ severity: 'error', summary: 'Помилка', detail: 'Помилка збереження об\'єкту', life: 3000 });
    } finally {
        saving.value = false;
    }
};
</script>
