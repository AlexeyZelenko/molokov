import { ref, computed, onMounted, reactive } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useApartmentsStore } from '@/store/apartments';
import { useAuthStore } from '@/store/authFirebase';
import { useUserStore } from '@/store/userStore';
import {PropertyManager} from '@/service/property/PropertyManagerAdd';

import { usePropertyFirestore } from '@/composables/additionManagerProperty/usePropertyFirestore';
import { usePropertyImages } from '@/composables/additionManagerProperty/usePropertyImages';

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
import { useRoute, useRouter } from 'vue-router';
import Toast from 'primevue/toast';
import FullscreenLoader from "@/components/FullscreenLoader.vue";
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

const showRentSection = computed(() => {
    return property.value?.subcategory?.code !== 'sell' && property.value?.subcategory?.code !== 'exchange';
});
const pageTitle = computed(() =>
    isEditMode.value ? "Редагувати об'єкт нерухомості" : "Додати об'єкт нерухомості"
);

const category = { code: route.query?.category || route.params?.category || 'apartments'};
const subcategory = { code: route.query?.subcategory || 'sell' };
const id = route.params.id;

const propertyManager = new PropertyManager(userStore, store, toast);

const isEditMode = computed(() => !!route.params.id);

const handleReorder = (newOrder) => { property.value.images = newOrder };

const formValidations = ref({
    basicInfo: false,
    area: false,
    floors: false,
    rooms: false,
    condition: false,
});
const saving = ref(false);
const showLoader = ref(false);

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

const handleValidation = (formName, isValid) => { formValidations.value[formName] = isValid };

// images
const images = computed({
    get: () => Array.isArray(property.value.images) ? property.value.images : [],
    set: (value) => {
        if (Array.isArray(value)) {
            property.value.images = value;
        }
    }
});
const { imageState, uploadImages, deleteImage } = usePropertyImages(propertyManager);
const onFileSelect = async (files) => { property.value.images = await uploadImages(files, property.value.images) };
const removeImage = async (imageUrl) => { property.value.images = await deleteImage(imageUrl, property.value.images) };

const { loadProperty, updateProperty } = usePropertyFirestore(toast);
const saveProperty = async () => {
    saving.value = true;
    try {
        const isValid = await validateAllForms();
        if (!isValid) {
            toast.add({
                severity: 'error',
                summary: 'Помилка',
                detail: 'Перевірте форму на помилки',
                life: 5000
            });
            return;
        }

        const propertyData = {
            ...property.value,
            description: formattedDescription.value,
            updatedAt: new Date()
        };

        const saveAction = isEditMode.value
            ? () => updateProperty(id, category.code, subcategory.code, propertyData)
            : () => propertyManager.saveProperty();

        await saveAction();

        toast.add({
            severity: 'success',
            summary: 'Оголошення збережено',
            detail: 'Оберіть дію для продовження',
            group: 'property-action',
            life: 10000
        });

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

const onAddMore = () => {
    propertyManager.resetForm();
    toast.removeGroup('property-action');

    toast.add({
        severity: 'info',
        summary: 'Нове оголошення',
        detail: 'Форма очищена для створення нового оголошення',
        life: 3000
    });
};
const onClose = () => { toast.removeGroup('property-action') };

const onViewProperty = () => {
    toast.removeGroup('property-action');
    router.push({path: `/categories/${category.code}/${subcategory.code}`});
};

onMounted(async () => {
    showLoader.value = true;
    await Promise.all([authStore.getCurrentUser(), userStore.fetchUser()]);

    if (isEditMode.value) {
        property.value = await loadProperty(id, category.code, subcategory.code);
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
        category: {code: route.params.category},
        subcategory: {code: 'sell', name: 'Продаж'}
    };
    const propertyType = `${route.params.category}-sell`;
    propertyManager.setPropertyType(propertyType);
    property.value = propertyManager.property;
};
