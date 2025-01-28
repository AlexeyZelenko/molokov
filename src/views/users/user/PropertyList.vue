<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useUserStore } from '@/store/userStore';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const loading = ref(false);
const userStore = useUserStore();
const displayModal = ref(false);
const newList = ref({
    name: '',
    client: '',
});
const clients = ref([]);
const selectedClient = ref(null);

// Table columns configuration
const columns = [
    {
        field: 'name',
        header: 'Назва списку',
        body: (data) => data.client.name
    },
    { field: 'client', header: 'Клієнт' },
    {
        field: 'properties',
        header: 'Кількість об\'єктів',
        body: (data) => data.properties.length
    }
];

// Watch for client selection
watch(
    () => newList.value.client,
    (newClient) => {
        if (!newClient) {
            selectedClient.value = null;
            return;
        }
        selectedClient.value = newClient || null;
    },
    { immediate: true }
);

// Load data on mount
onMounted(async () => {
    loading.value = true;
    try {
        await userStore.fetchUserAndClients();
        await userStore.fetchPropertyLists();
        clients.value = userStore.clients;
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Помилка',
            detail: 'Не вдалося завантажити дані',
            life: 3000
        });
    } finally {
        loading.value = false;
    }
});

// Create new list
const createNewList = async () => {
    if (!newList.value.name || !newList.value.client) return;

    try {
        await userStore.createPropertyList({
            name: newList.value.name,
            client: newList.value.client,
            properties: []
        });

        displayModal.value = false;
        newList.value = { name: '', client: '' };

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

const deleteDialogVisible = ref(false);
const listToDelete = ref(null);

const confirmDelete = (list) => {
    listToDelete.value = list;
    deleteDialogVisible.value = true;
};

const deleteList = async () => {
    try {
        if (listToDelete.value) {
            await userStore.deletePropertyList(listToDelete.value.id);
            toast.add({
                severity: 'success',
                summary: 'Успішно',
                detail: 'Список видалено',
                life: 3000
            });
        }
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Помилка',
            detail: 'Не вдалося видалити список',
            life: 3000
        });
    } finally {
        deleteDialogVisible.value = false;
        listToDelete.value = null;
    }
};

const openModal = () => {
    displayModal.value = true;
    newList.value = { name: '', client: '' };
    selectedClient.value = null;
};

const closeModal = () => {
    displayModal.value = false;
    newList.value = { name: '', client: '' };
    selectedClient.value = null;
};

// Function to format property type
const formatPropertyInfo = (property) => {
    if (typeof property === 'string') {
        return property; // Handle legacy format
    }

    const category = property.category?.name || '';
    const subcategory = property.subcategory?.name || '';
    return `${category} (${subcategory})`;
};

// Function to get table data
const getTableData = (list) => {
    return list.properties.map(prop => {
        if (typeof prop === 'object' && prop.category) {
            return formatPropertyInfo(prop);
        }
        return 'Формат не визначено';
    }).join(', ');
};

const viewList = (listId) => {
    router.push(`/users/property-list/${listId}`);
};
</script>

<template>
    <div class="max-w-7xl mx-auto p-6">
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold">Списки нерухомості</h2>
            <Button
                label="Створити список"
                icon="pi pi-plus"
                @click="openModal"
                severity="success"
            />
        </div>

        <!-- Table -->
        <DataTable
            :value="userStore.propertyLists"
            :loading="loading"
            stripedRows
            showGridlines
            :paginator="true"
            :rows="10"
        >
            <Column field="client.name" header="Клієнт" sortable />
            <Column field="name" header="Назва списку" sortable />
            <Column header="Об'єкти">
                <template #body="slotProps">
                    <div v-if="slotProps.data.properties?.length > 0">
                        {{ slotProps.data.properties.length }} об'єктів:
                        <div class="text-sm text-gray-600 mt-1">
                            {{ getTableData(slotProps.data) }}
                        </div>
                    </div>
                    <div v-else>
                        Немає об'єктів
                    </div>
                </template>
            </Column>
            <Column header="Дії">
                <template #body="slotProps">
                    <Button
                        icon="pi pi-eye"
                        class="p-button-rounded p-button-info mr-2"
                        @click="$router.push(`/users/property-list/${slotProps.data.id}`)"
                        tooltip="Переглянути список"
                    />
                    <Button
                        icon="pi pi-trash"
                        class="p-button-rounded p-button-danger"
                        @click="confirmDelete(slotProps.data)"
                        tooltip="Видалити список"
                    />
                </template>
            </Column>
        </DataTable>

        <!-- Modal -->
        <Dialog
            v-model:visible="displayModal"
            modal
            header="Створення нового списку"
            :style="{width: '50vw'}"
            :breakpoints="{'960px': '75vw', '641px': '90vw'}"
        >
            <form @submit.prevent="createNewList" class="space-y-4">
                <div class="field">
                    <label for="name" class="block mb-1">Назва списка</label>
                    <InputText
                        id="name"
                        v-model="newList.name"
                        type="text"
                        class="w-full"
                        required
                    />
                </div>

                <div class="field">
                    <label for="client" class="block mb-1">Клієнт</label>
                    <Select
                        id="client"
                        v-model="newList.client"
                        :options="clients"
                        optionLabel="name"
                        placeholder="Вибрати клієнта"
                        class="w-full"
                        required
                    />
                </div>

                <!-- Client details accordion -->
                <div v-if="selectedClient" class="mt-4">
                    <Accordion>
                        <AccordionTab header="Додаткова інформація про клієнта">
                            <div class="p-3">
                                <p class="mb-2"><strong>Ім'я:</strong> {{ selectedClient.name }}</p>
                                <p class="mb-2"><strong>Телефон:</strong> {{ selectedClient.contacts?.phones[0] || 'Немає даних' }}</p>
                                <p class="mb-2"><strong>Тип нерухомості:</strong> {{ selectedClient.wishes?.propertyType || 'Немає даних' }}</p>
                                <p class="mb-2"><strong>Бажання:</strong> {{ selectedClient.wishes?.text || 'Немає даних' }}</p>
                                <p class="mb-2"><strong>Ціна:</strong> {{ selectedClient.wishes?.priceRange?.from }} - {{selectedClient.wishes?.priceRange?.to}}</p>
                                <p class="mb-2"><strong>Id клієнта:</strong> {{ selectedClient.id }}</p>
                            </div>
                        </AccordionTab>
                    </Accordion>
                </div>
            </form>

            <template #footer>
                <Button
                    label="Скасувати"
                    icon="pi pi-times"
                    @click="closeModal"
                    class="p-button-text"
                />
                <Button
                    label="Зберегти"
                    icon="pi pi-check"
                    @click="createNewList"
                    autofocus
                />
            </template>
        </Dialog>

        <!-- Delete Confirmation Dialog -->
        <Dialog
            v-model:visible="deleteDialogVisible"
            modal
            header="Підтвердження видалення"
            :style="{width: '450px'}"
        >
            <div class="flex align-items-center justify-content-center">
                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                <span>
            Ви впевнені, що хочете видалити список
            <strong>{{ listToDelete?.name }}</strong>?
        </span>
            </div>
            <template #footer>
                <Button
                    label="Ні"
                    icon="pi pi-times"
                    @click="deleteDialogVisible = false"
                    class="p-button-text mr-4"
                />
                <Button
                    label="Так"
                    icon="pi pi-check"
                    @click="deleteList"
                    class="p-button-danger"
                    autofocus
                />
            </template>
        </Dialog>
    </div>
</template>
