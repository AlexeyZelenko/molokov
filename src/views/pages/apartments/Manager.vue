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
import PropertyAreaDetails from '@/components/forms/PropertyAreaDetails.vue';
import PropertyFloors from '@/components/forms/PropertyFloors.vue';
import PropertyRooms from '@/components/forms/PropertyRooms.vue';
import PropertyCondition from '@/components/forms/PropertyCondition.vue';
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
const { isEditMode, category, subcategory, pageTitle, selectedCategoryName, showRentSection, id } = usePropertyMeta(route, dropdowns, property);

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
const { uploadState, deleteImageFromFirebase  } = usePropertyDirectImageUpload();
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
    <section class="w-full md:w-1/2 mx-auto">
        <h1 class="text-2xl font-semibold mb-2">{{ pageTitle }}</h1>
        <FullscreenLoader v-if="showLoader" />
        <Form v-show="!showLoader" @submit="saveProperty">
            <Fluid class="flex flex-col gap-8">
                <div class="w-full">
                    <PropertyBasicInfo ref="basicInfoForm" v-model="property" :dropdowns="dropdowns" @validation-change="handleValidation('basicInfo', $event)" :selectedCategoryName="selectedCategoryName" />
                    <PropertyAddress v-if="property" v-model="property.address" :property="property" :dropdowns="dropdowns" />
                    <PropertyAreaDetails v-if="property" ref="areaDetailsForm" v-model="property.apartmentArea" @validation-change="handleValidation('area', $event)" />
                </div>

                <div class="w-full">
                    <PropertyFloors v-if="property" ref="floorsForm" v-model="property.floors" @validation-change="handleValidation('floors', $event)" />
                    <PropertyRooms v-if="property" ref="roomsForm" v-model="property" :dropdowns="dropdowns" @validation-change="handleValidation('rooms', $event)" />
                    <PropertyCondition v-if="property" ref="conditionForm" v-model="property" :dropdowns="dropdowns" @validation-change="handleValidation('condition', $event)" />
                    <FormDetails ref="detailsForm" v-model="property" />
                    <FormSection v-if="property" title="Готовність об'єкта" v-model="property.facilityReadiness" type="date" />
                </div>
            </Fluid>

            <Fluid v-if="showRentSection" class="w-full flex flex-col gap-8 mt-4">
                <div class="w-full">
                    <div v-if="property" class="card flex flex-col gap-4">
                        <div class="font-semibold text-xl">Комунальні послуги</div>
                        <MultiSelect v-model="property.utilities" :options="dropdowns.utilities" optionLabel="name" placeholder="Комунальні послуги" :filter="true">
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
                                    <span :class="'mr-2' + slotProps.option.code.toLowerCase()" style="width: 18px; height: 12px" />
                                    <div>{{ slotProps.option.name }}</div>
                                </div>
                            </template>
                        </MultiSelect>
                    </div>

                    <FormSection v-if="property" title="Тип опалення" v-model="property.heatingType" :options="dropdowns.heatingTypes" />

                    <FormSection v-if="property" title="Меблі" v-model="property.furniture" :options="dropdowns.furniture" />
                </div>

                <div class="md:w-1/2">
                    <FormSection v-if="property" title="Паркування" v-model="property.parking" :options="dropdowns.parking" />

                    <FormSection v-if="property" title="Балкон / Тераса" v-model="property.balconyTerrace" :options="dropdowns.balconyTerrace" />

                    <FormSection v-if="property" title="Проживання тварин" v-model="property.animal" type="toggle" />
                </div>
            </Fluid>

            <Fluid v-if="property" class="flex flex-col mt-8">
                <PropertyDescription v-model="property.description" />
                <PropertyImageUpload
                    :images="images"
                    :property="property"
                    @upload="onFileSelect"
                    @remove="removeImage"
                    @reorder="handleReorder"
                />
            </Fluid>

            <Fluid v-if="property" class="flex mt-8">
                <PublishToggle v-model="property.isPublic" />
            </Fluid>

            <Fluid class="grid grid-cols-1 md:grid-cols-1 gap-6 mt-8">
                <MyContacts v-model="property" :contacts="contacts" />

                <Button type="submit" label="ЗБЕРЕГТИ" icon="pi pi-check" :loading="saving" raised class="w-full" style="letter-spacing: 2px" />

                <Button v-if="!isEditMode" label="ОЧИСТИТИ ФОРМУ" @click="resetForm" icon="pi pi-refresh" raised severity="help" class="w-full" style="letter-spacing: 2px" />

                <section>
                    <span class="text-red-500 mr-2 text-2xl">*</span>
                    <span>Поля з зірочкою, обов'язкові для заповнення!</span>
                </section>

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
                        <Button v-if="!isEditMode" size="small" label="Додати ще оголошення" severity="secondary" @click="resetForm"></Button>
                        <Button size="small" label="Перейти до оголошення" severity="success" @click="onViewProperty()"></Button>
                    </div>
                </div>
            </template>
        </Toast>
    </section>
</template>
