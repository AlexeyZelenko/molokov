<template>
    <h1 class="md:w-1/2 mx-auto text-2xl font-semibold mb-2">{{ pageTitle }}</h1>
    <FullscreenLoader v-if="showLoader" />
    <Form v-show="!showLoader" @submit="saveProperty" class="flex flex-col md:w-1/2 justify-center items-center mx-auto">
        <Fluid class="w-full flex flex-col justify-center items-center gap-4">
            <div class="w-full">
                <PropertyBasicInfo
                    v-if="property"
                    ref="basicInfoForm"
                    v-model="property"
                    :dropdowns="dropdowns"
                    @validation-change="handleValidation('basicInfo', $event)"
                    :selectedCategoryName="selectedCategoryName"
                />

                <PropertyAddress
                    v-if="property && property.address"
                    v-model="property.address"
                    :property="property"
                    :dropdowns="dropdowns"
                />

                <PropertyAreaDetails
                    v-if="property && property.apartmentArea"
                    ref="areaDetailsForm"
                    v-model="property.apartmentArea"
                    @validation-change="handleValidation('area', $event)"
                />
            </div>

            <div class="w-full">
                <PropertyFloors
                    v-if="property && property.floors"
                    ref="floorsForm"
                    v-model="property.floors"
                    @validation-change="handleValidation('floors', $event)"
                />

                <PropertyRooms
                    v-if="property && property.rooms"
                    ref="roomsForm"
                    v-model="property"
                    :dropdowns="dropdowns"
                    @validation-change="handleValidation('rooms', $event)"
                />

                <PropertyCondition
                    v-if="property"
                    ref="conditionForm"
                    v-model="property"
                    :dropdowns="dropdowns"
                    @validation-change="handleValidation('condition', $event)"
                />

                <FormDetails
                    v-if="property"
                    ref="detailsForm"
                    v-model="property"
                />

                <FormSection
                    v-if="property"
                    title="Готовність об'єкта"
                    v-model="property.facilityReadiness"
                    type="date"
                />
            </div>
        </Fluid>

        <Fluid
            v-if="showRentSection"
            class="w-full flex flex-col md:flex-row gap-8 mt-4"
        >
            <div class="md:w-1/2">
                <div class="card flex flex-col gap-4">
                    <div class="font-semibold text-xl">Комунальні послуги</div>
                    <MultiSelect
                        v-if="property && property.utilities"
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
                                <span :class="'mr-2 ' + slotProps.option.code.toLowerCase()" style="width: 18px; height: 12px" />
                                <div>{{ slotProps.option.name }}</div>
                            </div>
                        </template>
                    </MultiSelect>
                </div>

                <FormSection
                    v-if="property"
                    title="Тип опалення"
                    v-model="property.heatingType"
                    :options="dropdowns.heatingTypes"
                />

                <FormSection
                    v-if="property"
                    title="Меблі"
                    v-model="property.furniture"
                    :options="dropdowns.furniture"
                />
            </div>

            <div class="md:w-1/2">
                <FormSection
                    v-if="property"
                    title="Паркування"
                    v-model="property.parking"
                    :options="dropdowns.parking"
                />

                <FormSection
                    v-if="property"
                    title="Балкон / Тераса"
                    v-model="property.balconyTerrace"
                    :options="dropdowns.balconyTerrace"
                />

                <FormSection
                    v-if="property"
                    title="Проживання тварин"
                    v-model="property.animal"
                    type="toggle"
                />
            </div>
        </Fluid>

        <Fluid class="w-full mt-8">
            <PropertyDescription
                v-if="property"
                v-model="property.description"
            />

            <PropertyImageUpload
                :images="images"
                @upload="onFileSelect"
                @remove="removeImage"
                @reorder="handleReorder"
            />
        </Fluid>

        <Fluid class="w-full flex justify-center mt-8">
            <PublishToggle v-if="property" v-model="property.isPublic" />
        </Fluid>

        <Fluid class="w-full grid grid-cols-1 md:grid-cols-1 gap-6 mt-8">
            <MyContacts
                v-model="property"
                :contacts="contacts"
            />

            <Button
                type="submit"
                label="ЗБЕРЕГТИ"
                icon="pi pi-check"
                :loading="saving"
                raised
                class="w-full"
                style="letter-spacing: 2px;"
            />

            <Button
                label="ОЧИСТИТИ ФОРМУ"
                @click="resetForm"
                icon="pi pi-refresh"
                raised
                severity="help"
                class="w-full"
                style="letter-spacing: 2px;"
            />

            <section>
                <span class="text-red-500 mr-2 text-2xl">*</span>
                <span>Поля з зірочкою, обов'язкові для заповнення!</span>
            </section>

            <Toast />

            <div v-if="imageState.isUploading">
                <UploadProgressToast :visible="imageState.isUploading"/>
            </div>
        </Fluid>
    </Form>

    <Toast position="bottom-center" group="property-action" @close="onClose">
        <template #message="slotProps">
            <div class="flex flex-col items-start flex-auto">
                <div class="flex items-center gap-2">
                    <i class="pi pi-check-circle text-green-500 text-2xl"></i>
                    <span class="font-bold text-lg">{{ slotProps.message.summary }}</span>
                </div>
                <div class="font-medium my-4">{{ slotProps.message.detail }}</div>
                <div class="flex gap-2">
                    <Button size="small" label="Додати ще оголошення" severity="secondary" @click="onAddMore()"></Button>
                    <Button size="small" label="Перейти до оголошення" severity="success" @click="onViewProperty()"></Button>
                </div>
            </div>
        </template>
    </Toast>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useApartmentsStore } from '@/store/apartments';
import { useAuthStore } from '@/store/authFirebase';
import { useUserStore } from '@/store/userStore';
import {PropertyManager} from '@/service/property/PropertyManagerAdd';
import FullscreenLoader from '@/components/FullscreenLoader.vue';

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
import {doc, getDoc, updateDoc} from "firebase/firestore";
import {db} from "@/firebase/config";
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router';
import Toast from 'primevue/toast';

const route = useRoute();
const router = useRouter();
const basicInfoForm = ref(null);
const areaDetailsForm = ref(null);
const floorsForm = ref(null);
const roomsForm = ref(null);
const conditionForm = ref(null);

const toast = useToast();
const store = useApartmentsStore();
const authStore = useAuthStore();
const userStore = useUserStore();

const props = defineProps({
    category: {
        type: String,
        required: true
    }
});

// computed
const showRentSection = computed(() => {
    return property.value?.subcategory?.code !== 'sell' && property.value?.subcategory?.code !== 'exchange';
});
const pageTitle = computed(() =>
    isEditMode.value ? "Редагувати об'єкт нерухомості" : "Додати об'єкт нерухомості"
);

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
});

const saving = ref(false);

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
    isPublic: false,
    address: {
        region: null,
        city: '',
        street: '',
        markerPosition: null
    },
    creator: {
        message: ''
    },
};
// const property = computed(() => isEditMode ? propertyManager.property : property.value);
const property = ref(emptyProperty);
const contacts = computed(() => userStore.user);
const dropdowns = computed(() => store.dropdowns);

const selectedCategoryName = computed(() => {
    if (!dropdowns.value?.category || !Array.isArray(dropdowns.value.category)) {
        console.log('Категорія не знайдена');
        return 'Категорія не знайдена';
    }
    if(route.params.category) {
        const category = dropdowns.value.category.find(item => item.code === route.params.category);
        return category ? category.name : 'Категорія не знайдена';
    }
    const category = dropdowns.value.category.find(item => item.code === property.value.category.code);
    return category ? category.name : 'Категорія не знайдена';
});

const handleValidation = (formName, isValid) => {
    formValidations.value[formName] = isValid;
};
// Image state management
const imageState = ref({
    isUploading: false,
    error: null
});

// Validate files before upload
const validateFiles = (files) => {
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

    return Array.from(files).every(file => {
        if (!ALLOWED_TYPES.includes(file.type)) {
            toast.add({
                severity: 'error',
                summary: 'Помилка',
                detail: 'Дозволені формати: JPG, PNG, WEBP',
                life: 3000
            });
            return false;
        }

        if (file.size > MAX_FILE_SIZE) {
            toast.add({
                severity: 'error',
                summary: 'Помилка',
                detail: 'Максимальний розмір файлу: 5MB',
                life: 3000
            });
            return false;
        }

        return true;
    });
};

// Optimized file upload handler
const onFileSelect = async (files) => {
    if (!validateFiles(files)) return;

    try {
        imageState.value.isUploading = true;
        await propertyManager.uploadImages(files);

        // Получаем только новые изображения из propertyManager
        const newImages = Array.isArray(propertyManager.property.images)
            ? propertyManager.property.images
            : [];

        // Проверяем на дубликаты перед добавлением
        const uniqueImages = [...new Set([...property.value.images, ...newImages])];
        property.value.images = uniqueImages;

    } catch (error) {
        console.error('Помилка завантаження:', error);
        imageState.value.error = error;
        toast.add({
            severity: 'error',
            summary: 'Помилка',
            detail: 'Не вдалося завантажити зображення',
            life: 3000
        });
    } finally {
        imageState.value.isUploading = false;
    }
};

// Simplified computed property for images
const images = computed({
    get: () => {
        if (!property.value || !Array.isArray(property.value.images)) {
            return [];
        }
        return property.value.images;
    },
    set: (value) => {
        if (Array.isArray(value) && property.value) {
            property.value.images = value;
        }
    }
});

// Optimized image removal
const removeImage = async (imageUrl) => {
    if (!imageUrl) return;

    try {
        imageState.value.isUploading = true;
        await propertyManager.removeImage(imageUrl);

        // Update local state after successful removal
        property.value.images = property.value.images.filter(img => img !== imageUrl);

    } catch (error) {
        console.error('Помилка видалення:', error);
        toast.add({
            severity: 'error',
            summary: 'Помилка',
            detail: 'Не вдалося видалити зображення',
            life: 3000
        });
    } finally {
        imageState.value.isUploading = false;
    }
};

const showLoader = ref(false);
const loadPropertyData = async (id, category, subcategory) => {
    try {
        const propertyRef = doc(db, `properties/${category}/${subcategory}`, id);
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
    } finally {
        showLoader.value = false;
    }
};

const validateAllForms = async () => {
    const validations = await Promise.all([
        (async () => {
            if (!basicInfoForm.value) {
                console.log("basicInfoForm is undefined or null");
                return undefined;
            }
            const result = await basicInfoForm.value.validate();
            console.log("basicInfoForm validation result:", result);
            return result;
        })(),
        (async () => {
            if (!areaDetailsForm.value) {
                console.log("areaDetailsForm is undefined or null");
                return undefined;
            }
            const result = await areaDetailsForm.value.validate();
            console.log("areaDetailsForm validation result:", result);
            return result;
        })(),
        (async () => {
            if (!floorsForm.value) {
                console.log("floorsForm is undefined or null");
                return undefined;
            }
            const result = await floorsForm.value.validate();
            console.log("floorsForm validation result:", result);
            return result;
        })(),
        (async () => {
            if (!roomsForm.value) {
                console.log("roomsForm is undefined or null");
                return undefined;
            }
            const result = await roomsForm.value.validate();
            console.log("roomsForm validation result:", result);
            return result;
        })(),
        (async () => {
            if (!conditionForm.value) {
                console.log("conditionForm is undefined or null");
                return undefined;
            }
            const result = await conditionForm.value.validate();
            console.log("conditionForm validation result:", result);
            return result;
        })(),
    ]);

    // Логируем результаты всех валидаций
    console.log("All validations:", validations);

    // Убираем undefined/null из массива перед проверкой
    const filteredValidations = validations.filter(v => v !== undefined && v !== null);

    // Проверяем, что все валидации успешны
    const isAllValid = filteredValidations.length > 0 && filteredValidations.every(v => v === true);
    console.log("Is all forms valid?", isAllValid);

    return isAllValid;
};

const formattedDescription = computed(() => {
    return property.value.description
        .replace(/\n/g, '<br>')
        .replace(/ {2,}/g, match => '&nbsp;'.repeat(match.length));
});

const savedProperty = ref(false);
const saveOrUpdateProperty = async () => {
    try {
        saving.value = true;
        const propertyData = {
            ...property.value,
            description: formattedDescription.value,
            updatedAt: new Date()
        };

        if (isEditMode.value) {
            console.log('Updating property:', propertyData);
            await updateDoc(doc(db, `properties/${category.code}/${subcategory.code}`, id), propertyData);
            toast.add({
                severity: 'success',
                summary: 'Успішно',
                detail: 'Об\'єкт оновлено',
                life: 3000
            });
        } else {
            await propertyManager.saveProperty();
            savedProperty.value = true;

            toast.add({
                severity: 'success',
                summary: 'Оголошення збережено',
                detail: 'Оберіть дію для продовження',
                group: 'property-action',
                life: 10000
            });
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
onBeforeRouteLeave(async () => {
    if (!isEditMode.value && property.value?.images?.length && !savedProperty.value) {
        await Promise.all(property.value.images.map(imageUrl => removeImage(imageUrl)));
        property.value.images = [];
        console.log('Images removed:', property.value.images);
    }
    return true;
});

const resetForm = () => {
    property.value = {...emptyProperty};
    const propertyType = `${property.value.category.code}-${property.value.subcategory.code}`;
    propertyManager.resetForm(propertyType);
    savedProperty.value = false;

    window.scroll(0, 0);

    toast.add({
        severity: 'info',
        summary: 'Нове оголошення',
        detail: 'Форма очищена для створення нового оголошення',
        life: 3000
    });
};

const onAddMore = () => {
    try {
        resetForm();
        toast.removeGroup('property-action');
        savedProperty.value = false;
    } catch (error) {
        console.error('Помилка при очищенні форми:', error);
        toast.add({
            severity: 'error',
            summary: 'Помилка',
            detail: 'Помилка очищення форми',
            life: 3000
        });
        window.location.reload();
    }
};

const onViewProperty = () => {
    toast.removeGroup('property-action');
    router.push({path: `/categories/${category.code}/${subcategory.code}`});
};

const onClose = () => {
    toast.removeGroup('property-action');
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
    showLoader.value = true;
    await Promise.all([authStore.getCurrentUser(), userStore.fetchUser()]);

    if (isEditMode.value) {
        property.value = null;
        await loadPropertyData(id, category.code, subcategory.code);
    } else {
        initializeNewProperty();
    }

    showLoader.value = false;
});

// Функция для инициализации нового объекта недвижимости
const initializeNewProperty = () => {
    if (!route.params.category) return;

    property.value = {
        ...emptyProperty,
        category: { code: route.params.category },
        subcategory: { code: 'sell', name: 'Продаж' }
    };

    const propertyType = `${route.params.category}-sell`;
    propertyManager.setPropertyType(propertyType);
    property.value = propertyManager.property;
};

</script>

<style scoped>
.fullscreen-loader {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(255, 255, 255, 0.8);
    z-index: 9999;

    .loader {
        width: 50px;
        height: 50px;
        border: 5px solid #ccc;
        border-top-color: #007bff;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

</style>
