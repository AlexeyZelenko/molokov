<template>
    <Form v-slot="$form" :initialValues :resolver="resolver" @submit="saveProperty">
        <Fluid class="flex flex-col md:flex-row gap-8">
            <div class="md:w-1/2">
                <PropertyBasicInfo
                    ref="basicInfoForm"
                    v-model="property"
                    :dropdowns="dropdowns"
                    :selectedCategoryName="selectedCategoryName"
                    @validation-change="handleBasicInfoValidation"
                    @subcategory-change="handleSubcategoryChange"
                />

                <PropertyAddress
                    v-model="property.address"
                    :dropdowns="dropdowns"
                />

                <PropertyAreaDetails
                    ref="areaDetailsForm"
                    v-model="property.apartmentArea"
                    @validation-change="handleAreaValidation"
                />

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
                <PropertyFloors
                    ref="areaFloorsForm"
                    v-model="property.floors"
                    @validation-change="handleFloorsValidation"
                />
<!--                <div class="card flex flex-col gap-4">-->
<!--                    <div class="font-semibold text-xl">Поверховість</div>-->
<!--                    <div class="font-semibold text-sm">Поверх</div>-->
<!--                    <InputNumber name="propertyFloorsFloor" v-model="property.floors.floor"  showButtons mode="decimal" required></InputNumber>-->
<!--                    <Message-->
<!--                        v-if="$form.propertyFloorsFloor?.invalid"-->
<!--                        severity="error" size="small"-->
<!--                        variant="simple">-->
<!--                        {{ $form.propertyFloorsFloor.error?.message }}-->
<!--                    </Message>-->

<!--                    <div class="font-semibold text-sm">Поверховість будівлі</div>-->
<!--                    <InputNumber v-model="property.floors.totalFloorsBuilding"  showButtons mode="decimal" required></InputNumber>-->

<!--                    <div class="font-semibold text-sm">Кількість поверхів у приміщенні</div>-->
<!--                    <InputNumber v-model="property.floors.totalFloors"  showButtons mode="decimal" required></InputNumber>-->
<!--                </div>-->

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

                    <div class="font-semibold text-xl">Планування</div>
                    <div class="font-semibold text-sm">Планування квартири</div>
                    <Select
                        name="propertyPlanning"
                        v-model="property.planning"
                        :options="dropdowns.planning" optionLabel="name" placeholder="Select" required/>
                    <Message
                        v-if="$form.propertyPlanning?.invalid"
                        severity="error" size="small"
                        variant="simple">
                        {{ $form.propertyPlanning.error?.message }}
                    </Message>

                    <div class="font-semibold text-sm">Планування санвузла</div>
                    <Select
                        name="propertyBathroom"
                        v-model="property.bathroom"
                        :options="dropdowns.bathroom" optionLabel="name" placeholder="Select" required/>
                    <Message
                        v-if="$form.propertyBathroom?.invalid"
                        severity="error" size="small"
                        variant="simple">
                        {{ $form.propertyBathroom.error?.message }}
                    </Message>
                </div>

                <div class="card flex flex-col gap-4">
                    <div class="font-semibold text-xl">Стан нерухомості</div>
                    <SelectButton v-model="property.condition"
                                  :options="dropdowns.conditions"
                                  optionLabel="name"
                                  required
                                  class="flex flex-col"
                    />

                    <div class="font-semibold text-xl">Тип будівлі</div>
                    <Select v-model="property.buildingType" :options="dropdowns.buildingTypes" optionLabel="name" placeholder="Select" />

                    <div class="font-semibold text-xl">Клас об'єкта</div>
                    <Select v-model="property.objectClass" :options="dropdowns.objectClass" optionLabel="name" placeholder="Select" />

                    <div class="font-semibold text-xl">Ремонт</div>
                    <Select v-model="property.reconditioning" :options="dropdowns.reconditioning" optionLabel="name" placeholder="Select" />
                </div>

                <div class="card flex flex-col gap-4">
                    <div class="font-semibold text-xl">Комунікації</div>
                    <Textarea v-model="property.communications" placeholder="Your Message" :autoResize="true" rows="3" cols="30" />

                    <div class="font-semibold text-xl">Інфраструктура</div>
                    <Textarea v-model="property.infrastructure" placeholder="Your Message" :autoResize="true" rows="3" cols="30" />

                    <div class="font-semibold text-xl">Ландшафт</div>
                    <Textarea v-model="property.landscape" placeholder="Your Message" :autoResize="true" rows="3" cols="30" />
                </div>

                <div class="card flex flex-col gap-4">
                    <div class="font-semibold text-xl">Проживання тварин</div>
                    <ToggleButton v-model="property.animal" onLabel="Так" offLabel="Ні" :style="{ width: '10em' }" />

                    <!-- Емодзі тварин -->
                    <div v-if="property.animal" class="text-3xl mt-2">
                        🐶 🐱 🐰 🦜 🐠
                    </div>
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
                    <Editor v-model="property.description" editorStyle="height: 320px" />
                </div>
            </div>

            <div class="field col-12">
                <label>Фотографії</label>
                <div class="field col-12">
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
                    >
                        <template #empty>
                            <span>Перетягніть файли сюди, щоб завантажити.</span>
                        </template>
                    </FileUpload>

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
            <div class="font-semibold text-xl mr-2">Опублікувати</div>
            <ToggleSwitch v-model="property.isPublic" />
        </Fluid>


        <Fluid class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <!-- Блок "Інформація про власника" -->
            <div class="card flex flex-col gap-6 p-4 shadow-lg rounded-lg bg-white">
                <div class="font-semibold text-xl">Інформація про власника</div>
                <div class="flex flex-col md:flex-row gap-4">
                    <SelectButton
                        name="propertyTypeOwner"
                        v-model="property.typeOwner"
                        :options="dropdowns.typeOwner"
                        optionLabel="name"
                    />
                    <Message
                        v-if="$form.propertyTypeOwner?.invalid"
                        severity="error" size="small"
                        variant="simple">
                        {{ $form.propertyTypeOwner.error?.message }}
                    </Message>
                </div>

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
                        <InputMask
                            id="phone"
                            v-model="property.owner.phone"
                            type="phones"
                            mask="+38(0**) 999-99-99"
                            class="mb-4" fluid
                            placeholder="+38(999) 999-9999"
                        />
                    </InputGroup>
                </div>

                <div>
                    <div class="font-semibold text-lg mb-2">Додадково</div>
                    <Textarea v-model="property.owner.message" placeholder="Your Message" :autoResize="true" rows="3" cols="30" />
                </div>
            </div>

            <!-- Блок "Мої контакти" -->
            <div class="card flex flex-col gap-6 p-4 shadow-lg rounded-lg bg-white">
                <div class="font-semibold text-xl">Мої контакти</div>
                <div class="flex flex-col gap-4">
                    <InputGroup>
                        <InputGroupAddon>
                            <i class="pi pi-user"></i>
                        </InputGroupAddon>
                        <InputText :value="contacts.displayName" placeholder="Username" disabled />
                    </InputGroup>
                    <div v-for="(phone, index) in contacts.phones" :key="index" class="phone-item">
                        <InputGroup>
                            <InputGroupAddon>
                                <i class="pi pi-phone"></i>
                            </InputGroupAddon>
                            <InputText :value="phone" disabled placeholder="Телефон" />
                        </InputGroup>
                    </div>
                </div>
                <div>
                    <div class="font-semibold text-lg mb-2">Додадково</div>
                    <Textarea v-model="property.creator.message" placeholder="Ваш текст" :autoResize="true" rows="3" cols="30" />
                </div>
            </div>
        </Fluid>


        <Fluid class="flex my-8">
            <div class="field max-w-60">
                <Button type="submit" label="Зберегти" icon="pi pi-check" :loading="saving" />
            </div>
        </Fluid>
    </Form>

    <Toast />

    <div class="card flex justify-center">
        <Toast position="top-center" group="headless" @close="visible = false">
            <template #container="{ message }">
                <section class="flex flex-col p-4 gap-4 w-full bg-primary/70 rounded-xl">
                    <div class="flex items-center gap-5">
                        <i class="pi pi-cloud-upload text-white dark:text-black text-2xl"></i>
                        <span class="font-bold text-base text-white dark:text-black">{{ message.summary }}</span>
                    </div>
                    <div class="flex flex-col gap-2">
                        <ProgressBar :value="progress" :showValue="false" :style="{ height: '4px' }" pt:value:class="!bg-primary-50 dark:!bg-primary-900" class="!bg-primary/80"></ProgressBar>
                        <label class="text-sm font-bold text-white dark:text-black">{{ progress }}% завантаження</label>
                    </div>
                </section>
            </template>
        </Toast>
    </div>

</template>

<script setup>
import { ref, onBeforeMount, computed, onUnmounted, reactive } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useApartmentsStore } from '@/store/apartments';
import { useAuthStore } from '@/store/authFirebase';
import { PropertyManager } from '@/service/property/PropertyManagerAdd';
import GoogleMapAddApartment from '@/components/googleMap/AddApartment.vue';

import PropertyAddress from '@/components/forms/PropertyAddress.vue';
import PropertyBasicInfo from '@/components/forms/PropertyBasicInfo.vue';
import PropertyAreaDetails from '@/components/forms/PropertyAreaDetails.vue';
import PropertyFloors from '@/components/forms/PropertyFloors.vue';
import PropertyRooms from '@/components/forms/PropertyRooms.vue';
import PropertyCondition from '@/components/forms/PropertyCondition.vue';

const areaDetailsForm = ref(null);
const isAreaValid = ref(false);
const handleAreaValidation = (isValid) => {
    isAreaValid.value = isValid;
};

const basicInfoForm = ref(null);
const isBasicInfoValid = ref(false);
const handleBasicInfoValidation = (isValid) => {
    isBasicInfoValid.value = isValid;
};

const areaFloorsForm = ref(null);
const isFloorsValid = ref(false);
const handleFloorsValidation = (isValid) => {
    isFloorsValid.value = isValid;
};

const toast = useToast();
const store = useApartmentsStore();
const authStore = useAuthStore();

const saving = ref(false);
const visible = ref(false);
const progress = ref(0);
const interval = ref(null);

const propertyManager = new PropertyManager(authStore, store, toast);

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

const selectPropertySubcategory = (value) => {
    const result = value.category.code + '-' + value.subcategory.code;
    propertyManager.setPropertyType(result);
};

const show = () => {
    if (!visible.value) {
        toast.add({ severity: 'custom', summary: 'Uploading files...', group: 'headless', styleClass: 'backdrop-blur-lg rounded-2xl' });
        visible.value = true;
        progress.value = 0;

        if (interval.value) {
            clearInterval(interval.value);
        }

        interval.value = setInterval(() => {
            progress.value = Math.min(progress.value + 20, 100);
            if (progress.value >= 100) clearInterval(interval.value);
        }, 500);
    }
};

onBeforeMount(async () => {
    await authStore.getCurrentUser();
    propertyManager.setPropertyType('houses-sell');
});

onUnmounted(() => {
    if (interval.value) {
        clearInterval(interval.value);
    }
});

const removeImage = async (imageUrl) => {
    await propertyManager.removeImage(imageUrl);
};

const onFileSelect = async (event) => {
    show();
    await propertyManager.uploadImages(event.files);
    toast.removeGroup('headless');
};

const updateMarkerPosition = (position) => {
    propertyManager.updateMarkerPosition(position);
};

const handleSubcategoryChange = (value) => {
    selectPropertySubcategory(value);
};

const saveProperty = async ({ valid }) => {
    const isValidBasicInfo = await basicInfoForm.value.validate();
    const isValidDetail = await areaDetailsForm.value.validate();
    const isValidFloors = await areaFloorsForm.value.validateAll();
    if (valid && isValidBasicInfo && isValidDetail && isValidFloors) {
        saving.value = true;
        await propertyManager.saveProperty();
        saving.value = false;
    } else {
        toast.add({ severity: 'error', summary: 'Помилка', detail: 'Перевірте форму на помилки', life: 3000 });
    }
};

const requiredFields = [
    'priceUSDProperty', 'priceProperty', 'addressRegionProperty',
    'propertyAddressCity', 'propertyAddressArea',
    'propertyApartmentAreaTotalArea', 'propertyFloorsFloor',
    'propertyPlanning', 'propertyBathroom', 'propertyTypeOwner', 'nameProperty'
];

const initialValues = reactive(
    requiredFields.reduce((acc, field) => {
        acc[field] = '';
        return acc;
    }, {})
);

const resolver = ({ values }) => {
    const errors = requiredFields.reduce((acc, field) => {
        if (!values[field]) {
            acc[field] = [{ message: 'Обов\'язкове поле!' }];
        }
        return acc;
    }, {});

    return { errors };
};
</script>
