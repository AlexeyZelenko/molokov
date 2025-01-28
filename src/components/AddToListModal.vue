<template>
    <Button label="Додати до списку" @click="openModal" />

    <Dialog
        v-model:visible="isModalVisible"
        header="Додати до списку"
        :modal="true"
        :style="{ width: '90vw', maxWidth: '500px' }"
        class="p-dialog-lg"
    >
        <div class="p-fluid">
            <!-- Вибір клієнта -->
            <div class="mb-4">
                <label class="block mb-2">Оберіть клієнта:</label>
                <Dropdown
                    v-model="selectedClient"
                    :options="userStore.clients"
                    optionLabel="name"
                    placeholder="Оберіть клієнта"
                    class="w-full"
                />
            </div>

            <div v-if="selectedClient">
                <!-- Перемикач між додаванням до існуючого списку та створенням нового -->
                <div class="mb-4">
                    <div class="flex gap-4">
                        <div class="flex align-items-center">
                            <RadioButton
                                v-model="listOption"
                                inputId="existingList"
                                name="listOption"
                                value="existing"
                            />
                            <label for="existingList" class="ml-2">Додати до існуючого списку</label>
                        </div>
                        <div class="flex align-items-center">
                            <RadioButton
                                v-model="listOption"
                                inputId="newList"
                                name="listOption"
                                value="new"
                            />
                            <label for="newList" class="ml-2">Створити новий список</label>
                        </div>
                    </div>
                </div>

                <!-- Вибір існуючого списку -->
                <div v-if="listOption === 'existing' && userStore.propertyLists?.length > 0" class="mb-4">
                    <label class="block mb-2">Оберіть список:</label>
                    <Dropdown
                        v-model="selectedList"
                        :options="filteredLists"
                        optionLabel="name"
                        placeholder="Оберіть список"
                        class="w-full"
                    />
                </div>

                <!-- Створення нового списку -->
                <div v-if="listOption === 'new'" class="mb-4">
                    <Panel header="Створити новий список" :toggleable="true">
                        <div class="field">
                            <label class="block mb-2">Назва списку:</label>
                            <InputText
                                v-model="newListName"
                                placeholder="Введіть назву списку"
                                class="w-full mb-2"
                            />
                            <Button
                                label="Створити список"
                                @click="createNewList"
                                :disabled="!newListName.trim()"
                                class="w-full"
                            />
                        </div>
                    </Panel>
                </div>
            </div>

            <div v-else class="mb-4">
                <Message severity="info" :closable="false">
                    Спочатку оберіть клієнта
                </Message>
            </div>
        </div>

        <!-- Footer -->
        <template #footer>
            <Button
                label="Скасувати"
                icon="pi pi-times"
                @click="closeModal"
                class="p-button-text"
            />
            <Button
                label="Додати до списку"
                icon="pi pi-check"
                @click="addToSelectedList"
                :disabled="!canAdd"
                class="p-button-success"
            />
        </template>
    </Dialog>
</template>

<script setup lang="ts">
import {ref, computed, onMounted} from 'vue';
import { useUserStore } from '@/store/userStore';
import { useToast } from 'primevue/usetoast';

const userStore = useUserStore();
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

const isModalVisible = ref(false);
const selectedList = ref(null);
const selectedClient = ref(null);
const newListName = ref('');
const loading = ref(false);
const listOption = ref('existing'); // 'existing' або 'new'

// Computed properties
const filteredLists = computed(() => {
    if (!selectedClient.value) return [];
    return userStore.propertyLists.filter(list => list.clientId === selectedClient.value.id);
});

const canAdd = computed(() => {
    return selectedClient.value && (listOption.value === 'existing' ? selectedList.value : newListName.value.trim());
});

// Methods
const openModal = () => {
    isModalVisible.value = true;
};

const closeModal = () => {
    isModalVisible.value = false;
    selectedList.value = null;
    selectedClient.value = null;
    newListName.value = '';
    listOption.value = 'existing';
};

const createNewList = async () => {
    if (!newListName.value.trim() || !selectedClient.value) return;

    try {
        const list = await userStore.createPropertyList({
            name: newListName.value.trim(),
            clientId: selectedClient.value.id,
            clientName: selectedClient.value.name,
            properties: []
        });

        selectedList.value = list;
        newListName.value = '';
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
    }
};

const addToSelectedList = async () => {
    try {
        if (listOption.value === 'existing' && selectedList.value) {
            console.log('Adding to existing list:', selectedList.value.id, props.ad);
            await userStore.addAdToPropertyList(selectedList.value.id, props.propertyId, props.ad);
        } else if (listOption.value === 'new' && newListName.value.trim()) {
            const list = await userStore.createPropertyList({
                name: newListName.value.trim(),
                clientId: selectedClient.value.id,
                clientName: selectedClient.value.name,
                properties: [props.ad]
            });
            selectedList.value = list;
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
    }
};

onMounted(async () => {
    loading.value = true;
    console.log('Загрузка даних...', props.propertyId);
    try {
        await userStore.fetchUserAndClients();
        await userStore.fetchPropertyLists();
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Помилка', detail: 'Не вдалося завантажити дані', life: 3000 });
    } finally {
        loading.value = false;
    }
});
</script>
