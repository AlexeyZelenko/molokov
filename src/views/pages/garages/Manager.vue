<script setup>
import { ref, computed, onMounted } from 'vue';
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';

//store
import { useApartmentsStore } from '@/store/apartments';
import { useAuthStore } from '@/store/authFirebase';
import { useUserStore } from '@/store/userStore';

import { PropertyManager } from '@/service/property/PropertyManagerAdd';
import FullscreenLoader from '@/components/FullscreenLoader.vue';

// Composables
import { usePropertyMeta } from '@/composables/additionManagerProperty/usePropertyMeta';
import { usePropertyFirestore } from '@/composables/additionManagerProperty/usePropertyFirestore';
import { usePropertySave } from '@/composables/additionManagerProperty/usePropertySave';
import { usePropertyFormState } from '@/composables/additionManagerProperty/usePropertyFormState';
import { usePropertyValidation } from '@/composables/additionManagerProperty/usePropertyValidation';
import { usePropertyDirectImageUpload } from '@/composables/additionManagerProperty/usePropertyDirectImageUpload';

//forms
import PropertyAddress from '@/components/forms/PropertyAddress.vue';
import PropertyBasicInfo from '@/components/forms/PropertyBasicInfo.vue';
import GaragesAreaDetails from '@/components/forms/garages/GaragesAreaDetails.vue';
import GaragesPropertyFloors from '@/components/forms/garages/GaragesPropertyFloors.vue';
import GaragesPropertyCondition from '@/components/forms/garages/GaragesPropertyCondition.vue';
import FormDetails from '@/components/forms/FormDetails.vue';
import MyContacts from '@/components/forms/MyContacts.vue';
import PropertyDescription from '@/components/forms/PropertyDescription.vue';
import PropertyImageUpload from '@/components/forms/images/PropertyImageUpload.vue';

//common
import FormSection from '@/components/common/FormSection.vue';
import PublishToggle from '@/components/common/PublishToggle.vue';
import UploadProgressToast from '@/components/common/UploadProgressToast.vue';

// Stores
const route = useRoute();
const router = useRouter();
const toast = useToast();

// Refs
const basicInfoForm = ref(null);
const areaDetailsForm = ref(null);
const floorsForm = ref(null);
const roomsForm = ref(null);
const conditionForm = ref(null);
const showLoader = ref(false);

const store = useApartmentsStore();
const authStore = useAuthStore();
const userStore = useUserStore();

// Form state
const { property, formValidations, initializeNewProperty, emptyProperty } = usePropertyFormState();
const propertyManager = new PropertyManager(userStore, store, toast);

// Meta data
const dropdowns = computed(() => store.dropdowns);
const contacts = computed(() => userStore.user);
const { isEditMode, category, subcategory, pageTitle, selectedCategoryName, showRentSection } = usePropertyMeta(route, dropdowns, property);

const handleReorder = (newOrder) => {
    property.value.images = newOrder;
};

// images
const images = computed({
    get: () => (Array.isArray(property.value.images) ? property.value.images : []),
    set: (value) => {
        if (Array.isArray(value)) {
            property.value.images = value;
        }
    }
});
const { uploadState, deleteImageFromFirebase } = usePropertyDirectImageUpload();
const onFileSelect = (updatedImages) => {
    images.value = updatedImages;
};

const removeImage = (updatedImages) => {
    images.value = updatedImages;
};

const { loadProperty, updateProperty } = usePropertyFirestore(toast);

// Validation
const forms = {
    basicInfo: basicInfoForm,
    area: areaDetailsForm,
    floors: floorsForm,
    rooms: roomsForm,
    condition: conditionForm,
    validations: formValidations
};

const { validateAllForms, handleValidation } = usePropertyValidation(forms);

const { saving, saveProperty, onViewProperty, useResetForm, savedProperty } = usePropertySave({
    property,
    isEditMode,
    validateAllForms,
    propertyManager,
    updateProperty,
    id: route.params.id,
    category: { code: property.value.category.code || route.query?.category || route.params?.category || 'apartments' },
    subcategory: { code: property.value.subcategory.code || route.query?.subcategory || 'sell' },
    router
});
const onClose = () => {
    toast.removeGroup('property-action');
};

const resetForm = () => {
    useResetForm(emptyProperty);
};

onBeforeRouteLeave(async () => {
    if (!isEditMode.value && property.value.images?.length && !savedProperty.value) {
        const confirm = window.confirm('Увага! Ви маєте завантажені зображення, але оголошення не збережено. Ви дійсно хочете покинути сторінку? Всі завантажені зображення будуть видалені.');
        if (!confirm) {
            return false;
        }

        try {
            for (const image of property.value.images) {
                await deleteImageFromFirebase(image);
            }
            property.value.images = [];
            console.log('Всі зображення видалені успішно');
        } catch (error) {
            console.error('Помилка при видаленні зображень:', error);
        }
    }
    return true;
});

// Lifecycle
onMounted(async () => {
    showLoader.value = true;
    await Promise.all([authStore.getCurrentUser(), userStore.fetchUser()]);

    if (isEditMode.value) {
        property.value = await loadProperty(route.params.id, category.value.code, subcategory.value.code);
    } else {
        initializeNewProperty(route.params.category, propertyManager);
    }

    showLoader.value = false;
});
</script>

<template>
    <section class="w-full max-w-3xl mx-auto px-4 py-8">
        <h1 class="text-2xl font-semibold mb-2">{{ pageTitle }}</h1>
        <FullscreenLoader v-if="showLoader" />
        <Form v-show="!showLoader" @submit="saveProperty">
            <Fluid class="flex flex-col gap-8">
                <div class="w-full">
                    <PropertyBasicInfo ref="basicInfoForm" v-model="property" :dropdowns="dropdowns" @validation-change="handleValidation('basicInfo', $event)" :selectedCategoryName="selectedCategoryName" />

                    <PropertyAddress v-model="property.address" :property="property" :dropdowns="dropdowns" />

                    <GaragesAreaDetails ref="areaDetailsForm" v-model="property.apartmentArea" @validation-change="handleValidation('area', $event)" />
                </div>

                <div class="w-full">
                    <GaragesPropertyFloors ref="floorsForm" v-model="property.floors" @validation-change="handleValidation('floors', $event)" />

                    <GaragesPropertyCondition ref="conditionForm" v-model="property" :dropdowns="dropdowns" @validation-change="handleValidation('condition', $event)" />

                    <FormDetails ref="detailsForm" v-model="property" />

                    <FormSection title="Готовність об'єкта" v-model="property.facilityReadiness" type="date" />
                </div>
            </Fluid>

            <Fluid class="flex flex-col mt-8">
                <PropertyDescription v-model="property.description" />

                <PropertyImageUpload :images="images" :property="property" @upload="onFileSelect" @remove="removeImage" @reorder="handleReorder" />
            </Fluid>

            <Fluid class="flex mt-8">
                <PublishToggle v-model="property.isPublic" />
            </Fluid>

            <Fluid class="grid grid-cols-1 md:grid-cols-1 gap-6 mt-8">
                <MyContacts v-model="property" :contacts="contacts" />

                <Button type="submit" label="Зберегти" icon="pi pi-check" :loading="saving" />

                <Toast />

                <div v-if="uploadState.isUploading">
                    <UploadProgressToast :visible="uploadState.isUploading" :progress="uploadState.progress" :file="uploadState.currentFile" :completed="uploadState.completedFiles" :total="uploadState.totalFiles" />
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
                        <Button v-if="!isEditMode" size="small" label="Додати ще оголошення" severity="secondary" @click="resetForm()"></Button>
                        <Button size="small" label="Перейти до оголошення" severity="success" @click="onViewProperty()"></Button>
                    </div>
                </div>
            </template>
        </Toast>
    </section>
</template>
