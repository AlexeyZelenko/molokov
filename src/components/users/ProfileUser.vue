<script setup lang="ts">
import { ref, onMounted, computed, watchEffect } from 'vue';
import { useUserStore } from '@/store/userStore';
import { useAuthStore } from '@/store/authFirebase';
import { useApartmentsStore } from '@/store/apartments';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import FileUpload from 'primevue/fileupload';
import Toast from 'primevue/toast';
import Select from 'primevue/select';
import { useToast } from 'primevue/usetoast';
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getSettlements } from '@/services/novaPoshtaService';
import { debounce } from 'lodash-es'; // Import debounce for performance

const props = defineProps({
    user: {
        type: Object,
        default: () => ({}) // Return empty object instead of null
    }
});

// Stores initialization
const apartmentsStore = useApartmentsStore();
const userStore = useUserStore();
const authStore = useAuthStore();
const toast = useToast();

// State variables
const isEditing = ref(false);
const isLoading = ref(false);
const searchQuery = ref('');
const citiesNova = ref([]);
const src = ref(null);
const currentUser = ref(null);

// Form state - initialized with default empty values
const editForm = ref({
    name: '',
    phones: [] as string[],
    avatar: '',
    agency: '',
    city: null,
    region: null,
    id: null
});

// Validation rules
const rules = {
    region: { required },
    city: { required }
};

const v$ = useVuelidate(rules, editForm);

// Computed properties
const regions = computed(() => apartmentsStore.dropdowns.regions);

// Firebase storage - initialize outside functions for reuse
const storage = getStorage();

// Debounced search function for better performance
const debouncedSearchCities = debounce(async (query) => {
    if (!editForm.value.region || !query || query.length < 2) {
        citiesNova.value = [];
        return;
    }

    try {
        const response = await getSettlements({
            FindByString: query,
            RegionRef: editForm.value.region.Ref
        });

        citiesNova.value = response.filter((city) =>
            city.Description.toLowerCase().includes(query.toLowerCase()) &&
            city.AreaDescription === editForm.value.region.name
        );
    } catch (error) {
        console.error('Помилка пошуку міст:', error);
        citiesNova.value = [];
    }
}, 300); // 300ms delay for better UX

// Watch for search query changes to trigger debounced search
watchEffect(() => {
    if (searchQuery.value) {
        debouncedSearchCities(searchQuery.value);
    } else {
        citiesNova.value = [];
    }
});

// Methods
function onFileSelect(event) {
    const file = event.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        src.value = e.target.result;
    };
    reader.readAsDataURL(file);
}

function changeRegion() {
    editForm.value.city = null;
    searchQuery.value = '';
    citiesNova.value = [];
    v$.value.region.$touch();
    v$.value.city.$touch();
}

function selectCity(city) {
    editForm.value.city = city;
    searchQuery.value = '';
    citiesNova.value = [];
    v$.value.city.$touch();
}

function startEditing() {
    isEditing.value = true;
}

async function saveProfile() {
    // Validate form first
    const isFormValid = await v$.value.$validate();
    if (!isFormValid) {
        toast.add({ severity: 'error', summary: 'Помилка', detail: 'Перевірте правильність заповнення форми', life: 3000 });
        return;
    }

    isLoading.value = true;
    try {
        await userStore.updateProfile(editForm.value);

        if (authStore.user) {
            await authStore.updateProfileUser({
                displayName: editForm.value.name,
                photoURL: editForm.value.avatar,
            });
        }

        isEditing.value = false;
        toast.add({ severity: 'success', summary: 'Успішно', detail: 'Профіль оновлено', life: 3000 });

    } catch (error) {
        console.error('Error updating profile:', error);
        toast.add({ severity: 'error', summary: 'Помилка', detail: 'Не вдалося оновити профіль', life: 3000 });
    } finally {
        await userStore.fetchUsers();
        await userStore.fetchUserProfile();
        initializeUserData();
        isLoading.value = false;
    }
}

function addPhoneField() {
    editForm.value.phones.push('');
}

function removePhoneField(index: number) {
    editForm.value.phones.splice(index, 1);
}

async function onAvatarUpload(event: any) {
    const file = event.files[0];
    if (!file) return;

    try {
        const fileRef = storageRef(storage, `avatars/${userStore.profile.uid}/${file.name}`);
        await uploadBytes(fileRef, file);
        const downloadURL = await getDownloadURL(fileRef);
        editForm.value.avatar = downloadURL;
        toast.add({ severity: 'success', summary: 'Успішно', detail: 'Аватар завантажено', life: 3000 });
    } catch (error) {
        console.error('Помилка при завантаженні аватара:', error);
        toast.add({ severity: 'error', summary: 'Помилка', detail: 'Не вдалося завантажити аватар', life: 3000 });
    }
}

// Initialize user data from props or store
function initializeUserData() {
    // If props.user exists and has data
    if (props.user && Object.keys(props.user).length > 0) {
        currentUser.value = props.user;
        populateEditForm(props.user);
    }
    // Fall back to userStore if needed
    else if (userStore.profile) {
        currentUser.value = userStore.profile;
        populateEditForm(userStore.profile);
    }
}

// Extract the form population logic to a separate function
function populateEditForm(userData) {
    editForm.value = {
        name: userData.name || '',
        phones: userData.phones || [],
        avatar: userData.avatar || '',
        agency: userData.agency || '',
        city: userData.city || null,
        region: userData.region || null,
        id: userData.id || null
    };
}

// Lifecycle hooks
onMounted(async () => {
    await userStore.fetchUserProfile();
    initializeUserData();
});
</script>

<template>
    <div class="max-w-2xl mx-auto p-6">
        <Toast />
        <h1 class="text-2xl font-bold mb-6 text-center">Особистий кабінет</h1>

        <div v-if="currentUser" class="bg-white rounded-lg shadow-lg p-6">
            <!-- View Mode -->
            <div v-if="!isEditing">
                <div class="mb-6">
                    <h2 class="text-lg font-semibold mb-4">Профіль</h2>
                    <div class="flex items-center space-x-6 mb-6">
                        <div class="relative">
                            <img
                                v-if="currentUser.avatar"
                                :src="currentUser.avatar"
                                alt="Аватар"
                                class="w-24 h-24 rounded-full object-cover border-4 border-blue-100"
                            />
                            <div v-else class="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-4 border-blue-100">
                                <span class="text-gray-500 text-xl">👤</span>
                            </div>
                        </div>
                        <div class="space-y-2">
                            <p class="text-lg font-semibold">{{ currentUser.name }}</p>
                            <p class="text-gray-600">{{ currentUser.email }}</p>
                        </div>
                    </div>

                    <div v-if="currentUser.role" class="space-y-2 my-2">
                        <span class="text-gray-600">Роль: </span>
                        <span class="font-medium">{{ currentUser.role?.name }}</span>
                    </div>

                    <div v-if="currentUser.city" class="space-y-2 my-2">
                        <span class="text-gray-600">Місто: </span>
                        <span class="font-medium">{{currentUser.region?.name}} / {{ currentUser.city?.Description }}</span>
                    </div>

                    <div v-if="currentUser.phones?.length" class="space-y-2">
                        <div v-for="(phone, index) in currentUser.phones" :key="index" class="flex items-center space-x-2">
                            <span class="text-gray-600">Телефон {{ index + 1 }}:</span>
                            <span class="font-medium">{{ phone }}</span>
                        </div>
                    </div>

                    <div v-if="currentUser.agency" class="mt-2">
                        <p class="text-gray-600">Агенція: {{ currentUser.agency }}</p>
                    </div>
                </div>
                <Button
                    label="Редагувати"
                    @click="startEditing"
                    class="p-button-primary w-full"
                    icon="pi pi-pencil"
                />
            </div>

            <!-- Edit Mode -->
            <form v-else @submit.prevent="saveProfile" class="space-y-6">
                <!-- Name field -->
                <div>
                    <label class="block mb-2 font-medium">Ім'я</label>
                    <InputText
                        v-model="editForm.name"
                        type="text"
                        class="w-full"
                        placeholder="Введіть ваше ім'я"
                    />
                </div>

                <!-- Agency field -->
                <div>
                    <label class="block mb-2 font-medium">Агенція нерухомості</label>
                    <InputText
                        v-model="editForm.agency"
                        type="text"
                        class="w-full"
                        placeholder="Введіть назву агенції в якій працюєте"
                    />
                </div>

                <!-- Region Selection -->
                <div>
                    <div class="font-semibold text-md mb-2">
                        <span>Область</span>
                        <span class="ml-1 text-red-500">*</span>
                    </div>
                    <Select
                        v-model="editForm.region"
                        :options="regions"
                        optionLabel="name"
                        placeholder="Виберіть область"
                        class="w-full"
                        :class="{ 'p-invalid': v$.region.$error }"
                        @change="changeRegion"
                    />
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

                    <p v-if="editForm.city?.Description" class="text-cyan-700 font-semibold mb-2">
                        Вибране місто: {{ editForm.city.Description }}
                        <span v-if="editForm.city.AreaDescription">({{ editForm.city.AreaDescription }})</span>
                    </p>

                    <InputText
                        v-model="searchQuery"
                        placeholder="Пошук міста"
                        class="w-full"
                        :class="{ 'p-invalid': v$.city.$error && !editForm.city }"
                        :disabled="!editForm.region"
                    />
                    <small v-if="v$.city.$error && !editForm.city" class="text-red-500">
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
                    <p v-if="!editForm.region" class="mt-1 text-gray-600 text-sm">Виберіть спочатку область для пошуку міст</p>
                    <p v-else-if="editForm.region && searchQuery.length === 0 && !editForm.city" class="mt-1 text-gray-600 text-sm">Почніть вводити назву міста</p>
                    <p v-else-if="editForm.region && searchQuery.length > 0 && citiesNova.length === 0" class="mt-1 text-gray-600 text-sm">Міста не знайдено</p>
                </div>

                <!-- Phone fields -->
                <div>
                    <label class="block mb-2 font-medium">Телефони</label>
                    <div v-for="(phone, index) in editForm.phones" :key="index" class="flex items-center space-x-2 mb-2">
                        <InputText
                            v-model="editForm.phones[index]"
                            type="tel"
                            class="w-full"
                            :placeholder="`Телефон ${index + 1}`"
                        />
                        <Button
                            type="button"
                            icon="pi pi-times"
                            @click="removePhoneField(index)"
                            class="p-button-danger"
                        />
                    </div>
                    <Button
                        type="button"
                        icon="pi pi-plus"
                        label="Додати телефон"
                        @click="addPhoneField"
                        class="p-button-secondary w-full"
                    />
                </div>

                <!-- Avatar upload -->
                <div>
                    <label class="block mb-2 font-medium">Аватар</label>
                    <div class="flex items-center space-x-6">
                        <div class="relative">
                            <img
                                v-if="editForm.avatar"
                                :src="editForm.avatar"
                                alt="Аватар"
                                class="w-24 h-24 rounded-full object-cover border-4 border-blue-100"
                            />
                            <div v-else class="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-4 border-blue-100">
                                <span class="text-gray-500 text-xl">👤</span>
                            </div>
                        </div>
                        <FileUpload
                            mode="basic"
                            accept="image/*"
                            @select="onFileSelect"
                            customUpload
                            auto
                            :maxFileSize="1000000"
                            chooseLabel="Змінити аватар"
                            @uploader="onAvatarUpload"
                            class="p-button-outlined"
                        />
                    </div>
                    <img
                        v-if="src"
                        :src="src"
                        alt="Image Preview"
                        class="shadow-md rounded-xl w-full sm:w-64 mt-4"
                        style="filter: grayscale(100%)"
                    />
                </div>

                <!-- Action buttons -->
                <div class="flex space-x-4">
                    <Button
                        type="submit"
                        label="Зберегти"
                        icon="pi pi-check"
                        class="p-button-success w-full"
                        :loading="isLoading"
                    />
                    <Button
                        type="button"
                        label="Скасувати"
                        icon="pi pi-times"
                        @click="isEditing = false"
                        class="p-button-secondary w-full"
                    />
                </div>
            </form>
        </div>
    </div>
</template>

<style scoped>
.bg-blue-100 {
    background-color: #dbeafe;
}
.border-blue-100 {
    border-color: #dbeafe;
}
</style>
