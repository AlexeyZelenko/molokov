<template>
    <section class="w-full md:w-1/2 mx-auto">
        <h1 class="text-2xl font-semibold mb-2">{{ pageTitle }}</h1>
        <div v-if="showLoader" class="fullscreen-loader h-full">
            <div class="loader"></div>
        </div>
        <Form v-show="!showLoader" @submit="saveProperty">
            <Fluid class="flex flex-col w-full gap-8">
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

                    <PropertyAppointment
                        v-if="property && property.appointment"
                        v-model="property.appointment"
                        :property="property"
                        :dropdowns="dropdowns"
                    />
                </div>

                <div class="w-full">
                    <LandAreaDetails
                        v-if="property && property.apartmentArea"
                        ref="areaDetailsForm"
                        v-model="property.apartmentArea"
                        @validation-change="handleValidation('area', $event)"
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

            <Fluid class="flex flex-col mt-8">
                <PropertyDescription
                    v-if="property"
                    v-model="property.description"
                />

                <PropertyImageUpload
                    v-if="property"
                    :images="images"
                    @upload="onFileSelect"
                    @remove="removeImage"
                    @reorder="handleReorder"
                />
            </Fluid>

            <Fluid class="flex mt-8">
                <PublishToggle v-if="property" v-model="property.isPublic" />
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

                <Toast />

                <div v-if="imageState.isUploading">
                    <UploadProgressToast :visible="imageState.isUploading"/>
                </div>
            </Fluid>
        </Form>
    </section>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useApartmentsStore } from '@/store/apartments';
import { useAuthStore } from '@/store/authFirebase';
import { useUserStore } from '@/store/userStore';
import {PropertyManager} from '@/service/property/PropertyManagerAdd';

import PropertyAppointment from '@/components/forms/PropertyAppointment.vue';
import PropertyAddress from '@/components/forms/PropertyAddress.vue';
import PropertyBasicInfo from '@/components/forms/PropertyBasicInfo.vue';
import LandAreaDetails from '@/components/forms/land/LandAreaDetails.vue';
import FormDetails from '@/components/forms/FormDetails.vue';
import MyContacts from '@/components/forms/MyContacts.vue';
import FormSection from '@/components/common/FormSection.vue';
import PropertyDescription from '@/components/forms/PropertyDescription.vue';
import PropertyImageUpload from '@/components/forms/images/PropertyImageUpload.vue';
import PublishToggle from '@/components/common/PublishToggle.vue';
import UploadProgressToast from '@/components/common/UploadProgressToast.vue';
import {doc, getDoc, updateDoc, arrayRemove} from "firebase/firestore";
import {db} from "@/firebase/config";
import { useRoute, useRouter } from 'vue-router';
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

// Define props
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
        city: {
            code: null,
            name: ''
        },
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
    console.log('Завантаження об\'єкта:', id, category, subcategory);
    try {
        const propertyRef = doc(db, `properties/${category}/${subcategory}`, id);
        const propertyDoc = await getDoc(propertyRef);

        if (propertyDoc.exists()) {
            console.log("Document data:", propertyDoc.data());
            // Merge with default empty property to ensure all required fields exist
            property.value = {
                ...emptyProperty,
                ...propertyDoc.data()
            };
            console.log('Завантажено об\'єкт:', property.value);
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
    // Логируем начало валидации
    console.log("Starting validation of all forms...");

    // Валидация каждой формы
    const validations = await Promise.all([
        (async () => {
            if (!basicInfoForm.value) {
                console.log("basicInfoForm is undefined or null");
                return undefined;
            }
            console.log("Validating basicInfoForm...");
            const result = await basicInfoForm.value.validate();
            console.log("basicInfoForm validation result:", result);
            return result;
        })(),
        (async () => {
            if (!areaDetailsForm.value) {
                console.log("areaDetailsForm is undefined or null");
                return undefined;
            }
            console.log("Validating areaDetailsForm...");
            const result = await areaDetailsForm.value.validate();
            console.log("areaDetailsForm validation result:", result);
            return result;
        })(),
        (async () => {
            if (!floorsForm.value) {
                console.log("floorsForm is undefined or null");
                return undefined;
            }
            console.log("Validating floorsForm...");
            const result = await floorsForm.value.validate();
            console.log("floorsForm validation result:", result);
            return result;
        })(),
        (async () => {
            if (!roomsForm.value) {
                console.log("roomsForm is undefined or null");
                return undefined;
            }
            console.log("Validating roomsForm...");
            const result = await roomsForm.value.validate();
            console.log("roomsForm validation result:", result);
            return result;
        })(),
        (async () => {
            if (!conditionForm.value) {
                console.log("conditionForm is undefined or null");
                return undefined;
            }
            console.log("Validating conditionForm...");
            const result = await conditionForm.value.validate();
            console.log("conditionForm validation result:", result);
            return result;
        })(),
    ]);

    // Логируем результаты всех валидаций
    console.log("All validations:", validations);

    // Убираем undefined/null из массива перед проверкой
    const filteredValidations = validations.filter(v => v !== undefined && v !== null);
    console.log("Filtered validations (without undefined/null):", filteredValidations);

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
        }

        try {
            setTimeout(() => {
                router.push({path: `/categories/${propertyData.category.code}/${propertyData.subcategory.code}`});
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
