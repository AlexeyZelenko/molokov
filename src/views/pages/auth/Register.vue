<script setup>
import FloatingConfigurator from '@/components/FloatingConfigurator.vue';
import { ref, computed, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/authFirebase';
import { useUserStore } from '@/store/userStore';
import { useApartmentsStore } from '@/store/apartments';
import { useAgencyStore } from '@/store/agencyStore';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
import InputText from 'primevue/inputtext';
import InputMask from 'primevue/inputmask';
import Password from 'primevue/password';
import Checkbox from 'primevue/checkbox';
import Button from 'primevue/button';
import Select from 'primevue/select';
import { getSettlements } from '@/services/novaPoshtaService';
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import RegisterAgency from '@/components/agencies/RegisterAgency.vue';

const toast = useToast();

// Form fields
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const name = ref('');
const phones = ref(['']);
const error = ref('');
const router = useRouter();
const authStore = useAuthStore();
const remember = ref(false);
const loading = computed(() => authStore.loading);
const searchQuery = ref('');

const addPhone = () => {
    phones.value.push('');
};

const removePhone = (index) => {
    phones.value.splice(index, 1);
};

// Form object for validations
const form = ref({
    region: null,
    city: null,
    role: null,
    agency: null,
    selectedAgency: null
});

// Validation rules
const rules = {
    region: { required },
    city: { required },
    role: { required }
};

const userStore = useUserStore();
const rolesUsers = computed(() => userStore.userTypes.filter((role) => role.showOnRegistration));

const agencyStore = useAgencyStore();
const agencies = computed(() => {
    return agencyStore.agencies.map((agency) => ({
        name: agency.name,
        creator: agency.creator,
        id: agency.id
    }));
});
// Когда пользователь вводит вручную
const onManualInput = () => {
    if (form.value.agency !== '') {
        form.value.selectedAgency = null;
    }
};

// Когда пользователь выбирает из выпадающего списка
const onDropdownSelect = () => {
    if (form.value.selectedAgency) {
        form.value.agency = null;
    }
};

const v$ = useVuelidate(rules, form);
const apartmentsStore = useApartmentsStore();
const regions = apartmentsStore.dropdowns.regions;
const citiesNova = ref([]);

// Location selection methods
const changeRegion = () => {
    form.value.city = null;
    citiesNova.value = [];
    v$.value.region.$touch();
    v$.value.city.$touch();
    searchQuery.value = '';
};

const selectCity = (city) => {
    form.value.city = city;
    searchQuery.value = '';
    citiesNova.value = [];
    // Removed duplicate line: searchQuery.value = '';

    v$.value.city.$touch();
};

// Watchers
watch(searchQuery, async (newValue) => {
    if (!form.value.region || !newValue) {
        citiesNova.value = [];
        return;
    }

    try {
        const response = await getSettlements({
            FindByString: newValue,
            RegionRef: form.value.region.Ref
        });

        citiesNova.value = response.filter((city) => city.Description.toLowerCase().includes(newValue.toLowerCase()) && city.AreaDescription === form.value.region.name);
    } catch (error) {
        console.error('Помилка пошуку міст:', error);
        citiesNova.value = [];
    }
});

const handleRegister = async () => {
    // Basic form validation
    if (!email.value || !password.value || !confirmPassword.value || !name.value || !phones.value) {
        error.value = 'Будь ласка, заповніть усі поля';
        return;
    }

    if (password.value !== confirmPassword.value) {
        error.value = 'Паролі не співпадають';
        return;
    }

    // Additional validation for location fields
    if (!form.value.region || !form.value.city) {
        error.value = 'Виберіть область та місто';
        return;
    }

    try {
        await authStore.register({
            email: email.value,
            password: password.value,
            name: name.value,
            phones: [...phones.value],
            remember: remember.value,
            agency: form.value.selectedAgency || form.value.agency || 'Без агентства',
            region: form.value.region,
            city: form.value.city,
            role: form.value.role
        });

        showTemplate();
    } catch (err) {
        error.value = err.message;
    }
};

const visible = ref(false);
const onClose = () => {
    visible.value = false;
    router.push('/');
};
const toAddProperties = () => {
    visible.value = false;
    router.push('/add-properties');
};

const toHomePage = () => {
    visible.value = false;
    router.push('/');
};

const showTemplate = () => {
    if (!visible.value) {
        toast.add({ severity: 'success', summary: 'Реєстрація успішна!', group: 'bc' });
        visible.value = true;
    }
};

onMounted(async () => {
    await agencyStore.fetchAgencies();
});
</script>

<template>
    <FloatingConfigurator />
    <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden mt-2">
        <div class="flex flex-col items-center justify-center">
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full bg-surface-0 dark:bg-surface-900 py-10 px-8 sm:px-20" style="border-radius: 53px">
                    <div class="text-center mb-4">
                        <svg viewBox="0 0 54 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="mb-4 w-16 shrink-0 mx-auto">
                            <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M17.1637 19.2467C17.1566 19.4033 17.1529 19.561 17.1529 19.7194C17.1529 25.3503 21.7203 29.915 27.3546 29.915C32.9887 29.915 37.5561 25.3503 37.5561 19.7194C37.5561 19.5572 37.5524 19.3959 37.5449 19.2355C38.5617 19.0801 39.5759 18.9013 40.5867 18.6994L40.6926 18.6782C40.7191 19.0218 40.7326 19.369 40.7326 19.7194C40.7326 27.1036 34.743 33.0896 27.3546 33.0896C19.966 33.0896 13.9765 27.1036 13.9765 19.7194C13.9765 19.374 13.9896 19.0316 14.0154 18.6927L14.0486 18.6994C15.0837 18.9062 16.1223 19.0886 17.1637 19.2467ZM33.3284 11.4538C31.6493 10.2396 29.5855 9.52381 27.3546 9.52381C25.1195 9.52381 23.0524 10.2421 21.3717 11.4603C20.0078 11.3232 18.6475 11.1387 17.2933 10.907C19.7453 8.11308 23.3438 6.34921 27.3546 6.34921C31.36 6.34921 34.9543 8.10844 37.4061 10.896C36.0521 11.1292 34.692 11.3152 33.3284 11.4538ZM43.826 18.0518C43.881 18.6003 43.9091 19.1566 43.9091 19.7194C43.9091 28.8568 36.4973 36.2642 27.3546 36.2642C18.2117 36.2642 10.8 28.8568 10.8 19.7194C10.8 19.1615 10.8276 18.61 10.8816 18.0663L7.75383 17.4411C7.66775 18.1886 7.62354 18.9488 7.62354 19.7194C7.62354 30.6102 16.4574 39.4388 27.3546 39.4388C38.2517 39.4388 47.0855 30.6102 47.0855 19.7194C47.0855 18.9439 47.0407 18.1789 46.9536 17.4267L43.826 18.0518ZM44.2613 9.54743L40.9084 10.2176C37.9134 5.95821 32.9593 3.1746 27.3546 3.1746C21.7442 3.1746 16.7856 5.96385 13.7915 10.2305L10.4399 9.56057C13.892 3.83178 20.1756 0 27.3546 0C34.5281 0 40.8075 3.82591 44.2613 9.54743Z"
                                fill="var(--primary-color)"
                            />
                        </svg>
                        <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Ласкаво просимо у Світ Нерухомості!</div>
                        <span class="text-muted-color font-medium">Зареєструйтесь, щоб продовжити</span>
                    </div>

                    <!-- Форма входа -->
                    <div>
                        <section>
                            <label for="role" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">
                                <span>Виберіть роль</span>
                                <span class="ml-1 text-red-500">*</span>
                            </label>
                            <Select v-model="form.role" :options="rolesUsers" optionLabel="name" placeholder="Виберіть роль" class="mb-4 w-full" :class="{ 'p-invalid': v$.role.$error }" @change="v$.role.$touch()" />
                            <small v-if="v$.role.$error" class="text-red-500">
                                {{ v$.role.$errors[0].$message }}
                            </small>
                        </section>

                        <section>
                            <!-- Location Section -->
                            <div class="font-semibold text-xl">Розташування</div>

                            <!-- Region Selection -->
                            <div class="mb-4">
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
                            <div class="mb-4">
                                <div class="font-semibold text-md mb-2">
                                    <span>Місто</span>
                                    <span class="ml-1 text-red-500">*</span>
                                </div>

                                <p v-if="form.city?.Description" class="text-cyan-700 font-semibold mb-2">
                                    Вибране місто: {{ form.city.Description }}
                                    <span v-if="form.city.AreaDescription">({{ form.city.AreaDescription }})</span>
                                </p>

                                <InputText v-model="searchQuery" placeholder="Пошук міста" class="w-full" :class="{ 'p-invalid': v$.city.$error && !form.city }" :disabled="!form.region" @input="v$.city.$touch()" />
                                <small v-if="v$.city.$error && !form.city" class="text-red-500">
                                    {{ v$.city.$errors[0].$message }}
                                </small>

                                <!-- City Search Results -->
                                <ul v-if="citiesNova.length > 0 && searchQuery.length > 0" class="mt-2 bg-gray-100 rounded-lg shadow-md divide-y max-h-48 overflow-y-auto">
                                    <li v-for="city in citiesNova" :key="city.Ref" @click="selectCity(city)" class="p-2 cursor-pointer hover:bg-blue-100">
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

                            <!-- Agency -->
                            <div v-if="form.role?.role === 'agent'" class="mb-4">
                                <label for="agency" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2"> Агенція </label>

                                <!-- Ручний ввід -->
                                <InputText id="agency" type="text" placeholder="Введіть назву агентства" class="mb-4 w-full" v-model="form.agency" @input="onManualInput" :disabled="form.selectedAgency !== null" />

                                <!-- Вибір зі списку -->
                                <Dropdown v-model="form.selectedAgency" :options="agencies" optionLabel="name" placeholder="Або оберіть із списку" class="w-full" @change="onDropdownSelect" :disabled="form.agency !== null" showClear />

                                <small class="text-gray-500 mt-2 block"> Ви можете або <strong>ввести агентство вручну</strong>, або <strong>обрати зі списку</strong> — не обидва. </small>
                            </div>

                            <div v-if="form.role?.role === 'agency_owner'" class="mb-4">
                                <RegisterAgency />
                            </div>
                        </section>

                        <section>
                            <label for="name1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">
                                <span>Name</span>
                                <span class="ml-1 text-red-500">*</span>
                            </label>
                            <InputText id="name1" type="text" placeholder="Name" class="mb-4 w-full" v-model="name" @keyup.enter="handleRegister" />

                            <label for="email1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">
                                <span>Email</span>
                                <span class="ml-1 text-red-500">*</span>
                            </label>
                            <InputText id="email1" type="email" placeholder="Email address" class="mb-4 w-full" v-model="email" @keyup.enter="handleRegister" />

                            <div>
                                <label class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">
                                    <span>Телефон(и)</span>
                                    <span class="ml-1 text-red-500">*</span>
                                </label>

                                <!-- Список телефонов -->
                                <div v-for="(phone, index) in phones" :key="index" class="mb-4 flex items-center gap-2">
                                    <InputMask :id="'phone' + index" v-model="phones[index]" type="tel" mask="(999) 999-9999" placeholder="(999) 999-9999" class="w-full" @keyup.enter="handleRegister" />
                                    <Button v-if="phones.length > 1" icon="pi pi-trash" class="p-button-danger p-button-outlined" @click="removePhone(index)" />
                                </div>

                                <!-- Кнопка добавить телефон -->
                                <Button icon="pi pi-plus" label="Додати ще телефон" class="p-button-success p-button-outlined mb-4" @click="addPhone" />
                            </div>

                            <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">
                                <span>Пароль</span>
                                <span class="ml-1 text-red-500">*</span>
                            </label>
                            <Password id="password1" v-model="password" placeholder="Придумайте пароль" :toggleMask="true" class="mb-4 w-full" :feedback="true" @keyup.enter="handleRegister" />

                            <label for="confirmPassword1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">
                                <span>Підтвердження пароля</span>
                                <span class="ml-1 text-red-500">*</span>
                            </label>
                            <InputText id="confirmPassword1" type="password" placeholder="Підтвердьте пароль" class="mb-4 w-full" v-model="confirmPassword" @keyup.enter="handleRegister" />

                            <div v-if="error" class="error mb-4">{{ error }}</div>

                            <p class="text-muted-color font-medium mb-8">
                                <span class="mr-1 text-red-500">*</span>
                                <span>Обов'язкові поля</span>
                            </p>

                            <div class="flex items-center justify-between mt-2 gap-8 mb-6">
                                <div class="flex items-center">
                                    <Checkbox v-model="remember" id="rememberme1" binary class="mr-2"></Checkbox>
                                    <label for="rememberme1">Запам'ятай мене</label>
                                </div>
                            </div>
                        </section>

                        <Button :label="loading ? 'реєстрація...' : 'Зареєструватись'" class="mb-4 w-full" :disabled="loading" @click="!loading && handleRegister()" />

                        <router-link to="/auth/login" class="flex justify-center">
                            <div class="text-blue-500 dark:hover:text-blue-500-darker">Увійти</div>
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <Toast />
    <Toast position="bottom-center" group="bc" @close="onClose">
        <template #message="slotProps">
            <div class="flex flex-col items-start flex-auto">
                <div class="flex items-center gap-2">
                    <span class="font-bold">Вітаємо {{ name }}!</span>
                </div>
                <div class="font-medium text-lg my-4">{{ slotProps.message.summary }}</div>
                <Button size="small" label="Додати нерухомість >>" severity="success" @click="toAddProperties()" class="m-4 w-full"></Button>
                <Button size="small" label="Перейти на домашню сторінку >>" severity="success" @click="toHomePage()" class="m-4 w-full"></Button>
            </div>
        </template>
    </Toast>
</template>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}

.error {
    color: red;
    margin: 10px 0;
}
</style>
