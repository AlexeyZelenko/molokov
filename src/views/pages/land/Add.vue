<template>
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
            </div>

            <div class="md:w-1/2">
                <LandAreaDetails
                    ref="areaDetailsForm"
                    v-model="property.apartmentArea"
                    @validation-change="handleValidation('area', $event)"
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

        <Fluid class="flex flex-col mt-8">
            <PropertyDescription
                v-model="property.description"
            />

            <PropertyImageUpload
                :images="images"
                @upload="onFileSelect"
                @remove="removeImage"
            />
        </Fluid>

        <Fluid class="flex mt-8">
            <PublishToggle v-model="property.isPublic" />
        </Fluid>

        <Fluid class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <PropertyContactsInformation
                ref="contactsInfoForm"
                v-model="property"
                :dropdowns="dropdowns"
                @validation-change="handleValidation('contactsInfo', $event)"
            />

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
import { ref, computed, onBeforeMount, onUnmounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useApartmentsStore } from '@/store/apartments';
import { useAuthStore } from '@/store/authFirebase';
import { PropertyManager } from '@/service/property/PropertyManagerAdd';

// Component imports
import LandAreaDetails from '@/components/forms/land/LandAreaDetails.vue';

import PropertyAddress from '@/components/forms/PropertyAddress.vue';
import PropertyBasicInfo from '@/components/forms/PropertyBasicInfo.vue';
import PropertyFloors from '@/components/forms/PropertyFloors.vue';
import PropertyRooms from '@/components/forms/PropertyRooms.vue';
import PropertyCondition from '@/components/forms/PropertyCondition.vue';
import FormDetails from '@/components/forms/FormDetails.vue';
import PropertyContactsInformation from '@/components/forms/PropertyContactsInformation.vue';
import MyContacts from '@/components/forms/MyContacts.vue';
import FormSection from '@/components/common/FormSection.vue';
import PropertyDescription from '@/components/forms/PropertyDescription.vue';
import PropertyImageUpload from '@/components/forms/PropertyImageUpload.vue';
import PublishToggle from '@/components/common/PublishToggle.vue';
import UploadProgressToast from '@/components/common/UploadProgressToast.vue';

const basicInfoForm = ref(null);
const areaDetailsForm = ref(null);
const floorsForm = ref(null);
const roomsForm = ref(null);
const conditionForm = ref(null);
const contactsInfoForm = ref(null);

const validateAllForms = async () => {
    console.log('validateAllForms');
    const validations = await Promise.all([
        basicInfoForm.value?.validate(),
        areaDetailsForm.value?.validate(),
        floorsForm.value?.validate(),
        roomsForm.value?.validate(),
        conditionForm.value?.validate(),
        contactsInfoForm.value?.validate()
    ]);
    console.log('validations', validations);

    // Убрать undefined/null из массива перед проверкой
    const filteredValidations = validations.filter(v => v !== undefined && v !== null);
    return filteredValidations.length > 0 && filteredValidations.every(v => v === true);
};

const saveProperty = async () => {
    const isValid = await validateAllForms();

    if (isValid) {
        try {
            saving.value = true;
            await propertyManager.saveProperty();
        } catch (error) {
            toast.add({
                severity: 'error',
                summary: 'Помилка',
                detail: 'Помилка при збереженні оголошення',
                life: 5000
            });
        } finally {
            saving.value = false;
        }
    } else {
        toast.add({
            severity: 'error',
            summary: 'Помилка',
            detail: 'Перевірте форму на помилки',
            life: 5000
        });
    }
};

const toast = useToast();
const store = useApartmentsStore();
const authStore = useAuthStore();

const propertyManager = new PropertyManager(authStore, store, toast);

const formValidations = ref({
    basicInfo: false,
    area: false,
    floors: false,
    rooms: false,
    condition: false,
    contactsInfo: false
});

const saving = ref(false);
const uploadVisible = ref(false);

const property = computed(() => propertyManager.property);
const images = computed(() => propertyManager.property.images);
const contacts = computed(() => authStore.user);
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
    uploadVisible.value = true;
    await propertyManager.uploadImages(files);
    uploadVisible.value = false;
};

const removeImage = async (imageUrl) => {
    uploadVisible.value = true;
    await propertyManager.removeImage(imageUrl);
    uploadVisible.value = false;
};

onBeforeMount(async () => {
    await authStore.getCurrentUser();
    propertyManager.setPropertyType('land-sell');
});
</script>
