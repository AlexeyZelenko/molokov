<script setup>
import { ref, reactive, computed, watch } from 'vue';
import { useAgencyStore } from '@/store/agencyStore';
// useApartmentsStore та regions імпортуються з прикладу, можливо, вам потрібно інше джерело для regions
import { useApartmentsStore } from '@/store/apartments';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Select from 'primevue/select';
import { useVuelidate } from '@vuelidate/core';
import { required, email, helpers, minLength } from '@vuelidate/validators';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useToast } from 'primevue/usetoast';
import { v4 as uuidv4 } from 'uuid';

import VueLeafle from '@/components/maps/VueLeafle.vue'; // Імпортуємо компонент мапи

// Припускаємо, що список областей отримується з apartmentsStore або іншого централізованого місця
const apartmentsStore = useApartmentsStore();
const regions = apartmentsStore.dropdowns.regions;

// Припускаємо, що у вас є такий сервіс для пошуку міст
import { getSettlements } from '@/services/novaPoshtaService';


const toast = useToast();

const props = defineProps({
    agency: {
        type: Object,
        default: null
    }
});

const isEditing = computed(() => !!props.agency);
const agencyStore = useAgencyStore();

const newPhoneNumber = ref(''); // Для додавання телефонів
const searchQuery = ref(''); // Для пошуку міст
const citiesNova = ref([]); // Результати пошуку міст

// Змінна для центрування мапи. Оновлюється при виборі міста.
const centerMap = ref(null);

// Форма ініціалізується даними з пропсу agency або пустими значеннями
const form = reactive({
    name: props.agency?.name || '',
    address: props.agency?.address || '', // Адреса (вулиця, будинок)
    phone: props.agency?.phone || [], // phone є масивом
    email: props.agency?.email || '',
    website: props.agency?.website || '',
    logoUrl: props.agency?.logoUrl || null,
    logoFile: null,
    region: props.agency?.region || null, // Об'єкт області
    city: props.agency?.city || null, // Об'єкт міста (нас. пункту НП)
    // Додано поле для позиції маркера
    // Припускаємо, що agency.markerPosition є масивом [lat, lng]
    markerPosition: props.agency?.markerPosition || []
});

const rules = computed(() => ({
    name: { required: helpers.withMessage("Назва обов'язкова", required) },
    address: { required: helpers.withMessage("Адреса обов'язкова", required) },
    phone: {
        required: helpers.withMessage('Потрібен хоча б один телефон', required),
        minLength: helpers.withMessage('Потрібен хоча б один телефон', minLength(1))
    },
    email: { required: helpers.withMessage("Email обов'язковий", required), email: helpers.withMessage('Невірний формат Email', email) },
    website: { required: helpers.withMessage("Вебсайт обов'язковий", required) },
    region: { required: helpers.withMessage("Область обов'язкова", required) },
    city: {
        required: helpers.withMessage("Місто обов'язкове", required),
        isObject: helpers.withMessage('Виберіть місто зі списку', (value) => typeof value === 'object' && value !== null && !Array.isArray(value) && value.Description)
    }
    // markerPosition можна зробити обов'язковим, якщо потрібно, наприклад:
    // markerPosition: {
    //     required: helpers.withMessage("Вкажіть місце на карті", required),
    //     isNotEmptyArray: helpers.withMessage("Вкажіть місце на карті", (value) => Array.isArray(value) && value.length === 2)
    // }
}));

const v$ = useVuelidate(rules, form);
const isSubmitting = ref(false);
const logoError = ref(null);

const handleLogoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        form.logoFile = file;
        // form.logoUrl = URL.createObjectURL(file); // Локальний preview
    } else {
        form.logoFile = null;
        // Якщо ви використовуєте локальний URL: URL.revokeObjectURL(form.logoUrl);
    }
};

const clearSelectedLogoFile = () => {
    form.logoFile = null;
    const fileInput = document.getElementById('logo');
    if (fileInput) {
        fileInput.value = '';
    }
};

const addPhoneNumber = () => {
    if (newPhoneNumber.value.trim()) {
        form.phone.push(newPhoneNumber.value.trim());
        newPhoneNumber.value = '';
        v$.value.phone.$touch();
    }
};

const removePhoneNumber = (index) => {
    form.phone.splice(index, 1);
    v$.value.phone.$touch();
};

// Функція, що викликається при зміні області
const changeRegion = () => {
    form.city = null; // Скидаємо вибране місто
    searchQuery.value = ''; // Скидаємо пошуковий запит
    citiesNova.value = []; // Очищаємо результати пошуку
    form.markerPosition = []; // Скидаємо позицію маркера при зміні області
    centerMap.value = null; // Скидаємо центр мапи
    v$.value.region.$touch();
    v$.value.city.$touch();
    // Якщо додали валідацію markerPosition, також торкніться її
    // if (v$.value.markerPosition) v$.value.markerPosition.$touch();
};

// Функція, що викликається при виборі міста зі списку
const selectCity = (city) => {
    console.log('Вибране місто:', city);
    form.city = city; // Записуємо вибране місто в форму
    searchQuery.value = ''; // Очищаємо поле пошуку
    citiesNova.value = []; // Приховуємо список результатів

    // Встановлюємо центр мапи на координати вибраного міста
    if (city.Latitude && city.Longitude) {
        centerMap.value = [Number(city.Latitude), Number(city.Longitude)];
        // Опціонально: скинути маркер на центр міста при виборі міста
        // form.markerPosition = [Number(city.Latitude), Number(city.Longitude)];
        // Якщо додали валідацію markerPosition, торкніться її
        // if (v$.value.markerPosition) v$.value.markerPosition.$touch();
    } else {
        centerMap.value = null; // Якщо координати відсутні
        // form.markerPosition = []; // Очистити маркер, якщо координати відсутні
        // Якщо додали валідацію markerPosition, торкніться її
        // if (v$.value.markerPosition) v$.value.markerPosition.$touch();
    }

    v$.value.city.$touch();
};


const submitForm = async () => {
    const result = await v$.value.$validate();
    if (!result) {
        console.error('Validation failed.');
        console.error('Validation errors:', v$.value.$errors);
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
        let logoUrl = form.logoUrl;
        if (form.logoFile) {
            const storage = getStorage();
            const fileExtension = form.logoFile.name.split('.').pop();
            const uniqueFileName = `${uuidv4()}.${fileExtension}`;
            const logoRef = storageRef(storage, `agencies/${uniqueFileName}`);

            console.log('Uploading logo to:', `agencies/${uniqueFileName}`);
            await uploadBytes(logoRef, form.logoFile);
            logoUrl = await getDownloadURL(logoRef);
            console.log('Logo uploaded. URL:', logoUrl);

            clearSelectedLogoFile();
        } else if (form.logoUrl === null && props.agency?.logoUrl) {
            logoUrl = null; // Користувач очистив існуюче лого
            // TODO: Реалізувати видалення старого лого з Storage, якщо logoUrl стало null
        }


        const agencyData = { ...form, logoUrl };
        delete agencyData.logoFile;
        // Переконайтесь, що store може обробляти agencyData, яка включає region, city та markerPosition

        console.log('Agency data to submit. Is Editing:', isEditing.value, agencyData);

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
            clearForm(); // Очищаємо форму після створення
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        logoError.value = error.message;
        toast.add({
            severity: 'error',
            summary: 'Помилка збереження.',
            detail: error.message || 'Не вдалося зберегти дані агенції.',
            life: 5000
        });
    } finally {
        isSubmitting.value = false;
    }
};

// Watcher для пошукового запиту міст
watch(searchQuery, async (newValue) => {
    if (!form.region || !newValue) {
        citiesNova.value = [];
        return;
    }
    // Опціонально: додати debounce
    try {
        const response = await getSettlements({ FindByString: newValue, RegionRef: form.region.Ref });
        citiesNova.value = response.filter(
            (city) => city.Description.toLowerCase().includes(newValue.toLowerCase()) &&
                city.AreaDescription === form.region.name // Фільтруємо за назвою області
            // Або city.RegionRef === form.region.Ref, якщо API повертає RegionRef
        );
        console.log('Знайдено міст:', citiesNova.value);
    } catch (error) {
        console.error('Ошибка поиска городов:', error);
        citiesNova.value = [];
    }
});

// Функції скидання форми та лого
const resetForm = () => {
    form.name = props.agency?.name || '';
    form.address = props.agency?.address || '';
    form.phone = props.agency?.phone || [];
    form.email = props.agency?.email || '';
    form.website = props.agency?.website || '';
    form.logoUrl = props.agency?.logoUrl || null;
    form.region = props.agency?.region || null;
    form.city = props.agency?.city || null;
    form.markerPosition = props.agency?.markerPosition || []; // Скидаємо позицію маркера

    clearSelectedLogoFile();
    newPhoneNumber.value = '';
    searchQuery.value = '';
    citiesNova.value = [];
    centerMap.value = null; // Скидаємо центр мапи

    v$.value.$reset();
};

const clearLogo = () => {
    form.logoUrl = null;
    clearSelectedLogoFile();
};

const clearForm = () => {
    resetForm();
};

</script>

<template>
    <div class="agency-form-container">
        <Toast />

        <h2 class="text-2xl font-bold mb-6">{{ isEditing ? 'Редагувати Агенцію' : 'Зареєструвати Агенцію' }}</h2>

        <form @submit.prevent="submitForm" class="space-y-4">
            <div class="card flex flex-col gap-4 border p-4 rounded-md">
                <div class="font-semibold text-xl">Назва агенства</div>
                <InputText
                    v-model="form.name"
                    type="text"
                    placeholder="Введіть назву агенства"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    :class="{ 'p-invalid': v$.name.$error }"
                    @input="v$.name.$touch()"
                />
                <span v-if="v$.name.$error" class="text-red-500 text-sm">{{ v$.name.$errors[0].$message }}</span>

                <div class="font-semibold text-xl">Розташування</div>

                <div>
                    <div class="font-semibold text-md mb-2">
                        <span>Область</span>
                        <span class="ml-1 text-red-500">*</span>
                    </div>
                    <Select
                        v-model="form.region"
                        :options="regions"
                        optionLabel="name"
                        placeholder="Виберіть область"
                        class="w-full"
                        :class="{ 'p-invalid': v$.region.$error }"
                        @change="changeRegion"
                    />
                    <small class="text-red-500" v-if="v$.region.$error">
                        {{ v$.region.$errors[0].$message }}
                    </small>
                </div>

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
                    <small class="text-red-500" v-if="v$.city.$error && !form.city">
                        {{ v$.city.$errors[0].$message }}
                    </small>

                    <ul v-if="citiesNova.length > 0 && searchQuery.length > 0" class="mt-2 bg-gray-100 rounded-lg shadow-md divide-y max-h-48 overflow-y-auto">
                        <li v-for="city in citiesNova" :key="city.Ref" @click="selectCity(city)" class="p-2 cursor-pointer hover:bg-blue-100">
                            <span>{{ city.Description }}</span>
                            <span v-if="city.RegionsDescription">({{ city.RegionsDescription }} р-н)</span>
                        </li>
                    </ul>
                    <p v-if="!form.region" class="mt-1 text-gray-600 text-sm">виберіть спочатку область для пошуку міст</p>
                    <p v-else-if="form.region && searchQuery.length === 0 && form.city === null" class="mt-1 text-gray-600 text-sm">почніть вводити назву міста</p>
                    <p v-if="form.region && searchQuery.length > 0 && citiesNova.length === 0" class="mt-1 text-gray-600 text-sm">міста не знайдено</p>

                    <small class="text-red-500" v-if="v$.city.$error && form.city && !form.city?.Description">
                        {{ v$.city.$errors[0].$message }}
                    </small>
                </div>

                <div v-if="form.city" class="map-container mt-4">
                    <div class="font-semibold text-md mb-2">
                        <span>Місце на карті</span>
                    </div>
                    <VueLeafle
                        :centerMap="centerMap"
                        v-model:marker="form.markerPosition"
                        style="height: 300px; width: 100%;" />
                </div>

                <div>
                    <label for="address" class="block text-sm font-medium text-gray-700">Адреса (вулиця, будинок)</label>
                    <InputText id="address" v-model="form.address" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" :class="{ 'p-invalid': v$.address.$error }" />
                    <span v-if="v$.address.$error" class="text-red-500 text-sm">{{ v$.address.$errors[0].$message }}</span>
                </div>

            </div>


            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Телефони</label>

                <div v-if="form.phone.length > 0" class="space-y-2 mb-4">
                    <div v-for="(phone, index) in form.phone" :key="index" class="flex items-center space-x-2">
                        <span class="block w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-gray-50 text-gray-700 sm:text-sm break-all">
                            {{ phone }}
                        </span>
                        <Button icon="pi pi-times" class="p-button-rounded p-button-danger p-button-text flex-shrink-0" @click="removePhoneNumber(index)" />
                    </div>
                </div>

                <div class="flex space-x-2">
                    <InputText
                        v-model="newPhoneNumber"
                        type="text"
                        placeholder="Введіть номер телефону"
                        class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        @keyup.enter="addPhoneNumber"
                    />
                    <Button label="Додати" icon="pi pi-plus" class="p-button-primary flex-shrink-0" @click="addPhoneNumber" />
                </div>
                <span v-if="v$.phone.$error" class="text-red-500 text-sm">{{ v$.phone.$errors[0].$message }}</span>
            </div>

            <div>
                <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                <InputText id="email" v-model="form.email" type="email" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" :class="{ 'p-invalid': v$.email.$error }" />
                <span v-if="v$.email.$error" class="text-red-500 text-sm">{{ v$.email.$errors[0].$message }}</span>
            </div>

            <div>
                <label for="website" class="block text-sm font-medium text-gray-700">Вебсайт</label>
                <InputText id="website" v-model="form.website" type="url" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" :class="{ 'p-invalid': v$.website.$error }" />
                <span v-if="v$.website.$error" class="text-red-500 text-sm">{{ v$.website.$errors[0].$message }}</span>
            </div>

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
                <img v-if="form.logoUrl" :src="form.logoUrl" alt="Logo Preview" class="mt-2 max-h-20" />
                <Button v-if="form.logoUrl || form.logoFile" label="Очистити лого" icon="pi pi-times" class="p-button-text p-button-danger p-button-sm mt-2" @click="clearLogo" />
            </div>

            <div class="flex space-x-4">
                <Button type="submit" :label="isEditing ? 'Зберегти зміни' : 'Створити Агенцію'" :loading="isSubmitting" class="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" />

                <Button type="button" label="Скасувати" class="p-button-secondary" @click="clearForm" v-if="isEditing" />
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

/* Стиль для поля з помилкою від PrimeVue */
.p-invalid {
    border-color: #ef4444 !important; /* Червоний колір */
}
/* Додаткові стилі, якщо потрібні для .p-invalid:focus */

.max-h-48 {
    max-height: 12rem; /* 12 * 16px = 192px */
}

.flex-shrink-0 {
    flex-shrink: 0;
}

.break-all {
    word-break: break-all; /* Перенесення довгих номерів телефонів */
}

/* Стиль для контейнера мапи */
.map-container {
    /* Опціональні стилі, якщо потрібен бордер або фон */
    /* border: 1px solid #ccc; */
    /* padding: 1rem; */
    /* border-radius: 0.5rem; */
}
</style>
