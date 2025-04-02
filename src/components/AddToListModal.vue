<script setup>
import { ref, computed, onMounted, reactive } from 'vue';
import { useUserStore } from '@/store/userStore';
import { useApartmentsStore } from '@/store/apartments';
import { useToast } from 'primevue/usetoast';
import Select from 'primevue/select';

const userStore = useUserStore();
const apartmentsStore = useApartmentsStore();
const toast = useToast();

const props = defineProps({
    ad: {
        type: Object,
        required: true
    },
    propertyId: {
        type: String,
        required: true
    }
});

let dropdowns = reactive([]);

const isModalVisible = ref(false);
const selectedList = ref(null);
const selectedClient = ref(null);
const newListName = ref('');
const newListCategory = ref('');
const newListSubcategory = ref('');
const loading = ref(false);
const listOption = ref('existing'); // 'existing' або 'new'
const isSubmitting = ref(false);

// Computed properties
const filteredLists = computed(() => {
    if (!selectedClient.value) return [];
    return userStore.propertyLists.filter((list) => list.client.id === selectedClient.value.id);
});

const canAdd = computed(() => {
    return selectedClient.value && (listOption.value === 'existing' ? selectedList.value : newListName.value.trim());
});

// Methods
const resetForm = () => {
    selectedList.value = null;
    selectedClient.value = null;
    newListName.value = '';
    newListCategory.value = '';
    newListSubcategory.value = '';
    listOption.value = 'existing';
    isSubmitting.value = false;
};

const openModal = () => {
    isModalVisible.value = true;
};

const closeModal = () => {
    isModalVisible.value = false;
    selectedList.value = null;
    selectedClient.value = null;
    newListName.value = '';
    newListCategory.value = '';
    newListSubcategory.value = '';
    listOption.value = 'existing';
};

const createNewList = async () => {
    if (!newListName.value.trim() || !selectedClient.value) return;

    isSubmitting.value = true;

    try {
        await userStore.createPropertyList({
            name: newListName.value.trim(),
            client: selectedClient.value,
            properties: [],
            category: newListCategory.value,
            subcategory: newListSubcategory.value
        });
        await userStore.fetchPropertyLists();

        listOption.value = 'existing';
        newListName.value = '';
        newListCategory.value = '';
        newListSubcategory.value = '';

        toast.add({
            severity: 'success',
            summary: 'Успішно',
            detail: 'Список створено',
            life: 3000
        });
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Помилка',
            detail: 'Не вдалося створити список',
            life: 3000
        });
    } finally {
        isSubmitting.value = false;
    }
};

const addToSelectedList = async () => {
    if (!canAdd.value || isSubmitting.value) return;

    isSubmitting.value = true;
    try {
        if (listOption.value === 'existing' && selectedList.value) {
            await userStore.addAdToPropertyList(selectedList.value.id, props.propertyId, props.ad);
        } else if (listOption.value === 'new' && newListName.value.trim()) {
            await userStore.createPropertyList({
                name: newListName.value.trim(),
                clientId: selectedClient.value.id,
                client: selectedClient.value,
                properties: [props.ad],
                category: newListCategory.value,
                subcategory: newListSubcategory.value
            });
            await userStore.fetchPropertyLists();
        }

        toast.add({
            severity: 'success',
            summary: 'Успішно',
            detail: 'Оголошення додано до списку',
            life: 3000
        });
        closeModal();
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Помилка',
            detail: 'Не вдалося додати оголошення до списку',
            life: 3000
        });
    } finally {
        isSubmitting.value = false;
    }
};

onMounted(async () => {
    loading.value = true;
    try {
        await userStore.fetchUser();
        console.log('c% userStore.user', userStore.user);
        await userStore.fetchUserAndClients();
        await userStore.fetchPropertyLists();
        dropdowns = apartmentsStore.dropdowns;
    } catch (error) {
        console.log(error);
    } finally {
        loading.value = false;
    }
});
</script>

<template>
    <Button v-if="userStore.user.role !== 'guest'" label="Додати до списку" @click.stop="openModal" :loading="loading" />

    <Dialog v-model:visible="isModalVisible" header="Додати до списку" :modal="true" :style="{ width: '90vw', maxWidth: '500px' }" :closable="!isSubmitting" :closeOnEscape="!isSubmitting" class="p-dialog-lg">
        <div class="p-fluid">
            <!-- Вибір клієнта -->
            <div class="mb-4">
                <label class="block mb-2">Оберіть клієнта:</label>
                <Dropdown v-model="selectedClient" :options="userStore.clients" optionLabel="name" placeholder="Оберіть клієнта" :disabled="isSubmitting" class="w-full" />
            </div>

            <div v-if="selectedClient">
                <!-- Перемикач між додаванням до існуючого списку та створенням нового -->
                <div class="mb-4">
                    <div class="flex gap-4">
                        <div class="flex align-items-center">
                            <RadioButton v-model="listOption" inputId="existingList" name="listOption" value="existing" :disabled="isSubmitting" />
                            <label for="existingList" class="ml-2">Додати до існуючого списку</label>
                        </div>
                        <div class="flex align-items-center">
                            <RadioButton v-model="listOption" inputId="newList" name="listOption" value="new" :disabled="isSubmitting" />
                            <label for="newList" class="ml-2">Створити новий список</label>
                        </div>
                    </div>
                </div>

                <!-- Вибір існуючого списку -->
                <div v-if="listOption === 'existing' && userStore.propertyLists?.length > 0" class="mb-4">
                    <label class="block mb-2">Оберіть список:</label>
                    <Dropdown v-model="selectedList" :options="filteredLists" optionLabel="name" placeholder="Оберіть список" class="w-full" :disabled="isSubmitting" />
                </div>

                <!-- Створення нового списку -->
                <div v-if="listOption === 'new'" class="mb-4">
                    <Panel header="Створити новий список" :toggleable="true">
                        <div class="field">
                            <label class="block mb-2">Назва списку:</label>
                            <InputText v-model="newListName" placeholder="Введіть назву списку" class="w-full mb-2" :disabled="isSubmitting" />

                            <label class="block mb-2">Тип нерухомості:</label>
                            <Select id="categoryProperty" name="categoryProperty" v-model="newListCategory" :options="dropdowns.category" optionLabel="name" placeholder="Вибрати" required class="w-full mb-2" />

                            <label class="block mb-2">Мета використання:</label>
                            <Select name="subcategoryProperty" v-model="newListSubcategory" :options="dropdowns.subcategory" optionLabel="name" placeholder="Вибрати" required class="w-full mb-2" />

                            <Button label="Створити список" @click="createNewList" :disabled="!newListName.trim() || isSubmitting" :loading="isSubmitting" class="w-full mt-2" />
                        </div>
                    </Panel>
                </div>
            </div>

            <div v-else class="mb-4">
                <Message severity="info" :closable="false"> Спочатку оберіть клієнта </Message>
            </div>
        </div>

        <!-- Footer -->
        <template #footer>
            <Button label="Скасувати" icon="pi pi-times" @click="closeModal" class="p-button-text" :disabled="isSubmitting" />
            <Button label="Додати до списку" icon="pi pi-check" @click="addToSelectedList" :disabled="!canAdd || isSubmitting" :loading="isSubmitting" class="p-button-success" />
        </template>
    </Dialog>
</template>
