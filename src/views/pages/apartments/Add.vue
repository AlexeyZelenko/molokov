<template>
    <h1>{{ isEditMode ? 'Редагувати об\'єкт нерухомості' : 'Додати об\'єкт нерухомості' }}</h1>
    <Form @submit="saveProperty">
        <Fluid class="flex flex-col md:flex-row gap-8">
            <div class="md:w-1/2">
                <PropertyBasicInfo
                    ref="basicInfoForm"
                    v-model="property"
                    :dropdowns="dropdowns"
                    @validation-change="handleValidation('basicInfo', $event)"
                    :selectedCategoryName="selectedCategoryName"
                />

                <PropertyAddress
                    v-model="property.address"
                    :property="property"
                    :dropdowns="dropdowns"
                />

                <PropertyAreaDetails
                    ref="areaDetailsForm"
                    v-model="property.apartmentArea"
                    @validation-change="handleValidation('area', $event)"
                />
            </div>

            <div class="md:w-1/2">
                <PropertyFloors
                    ref="floorsForm"
                    v-model="property.floors"
                    @validation-change="handleValidation('floors', $event)"
                />

                <PropertyRooms
                    ref="roomsForm"
                    v-model="property"
                    :dropdowns="dropdowns"
                    @validation-change="handleValidation('rooms', $event)"
                />

                <PropertyCondition
                    ref="conditionForm"
                    v-model="property"
                    :dropdowns="dropdowns"
                    @validation-change="handleValidation('condition', $event)"
                />

                <FormDetails
                    ref="detailsForm"
                    v-model="property"
                />

                <FormSection
                    title="Готовність об'єкта"
                    v-model="property.facilityReadiness"
                    type="date"
                />
            </div>
        </Fluid>

        <Fluid
            v-if="property?.subcategory?.code !== 'sell' && property?.subcategory?.code !== 'exchange'"
            class="flex flex-col md:flex-row gap-8 mt-4"
        >
            <div class="md:w-1/2">
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

                <FormSection
                    title="Тип опалення"
                    v-model="property.heatingType"
                    :options="dropdowns.heatingTypes"
                />

                <FormSection
                    title="Меблі"
                    v-model="property.furniture"
                    :options="dropdowns.furniture"
                />
            </div>

            <div class="md:w-1/2">
                <FormSection
                    title="Паркування"
                    v-model="property.parking"
                    :options="dropdowns.parking"
                />

                <FormSection
                    title="Балкон / Тераса"
                    v-model="property.balconyTerrace"
                    :options="dropdowns.balconyTerrace"
                />

                <FormSection
                    title="Проживання тварин"
                    v-model="property.animal"
                    type="toggle"
                />
            </div>
        </Fluid>

        <Fluid class="flex flex-col mt-8">
            <PropertyDescription
                v-model="property.description"
            />

            <PropertyImageUpload
                :images="images"
                @upload="onFileSelect"
                @remove="removeImage"
                @reorder="handleReorder"
            />
        </Fluid>

        <Fluid class="flex mt-8">
            <PublishToggle v-model="property.isPublic" />
        </Fluid>

        <Fluid class="grid grid-cols-1 md:grid-cols-1 gap-6 mt-8">
            <MyContacts
                v-model="property"
                :contacts="contacts"
            />
        </Fluid>

        <Fluid class="flex my-8">
            <Button
                type="submit"
                label="Зберегти"
                icon="pi pi-check"
                :loading="saving"
            />
        </Fluid>

        <Toast />

        <div v-if="uploadVisible">
            <UploadProgressToast :visible="uploadVisible"/>
        </div>
    </Form>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useApartmentsStore } from '@/store/apartments';
import { useAuthStore } from '@/store/authFirebase';
import { useUserStore } from '@/store/userStore';
import {PropertyManager} from '@/service/property/PropertyManagerAdd';

import PropertyAddress from '@/components/forms/PropertyAddress.vue';
import PropertyBasicInfo from '@/components/forms/PropertyBasicInfo.vue';
import PropertyAreaDetails from '@/components/forms/PropertyAreaDetails.vue';
import PropertyFloors from '@/components/forms/PropertyFloors.vue';
import PropertyRooms from '@/components/forms/PropertyRooms.vue';
import PropertyCondition from '@/components/forms/PropertyCondition.vue';
import FormDetails from '@/components/forms/FormDetails.vue';
import MyContacts from '@/components/forms/MyContacts.vue';
import FormSection from '@/components/common/FormSection.vue';
import PropertyDescription from '@/components/forms/PropertyDescription.vue';
import PropertyImageUpload from '@/components/forms/images/PropertyImageUpload.vue';
import PublishToggle from '@/components/common/PublishToggle.vue';
import UploadProgressToast from '@/components/common/UploadProgressToast.vue';
import {addDoc, collection, doc, getDoc, updateDoc, arrayRemove} from "firebase/firestore";
import {db, storage} from "@/firebase/config";
import { useRoute, useRouter } from 'vue-router';
import Toast from 'primevue/toast';
const route = useRoute();
const router = useRouter();
const basicInfoForm = ref(null);
const areaDetailsForm = ref(null);
const floorsForm = ref(null);
const roomsForm = ref(null);
const conditionForm = ref(null);
const contactsInfoForm = ref(null);

const toast = useToast();
const store = useApartmentsStore();
const authStore = useAuthStore();
const userStore = useUserStore();


const category = {
    code: route.query?.category || route.params?.category || 'apartments',
};
const subcategory = {
    code: route.query?.subcategory || 'sell',
}
const id = route.params.id;

const propertyManager = new PropertyManager(userStore, store, toast);

const isEditMode = computed(() => !!route.params.id);

const handleReorder = (newOrder) => {
    property.value.images = newOrder;
};

const formValidations = ref({
    basicInfo: false,
    area: false,
    floors: false,
    rooms: false,
    condition: false,
    contactsInfo: true
});

const saving = ref(false);
const uploadVisible = ref(false);

// Пустой объект для режима добавления
const emptyProperty = {
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
    category: {
        code: null,
        name: ''
    },
    subcategory: {
        code: null,
        name: ''
    },
    createdAt: null,
    updatedAt: null,
    apartmentArea: {
        totalArea: null,
        livingArea: null,
        kitchenArea: null
    },
    floors: {
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
    creator: {
        id: null,
        name: '',
        phone: '',
        email: '',
        message: ''
    },
};

const property = ref({ ...emptyProperty });
const contacts = computed(() => userStore.user);
const dropdowns = computed(() => store.dropdowns);

const selectedCategoryName = computed(() => {
    if (!dropdowns.value?.category || !Array.isArray(dropdowns.value.category)) {
        return 'Категорія не знайдена';
    }
    const category = dropdowns.value.category.find(item => item.code === property.value.category.code);
    return category ? category.name : 'Категорія не знайдена';
});

const handleValidation = (formName, isValid) => {
    formValidations.value[formName] = isValid;
};
const onFileSelect = async (files) => {
    try {
        console.log("Selected files:", files);
        uploadVisible.value = true;

        // Загружаем изображения
        await propertyManager.uploadImages(files);

        // Обновляем property.value.images
        if (Array.isArray(propertyManager.property.images)) {
            property.value.images = [...propertyManager.property.images];
        } else {
            console.error("propertyManager.property.images is not an array:", propertyManager.property.images);
        }

        console.log("Updated images:", propertyManager.property.images);
        console.log("isEditMode:", isEditMode.value);
    } catch (error) {
        console.error("Upload failed:", error);
    } finally {
        uploadVisible.value = false;
    }
};

const images = computed({
    get: () => {
        // const source = isEditMode.value ? property.value.images : propertyManager.property.images;
        const source = property.value.images;
        return Array.isArray(source) ? source : [];
    },
    set: (value) => {
        if (isEditMode.value) {
            property.value.images = value;
        } else {
            console.warn("Cannot set images directly in non-edit mode.");
        }
    },
});

const removeImage = async (imageUrl) => {
    uploadVisible.value = true;
    await propertyManager.removeImage(imageUrl);
    uploadVisible.value = false;
};

const loadPropertyData = async (id, category, subcategory) => {
    try {
        const propertyRef = doc(db, `properties/${category.code}/${subcategory.code}`, id);
        const propertyDoc = await getDoc(propertyRef);

        if (propertyDoc.exists()) {
            property.value = propertyDoc.data(); // Обновляем ref
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

const validateAllForms = async () => {
    const validations = await Promise.all([
        basicInfoForm.value?.validate(),
        areaDetailsForm.value?.validate(),
        floorsForm.value?.validate(),
        roomsForm.value?.validate(),
        conditionForm.value?.validate(),
        contactsInfoForm.value?.validate()
    ]);

    // Убрать undefined/null из массива перед проверкой
    const filteredValidations = validations.filter(v => v !== undefined && v !== null);
    return filteredValidations.length > 0 && filteredValidations.every(v => v === true);
};

const formattedDescription = computed(() => {
    return property.value.description
        .replace(/\n/g, '<br>')
        .replace(/ {2,}/g, match => '&nbsp;'.repeat(match.length));
});

const saveOrUpdateProperty = async () => {
    try {
        saving.value = true;
        const propertyData = {
            ...property.value,
            description: formattedDescription.value,
            updatedAt: new Date()
        };

        if (isEditMode.value) {
            await updateDoc(doc(db, `properties/${category.code}/${subcategory.code}`, id), propertyData);
            toast.add({
                severity: 'success',
                summary: 'Успішно',
                detail: 'Об\'єкт оновлено',
                life: 3000
            });
        } else {
            await addDoc(collection(db, `properties/${propertyData.category.code}/${propertyData.subcategory.code}`), propertyData);
            toast.add({
                severity: 'success',
                summary: 'Успішно',
                detail: 'Об\'єкт додано',
                life: 3000
            });
        }

        try {
            setTimeout(() => {
                router.push({ path: `/categories/${propertyData.category.code}/${propertyData.subcategory.code}` });
            }, 3000);
        } catch (error) {
            console.error('Помилка при перенаправленні:', error);
        }

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

const saveProperty = async () => {
    const isValid = await validateAllForms();
    if (isValid) {
        await saveOrUpdateProperty();
    } else {
        toast.add({
            severity: 'error',
            summary: 'Помилка',
            detail: 'Перевірте форму на помилки',
            life: 5000
        });
    }
};

onMounted(async () => {
    console.log('isEditMode', isEditMode.value);
    console.log(route.params)
    await authStore.getCurrentUser();
    await userStore.fetchUser();

    if (isEditMode.value) {
        await loadPropertyData(id, category.code, subcategory.code);
    } else {
        property.value = { ...emptyProperty };
        if(route.params.category) {
            property.value.category.code = route.params.category;
            property.value.subcategory = {
                code: 'sell',
                name: 'Продаж'
            };
            propertyManager.setPropertyType(route.params.category, 'sell');
        }
    }
});
</script>
