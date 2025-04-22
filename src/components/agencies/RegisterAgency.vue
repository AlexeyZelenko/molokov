<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { useAgencyStore } from '@/store/agencyStore';
import { useApartmentsStore } from '@/store/apartments';
import InputText from 'primevue/inputtext';
import InputMask from 'primevue/inputmask'; // Добавлен отсутствующий импорт
import Button from 'primevue/button';
import Select from 'primevue/select';
import Toast from 'primevue/toast'; // Добавлен импорт компонента Toast
import { useVuelidate } from '@vuelidate/core';
import { required, email, helpers } from '@vuelidate/validators';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useToast } from 'primevue/usetoast';
import { v4 as uuidv4 } from 'uuid';
import { useAuthStore } from '@/store/authFirebase';
import VueLeafle from '@/components/maps/VueLeafle.vue';
import { getSettlements } from '@/services/novaPoshtaService';

// Store and services setup
const authStore = useAuthStore();
const agencyStore = useAgencyStore();
const apartmentsStore = useApartmentsStore();
const toast = useToast();

// Props
const props = defineProps({
    agency: {
        type: Object,
        default: null
    }
});

// Computed and reactive state
const isEditing = computed(() => !!props.agency);
const regions = computed(() => apartmentsStore.dropdowns.regions); // Преобразовано в computed для реактивности
const currentUser = computed(() => authStore.user);
const newPhoneNumber = ref('');
const searchQuery = ref('');
const citiesNova = ref([]);
const centerMap = ref(null);
const isSubmitting = ref(false);
const logoError = ref(null);

// Инициализация формы значениями по умолчанию или данными агентства
const initFormData = () => ({
    name: props.agency?.name || '',
    address: props.agency?.address || '',
    phone: props.agency?.phone?.length ? [...props.agency.phone] : [''], // Гарантируем как минимум один пустой телефон
    email: props.agency?.email || '',
    website: props.agency?.website || '',
    logoUrl: props.agency?.logoUrl || null,
    logoFile: null,
    region: props.agency?.region || null,
    city: props.agency?.city || null,
    markerPosition: props.agency?.markerPosition || []
});

const form = reactive(initFormData());

// Validation rules
const rules = computed(() => ({
    name: { required: helpers.withMessage("Назва обов'язкова", required) },
    address: { required: helpers.withMessage("Адреса обов'язкова", required) },
    phone: {
        required: helpers.withMessage('Потрібен хоча б один телефон', value =>
            Array.isArray(value) && value.length > 0 && value.some(p => p && p.trim() !== '')),
        hasValidPhone: helpers.withMessage('Введіть коректний номер телефону', value =>
            Array.isArray(value) && value.some(p => p && p.trim() !== ''))
    },
    email: {
        required: helpers.withMessage("Email обов'язковий", required),
        email: helpers.withMessage('Невірний формат Email', email)
    },
    website: { required: helpers.withMessage("Вебсайт обов'язковий", required) },
    region: { required: helpers.withMessage("Область обов'язкова", required) },
    city: {
        required: helpers.withMessage("Місто обов'язкове", required),
        isObject: helpers.withMessage('Виберіть місто зі списку', value =>
            typeof value === 'object' && value !== null && !Array.isArray(value) && value.Description)
    }
}));

const v$ = useVuelidate(rules, form);

// ==== Обработка файлов логотипа ====
const handleLogoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        // Проверка типа файла
        if (!file.type.startsWith('image/')) {
            logoError.value = 'Можна завантажувати тільки зображення';
            clearSelectedLogoFile();
            return;
        }

        // Проверка размера файла (ограничение до 2 МБ)
        if (file.size > 2 * 1024 * 1024) {
            logoError.value = 'Файл занадто великий (максимум 2 МБ)';
            clearSelectedLogoFile();
            return;
        }

        form.logoFile = file;
        logoError.value = null;
    }
};

const clearSelectedLogoFile = () => {
    form.logoFile = null;
    const fileInput = document.getElementById('logo');
    if (fileInput) fileInput.value = '';
};

const clearLogo = () => {
    form.logoUrl = null;
    clearSelectedLogoFile();
};

// ==== Работа с телефонными номерами ====
const addPhoneNumber = () => {
    if (newPhoneNumber.value && newPhoneNumber.value.trim()) {
        form.phone.push(newPhoneNumber.value.trim());
        newPhoneNumber.value = '';
        v$.value.phone.$touch();
    }
};

const removePhoneNumber = (index) => {
    // Проверка, чтобы не удалить последний телефон
    if (form.phone.length > 1) {
        form.phone.splice(index, 1);
    } else {
        // Если это последний телефон, просто очищаем его
        form.phone[0] = '';
    }
    v$.value.phone.$touch();
};

// ==== Работа с местоположением ====
const changeRegion = () => {
    form.city = null;
    searchQuery.value = '';
    citiesNova.value = [];
    form.markerPosition = [];
    centerMap.value = null;
    v$.value.region.$touch();
    v$.value.city.$touch();
};

const selectCity = (city) => {
    form.city = city;
    searchQuery.value = '';
    citiesNova.value = [];

    if (city.Latitude && city.Longitude) {
        centerMap.value = [Number(city.Latitude), Number(city.Longitude)];
    } else {
        centerMap.value = null;
    }

    v$.value.city.$touch();
};

// ==== Отправка и сброс формы ====
const submitForm = async () => {
    const result = await v$.value.$validate();
    if (!result) {
        toast.add({
            severity: 'error',
            summary: 'Помилка валідації',
            detail: "Будь ласка, заповніть всі обов'язкові поля коректно.",
            life: 5000
        });
        return;
    }

    isSubmitting.value = true;
    logoError.value = null;

    try {
        // Handle logo upload
        let logoUrl = form.logoUrl;
        if (form.logoFile) {
            try {
                const storage = getStorage();
                const fileExtension = form.logoFile.name.split('.').pop();
                const uniqueFileName = `${uuidv4()}.${fileExtension}`;
                const logoRef = storageRef(storage, `agencies/${uniqueFileName}`);

                await uploadBytes(logoRef, form.logoFile);
                logoUrl = await getDownloadURL(logoRef);
                clearSelectedLogoFile();
            } catch (error) {
                console.error('Error uploading logo:', error);
                logoError.value = 'Помилка завантаження логотипу. Спробуйте пізніше.';
                throw new Error('Logo upload failed');
            }
        }

        // Prepare agency data
        const agencyData = {
            ...form,
            logoUrl,
            // Фильтруем пустые телефоны перед сохранением
            phone: form.phone.filter(p => p && p.trim() !== ''),
            creator: isEditing.value ? props.agency.creator || null : currentUser.value?.uid || null
        };
        delete agencyData.logoFile;

        // Submit to store
        if (isEditing.value) {
            await agencyStore.updateAgency(props.agency.id, agencyData);
            toast.add({
                severity: 'success',
                summary: 'Зміни збережено.',
                life: 3000
            });
        } else {
            await agencyStore.createAgency(agencyData);
            toast.add({
                severity: 'success',
                summary: 'Агенція створена.',
                life: 3000
            });
            clearForm();
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        if (!logoError.value) {
            toast.add({
                severity: 'error',
                summary: 'Помилка збереження.',
                detail: error.message || 'Не вдалося зберегти дані агенції.',
                life: 5000
            });
        }
    } finally {
        isSubmitting.value = false;
    }
};

const resetForm = () => {
    Object.assign(form, initFormData());
    clearSelectedLogoFile();
    newPhoneNumber.value = '';
    searchQuery.value = '';
    citiesNova.value = [];
    centerMap.value = null;
    logoError.value = null;
    v$.value.$reset();
};

const clearForm = () => resetForm();

// ==== Наблюдатели ====
watch(searchQuery, async (newValue) => {
    if (!form.region || !newValue) {
        citiesNova.value = [];
        return;
    }

    try {
        const response = await getSettlements({
            FindByString: newValue,
            RegionRef: form.region.Ref
        });

        citiesNova.value = response.filter((city) =>
            city.Description.toLowerCase().includes(newValue.toLowerCase()) &&
            city.AreaDescription === form.region.name
        );
    } catch (error) {
        console.error('Помилка пошуку міст:', error);
        citiesNova.value = [];
    }
});

// ==== Жизненный цикл ====
onMounted(() => {
    authStore.getCurrentUser();
});
</script>

<template>
    <div class="agency-form-container">
        <Toast />

        <h2 class="text-2xl font-bold mb-6">{{ isEditing ? 'Редагувати Агенцію' : 'Зареєструвати Агенцію' }}</h2>

        <form @submit.prevent="submitForm" class="space-y-4">
            <!-- Agency Name -->
            <div class="card flex flex-col gap-4 border p-4 rounded-md">
                <div class="font-semibold text-xl">Назва агентства</div>
                <InputText
                    v-model="form.name"
                    type="text"
                    placeholder="Введіть назву агентства"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    :class="{ 'p-invalid': v$.name.$error }"
                    @input="v$.name.$touch()"
                />
                <span v-if="v$.name.$error" class="text-red-500 text-sm">{{ v$.name.$errors[0].$message }}</span>

                <!-- Location Section -->
                <div class="font-semibold text-xl">Розташування</div>

                <!-- Region Selection -->
                <div>
                    <div class="font-semibold text-md mb-2">
                        <span>Область</span>
                        <span class="ml-1 text-red-500">*</span>
                    </div>
                    <Select v-model="form.region" :options="regions" optionLabel="name" placeholder="Виберіть область" class="w-full" :class="{ 'p-invalid': v$.region.$error }" @change="changeRegion" />
                    <small v-if="v$.region.$error" class="text-red-500">
                        {{ v$.region.$errors[0].$message }}
                    </small>
                </div>

                <!-- City Selection -->
                <div>
                    <div class="font-semibold text-md mb-2">
                        <span>Місто</span>
                        <span class="ml-1 text-red-500">*</span>
                    </div>

                    <p v-if="form.city?.Description" class="text-cyan-700 font-semibold mb-2">
                        Вибране місто: {{ form.city.Description }}
                        <span v-if="form.city.AreaDescription">({{ form.city.AreaDescription }})</span>
                    </p>

                    <InputText
                        v-model="searchQuery"
                        placeholder="Пошук міста"
                        class="w-full"
                        :class="{ 'p-invalid': v$.city.$error && !form.city }"
                        :disabled="!form.region"
                        @input="v$.city.$touch()"
                    />
                    <small v-if="v$.city.$error && !form.city" class="text-red-500">
                        {{ v$.city.$errors[0].$message }}
                    </small>

                    <!-- City Search Results -->
                    <ul v-if="citiesNova.length > 0 && searchQuery.length > 0" class="mt-2 bg-gray-100 rounded-lg shadow-md divide-y max-h-48 overflow-y-auto">
                        <li
                            v-for="city in citiesNova"
                            :key="city.Ref"
                            @click="selectCity(city)"
                            class="p-2 cursor-pointer hover:bg-blue-100"
                        >
                            <span>{{ city.Description }}</span>
                            <span v-if="city.RegionsDescription">({{ city.RegionsDescription }} р-н)</span>
                        </li>
                    </ul>

                    <!-- Helper Messages -->
                    <p v-if="!form.region" class="mt-1 text-gray-600 text-sm">виберіть спочатку область для пошуку міст</p>
                    <p v-else-if="form.region && searchQuery.length === 0 && form.city === null" class="mt-1 text-gray-600 text-sm">почніть вводити назву міста</p>
                    <p v-if="form.region && searchQuery.length > 0 && citiesNova.length === 0" class="mt-1 text-gray-600 text-sm">міста не знайдено</p>

                    <small v-if="v$.city.$error && form.city && !form.city?.Description" class="text-red-500">
                        {{ v$.city.$errors[0].$message }}
                    </small>
                </div>

                <!-- Map -->
                <div v-if="form.city" class="map-container mt-4">
                    <div class="font-semibold text-md mb-2">
                        <span>Місце на карті</span>
                    </div>
                    <VueLeafle
                        :centerMap="centerMap"
                        v-model:marker="form.markerPosition"
                        style="height: 300px; width: 100%"
                    />
                </div>

                <!-- Address -->
                <div>
                    <label for="address" class="block text-sm font-medium text-gray-700">
                        Адреса (вулиця, будинок)
                    </label>
                    <InputText
                        id="address"
                        v-model="form.address"
                        type="text"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        :class="{ 'p-invalid': v$.address.$error }"
                        @input="v$.address.$touch()"
                    />
                    <span v-if="v$.address.$error" class="text-red-500 text-sm">
                        {{ v$.address.$errors[0].$message }}
                    </span>
                </div>
            </div>

            <!-- Phone Numbers -->
            <div>
                <label class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">
                    <span>Телефон(и)</span>
                    <span class="ml-1 text-red-500">*</span>
                </label>

                <!-- Список телефонов -->
                <div v-for="(phone, index) in form.phone" :key="'phone-'+index" class="mb-4 flex items-center gap-2">
                    <InputMask
                        :id="'phone' + index"
                        v-model="form.phone[index]"
                        type="tel"
                        mask="(999) 999-9999"
                        placeholder="(999) 999-9999"
                        class="w-full"
                        @input="v$.phone.$touch()"
                    />
                    <Button
                        v-if="form.phone.length > 1"
                        icon="pi pi-trash"
                        class="p-button-danger p-button-outlined"
                        @click="removePhoneNumber(index)"
                        type="button"
                    />
                </div>

                <!-- Новый телефон и кнопка добавления -->
                <div class="flex gap-2 mb-2">
                    <InputMask
                        v-model="newPhoneNumber"
                        type="tel"
                        mask="(999) 999-9999"
                        placeholder="(999) 999-9999"
                        class="w-full"
                    />
                    <Button
                        icon="pi pi-plus"
                        class="p-button-success p-button-outlined"
                        @click="addPhoneNumber"
                        type="button"
                    />
                </div>

                <!-- Валидация -->
                <span v-if="v$.phone.$error" class="text-red-500 text-sm">
                    {{ v$.phone.$errors[0].$message }}
                </span>
            </div>

            <!-- Email -->
            <div>
                <label for="email" class="block text-sm font-medium text-gray-700">
                    Email <span class="ml-1 text-red-500">*</span>
                </label>
                <InputText
                    id="email"
                    v-model="form.email"
                    type="email"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    :class="{ 'p-invalid': v$.email.$error }"
                    @input="v$.email.$touch()"
                />
                <span v-if="v$.email.$error" class="text-red-500 text-sm">
                    {{ v$.email.$errors[0].$message }}
                </span>
            </div>

            <!-- Website -->
            <div>
                <label for="website" class="block text-sm font-medium text-gray-700">
                    Вебсайт <span class="ml-1 text-red-500">*</span>
                </label>
                <InputText
                    id="website"
                    v-model="form.website"
                    type="url"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    :class="{ 'p-invalid': v$.website.$error }"
                    @input="v$.website.$touch()"
                />
                <span v-if="v$.website.$error" class="text-red-500 text-sm">
                    {{ v$.website.$errors[0].$message }}
                </span>
            </div>

            <!-- Logo Upload -->
            <div>
                <label for="logo" class="block text-sm font-medium text-gray-700">Логотип</label>
                <input
                    id="logo"
                    type="file"
                    @change="handleLogoChange"
                    accept="image/*"
                    class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
                <span v-if="logoError" class="text-red-500 text-sm">{{ logoError }}</span>
                <div v-if="form.logoUrl" class="mt-2">
                    <img :src="form.logoUrl" alt="Logo Preview" class="max-h-20" />
                    <Button
                        label="Очистити лого"
                        icon="pi pi-times"
                        class="p-button-text p-button-danger p-button-sm mt-2"
                        @click="clearLogo"
                        type="button"
                    />
                </div>
                <div v-else-if="form.logoFile" class="mt-2">
                    <p class="text-sm text-gray-600">Вибрано файл: {{ form.logoFile.name }}</p>
                    <Button
                        label="Очистити"
                        icon="pi pi-times"
                        class="p-button-text p-button-danger p-button-sm mt-1"
                        @click="clearSelectedLogoFile"
                        type="button"
                    />
                </div>
            </div>

            <!-- Form Actions -->
            <div class="flex space-x-4">
                <Button
                    type="submit"
                    :label="isEditing ? 'Зберегти зміни' : 'Створити Агенцію'"
                    :loading="isSubmitting"
                    class="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                />

                <Button
                    type="button"
                    label="Скасувати"
                    class="p-button-secondary"
                    @click="resetForm"
                />
            </div>
        </form>
    </div>
</template>

<style scoped>
.agency-form-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 2rem;
    border-radius: 0.5rem;
    box-shadow:
        0 4px 6px -1px rgba(0, 0, 0, 0.1),
        0 2px 4px -1px rgba(0, 0, 0, 0.06);
    background-color: white;
}

.p-invalid {
    border-color: #ef4444 !important;
}

.max-h-48 {
    max-height: 12rem;
}

.flex-shrink-0 {
    flex-shrink: 0;
}

.break-all {
    word-break: break-all;
}
</style>
