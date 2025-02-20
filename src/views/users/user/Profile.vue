<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/store/userStore';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import FileUpload from 'primevue/fileupload';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

const userStore = useUserStore();
const toast = useToast();
const isEditing = ref(false);
const editForm = ref({
    name: '',
    phones: [] as string[],
    avatar: '',
    agency: '',
});

const src = ref(null);

function onFileSelect(event) {
    const file = event.files[0];
    const reader = new FileReader();

    reader.onload = async (e) => {
        src.value = e.target.result;
    };

    reader.readAsDataURL(file);
}

const storage = getStorage();

onMounted(async () => {
    await userStore.fetchUserProfile();
    if (userStore.profile) {
        editForm.value = {
            name: userStore.profile.name,
            phones: userStore.profile.phones || [],
            avatar: userStore.profile.avatar || '',
            agency: userStore.profile.agency || '',
        };
    }
});

const startEditing = () => {
    isEditing.value = true;
};

const isLoading = ref(false); // Стан для відстеження завантаження
const saveProfile = async () => {
    if (!editForm.value.phones) {
        editForm.value.phones = [];
    }

    isLoading.value = true; // Початок завантаження
    try {
        await userStore.updateProfile(editForm.value);
        isEditing.value = false;
        toast.add({ severity: 'success', summary: 'Успішно', detail: 'Профіль оновлено', life: 3000 });
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Помилка', detail: 'Не вдалося оновити профіль', life: 3000 });
    } finally {
        isLoading.value = false; // Завершення завантаження
    }
};

const addPhoneField = () => {
    editForm.value.phones.push('');
};

const removePhoneField = (index: number) => {
    editForm.value.phones.splice(index, 1);
};

const onAvatarUpload = async (event: any) => {
    const file = event.files[0];
    if (file) {
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
};
</script>

<template>
    <div class="max-w-2xl mx-auto p-6">
        <Toast />
        <h1 class="text-2xl font-bold mb-6 text-center">Особистий кабінет</h1>

        <div v-if="userStore.profile" class="bg-white rounded-lg shadow-lg p-6">
            <div v-if="!isEditing">
                <div class="mb-6">
                    <h2 class="text-lg font-semibold mb-4">Профіль</h2>
                    <div class="flex items-center space-x-6 mb-6">
                        <div class="relative">
                            <img
                                v-if="userStore.profile.avatar"
                                :src="userStore.profile.avatar"
                                alt="Аватар"
                                class="w-24 h-24 rounded-full object-cover border-4 border-blue-100"
                            />
                            <div v-else class="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-4 border-blue-100">
                                <span class="text-gray-500 text-xl">👤</span>
                            </div>
                        </div>
                        <div>
                            <p class="text-lg font-semibold">{{ userStore.profile.name }}</p>
                            <p class="text-gray-600">{{ userStore.profile.email }}</p>
                        </div>
                    </div>
                    <div class="space-y-2">
                        <div v-for="(phone, index) in userStore.profile?.phones" :key="index" class="flex items-center space-x-2">
                            <span class="text-gray-600">Телефон {{ index + 1 }}:</span>
                            <span class="font-medium">{{ phone }}</span>
                        </div>
                    </div>
                    <div v-if="userStore.profile?.agency" class="mt-2">
                        <p class="text-gray-600">Агенція: {{ userStore.profile?.agency }}</p>
                    </div>
                </div>
                <Button
                    label="Редагувати"
                    @click="startEditing"
                    class="p-button-primary w-full"
                />
            </div>

            <form v-else @submit.prevent="saveProfile" class="space-y-6">
                <div>
                    <label class="block mb-2 font-medium">Ім'я</label>
                    <InputText
                        v-model="editForm.name"
                        type="text"
                        class="w-full"
                        placeholder="Введіть ваше ім'я"
                    />
                </div>
                <div>
                    <label class="block mb-2 font-medium">Агенція нерухомості</label>
                    <InputText
                        v-model="editForm.agency"
                        type="text"
                        class="w-full"
                        placeholder="Введіть назву агенції в якій працюєте"
                    />
                </div>
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
                        label="Додати телефон"
                        @click="addPhoneField"
                        class="p-button-secondary w-full"
                    />
                </div>
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
                        <img v-if="src" :src="src" alt="Image" class="shadow-md rounded-xl w-full sm:w-64" style="filter: grayscale(100%)" />
                    </div>
                </div>
                <div class="flex space-x-4">
                    <Button
                        type="submit"
                        label="Зберегти"
                        class="p-button-success w-full"
                        :loading="isLoading"
                    />
                    <Button
                        type="button"
                        label="Скасувати"
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
