<template>
    <div class="p-4">
        <Toast />

        <div>
            <div class="flex justify-between items-center mb-6">
                <h1 class="text-2xl font-bold">Клієнти</h1>
                <Button label="Додати клієнта" icon="pi pi-plus" @click="openAddDialog" />
            </div>
        </div>

        <!-- Desktop версія -->
        <DataTable
            :value="clients"
            :loading="loading"
            stripedRows
            paginator
            :rows="10"
            :rowsPerPageOptions="[5, 10, 20]"
            tableStyle="min-width: 60rem"
            class="hidden md:block"
            dataKey="id"
            :expandedRows="expandedRows"
            @rowToggle="onRowToggle"
            v-model:filters="filters"
            filterDisplay="row"
        >
            <template #empty> Нічого не знайдено. </template>
            <template #loading> Завантаження даних. Будь ласка, зачекайте.  </template>
            <Column :expander="true" headerStyle="width: 3rem" />
            <Column field="name" header="Name" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.name }}
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search by name" />
                </template>
            </Column>
            <Column field="wishes.propertyType" header="Тип нерухомості" sortable></Column>
            <Column field="wishes.rooms" header="Кількість кімнат" sortable></Column>
            <Column field="wishes.priceRange.from" header="Min" sortable></Column>
            <Column field="wishes.priceRange.to" header="Max" sortable></Column>
            <Column header="Дії" :exportable="false" style="min-width:8rem">
                <template #body="{ data }">
                    <Button icon="pi pi-pencil" class="p-button-text" @click="openEditDialog(data)" />
                    <Button icon="pi pi-trash" class="p-button-text p-button-danger" @click="deleteClient(data.id)" />
                </template>
            </Column>
            <template #expansion="slotProps">
                <div class="p-3">
                    <div class="mb-3">
                        <strong>Телефони:</strong>
                        <div v-for="(phone, index) in slotProps.data.contacts.phones" :key="index">
                            {{ phone }}
                        </div>
                    </div>
                    <div class="mb-3">
                        <strong>Telegram:</strong> {{ slotProps.data.contacts.telegram }}
                    </div>
                    <div class="mb-3">
                        <strong>Побажання:</strong> {{ slotProps.data.wishes.text }}
                    </div>
                    <div class="mb-3">
                        <strong>Тип нерухомості:</strong> {{ slotProps.data.wishes.propertyType }}
                    </div>
                    <div class="mb-3">
                        <strong>Ціна:</strong> {{ slotProps.data.wishes.priceRange.from }} - {{ slotProps.data.wishes.priceRange.to }}
                    </div>
                    <div v-if="slotProps.data.wishes.propertyType === 'квартира'">
                        <strong>Кімнати:</strong> {{ slotProps.data.wishes.rooms }}
                    </div>
                </div>
            </template>
        </DataTable>

        <!-- Mobile версія -->
        <div class="md:hidden">
            <div v-for="client in clients" :key="client.id" class="card mb-3 p-3 border rounded-lg">
                <div class="flex justify-between items-center">
                    <h3 class="text-lg font-bold">{{ client.name }}</h3>
                    <div>
                        <Button icon="pi pi-pencil" class="p-button-text" @click="openEditDialog(client)" />
                        <Button icon="pi pi-trash" class="p-button-text p-button-danger" @click="deleteClient(client.id)" />
                    </div>
                </div>
                <div class="mt-3">
                    <Panel :toggleable="true" :collapsed="true" class="mb-2">
                        <template #header>
                            <span class="font-bold">Деталі</span>
                        </template>
                        <div class="mb-2">
                            <strong>Телефони:</strong>
                            <div v-for="(phone, index) in client.contacts.phones" :key="index">
                                {{ phone }}
                            </div>
                        </div>
                        <div class="mb-2">
                            <strong>Telegram:</strong> {{ client.contacts.telegram }}
                        </div>
                        <div class="mb-2">
                            <strong>Побажання:</strong> {{ client.wishes.text }}
                        </div>
                        <div class="mb-2">
                            <strong>Тип нерухомості:</strong> {{ client.wishes.propertyType }}
                        </div>
                        <div class="mb-2">
                            <strong>Ціна:</strong> {{ client.wishes.priceRange.from }} - {{ client.wishes.priceRange.to }}
                        </div>
                        <div v-if="client.wishes.propertyType === 'квартира'">
                            <strong>Кімнати:</strong> {{ client.wishes.rooms }}
                        </div>
                    </Panel>
                </div>
            </div>
        </div>

        <!-- Діалог для додавання клієнта -->
        <Dialog
            v-model:visible="displayAddDialog"
            :style="{ width: '90vw', maxWidth: '500px' }"
            header="Новий клієнт"
            :modal="true"
            class="p-dialog-lg"
        >
            <div class="p-fluid flex flex-col gap-4">
                <div class="flex flex-col gap-2">
                    <label for="name">Ім'я *</label>
                    <InputText id="name" v-model="newClient.name" class="p-inputtext-sm" />
                </div>
                <Panel header="Контакти" :toggleable="true">
                    <div class="field flex flex-col gap-2">
                        <label for="phones">Телефони</label>
                        <InputText id="phones" v-model="newClient.contacts.phones[0]" class="p-inputtext-sm" />
                    </div>
                    <div class="field flex flex-col">
                        <label for="telegram">Telegram</label>
                        <InputText id="telegram" v-model="newClient.contacts.telegram" class="p-inputtext-sm" />
                    </div>
                </Panel>
                <Panel header="Побажання" :toggleable="true">
                    <div class="field flex flex-col">
                        <label for="wishes">Текст побажань</label>
                        <Textarea id="wishes" v-model="newClient.wishes.text" rows="5" class="p-inputtext-sm" />
                    </div>
                    <div class="field flex flex-col">
                        <label for="propertyType">Тип нерухомості</label>
                        <Dropdown
                            id="propertyType"
                            v-model="newClient.wishes.propertyType"
                            :options="propertyTypes"
                            optionLabel="label"
                            optionValue="value"
                            class="p-dropdown-sm"
                        />
                    </div>
                    <div class="field flex flex-col">
                        <label for="priceFrom">Ціна від</label>
                        <InputNumber id="priceFrom" v-model="newClient.wishes.priceRange.from" class="p-inputnumber-sm" />
                    </div>
                    <div class="field flex flex-col">
                        <label for="priceTo">Ціна до</label>
                        <InputNumber id="priceTo" v-model="newClient.wishes.priceRange.to" class="p-inputnumber-sm" />
                    </div>
                    <div class="field flex flex-col" v-if="newClient.wishes.propertyType === 'квартира'">
                        <label for="rooms">Кількість кімнат</label>
                        <InputNumber id="rooms" v-model="newClient.wishes.rooms" class="p-inputnumber-sm" />
                    </div>
                </Panel>
            </div>
            <template #footer>
                <Button label="Скасувати" icon="pi pi-times" @click="closeAddDialog" class="p-button-text p-button-danger" />
                <Button label="Додати" icon="pi pi-check" @click="addClient" class="p-button-success" />
            </template>
        </Dialog>

        <!-- Діалог для редагування клієнта -->
        <Dialog
            v-model:visible="displayEditDialog"
            :style="{ width: '90vw', maxWidth: '500px' }"
            header="Редагування клієнта"
            :modal="true"
            class="p-dialog-lg"
        >
            <div class="p-fluid flex flex-col gap-4">
                <div class="flex flex-col gap-2">
                    <label for="name">Ім'я *</label>
                    <InputText id="name" v-model="selectedClient.name" class="p-inputtext-sm" />
                </div>
                <Panel header="Контакти" :toggleable="true">
                    <div class="field flex flex-col gap-2">
                        <label for="phones">Телефони</label>
                        <InputText id="phones" v-model="selectedClient.contacts.phones[0]" class="p-inputtext-sm" />
                    </div>
                    <div class="field flex flex-col">
                        <label for="telegram">Telegram</label>
                        <InputText id="telegram" v-model="selectedClient.contacts.telegram" class="p-inputtext-sm" />
                    </div>
                </Panel>
                <Panel header="Побажання" :toggleable="true">
                    <div class="field flex flex-col">
                        <label for="wishes">Текст побажань</label>
                        <Textarea id="wishes" v-model="selectedClient.wishes.text" rows="5" class="p-inputtext-sm" />
                    </div>
                    <div class="field flex flex-col">
                        <label for="propertyType">Тип нерухомості</label>
                        <Dropdown
                            id="propertyType"
                            v-model="selectedClient.wishes.propertyType"
                            :options="propertyTypes"
                            optionLabel="label"
                            optionValue="value"
                            class="p-dropdown-sm"
                        />
                    </div>
                    <div class="field flex flex-col">
                        <label for="priceFrom">Ціна від</label>
                        <InputNumber id="priceFrom" v-model="selectedClient.wishes.priceRange.from" class="p-inputnumber-sm" />
                    </div>
                    <div class="field flex flex-col">
                        <label for="priceTo">Ціна до</label>
                        <InputNumber id="priceTo" v-model="selectedClient.wishes.priceRange.to" class="p-inputnumber-sm" />
                    </div>
                    <div class="field flex flex-col" v-if="selectedClient.wishes.propertyType === 'квартира'">
                        <label for="rooms">Кількість кімнат</label>
                        <InputNumber id="rooms" v-model="selectedClient.wishes.rooms" class="p-inputnumber-sm" />
                    </div>
                </Panel>
            </div>
            <template #footer>
                <Button label="Скасувати" icon="pi pi-times" @click="closeEditDialog" class="p-button-text p-button-danger" />
                <Button label="Зберегти" icon="pi pi-check" @click="saveClient" class="p-button-success" />
            </template>
        </Dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/store/userStore';
import { useToast } from 'primevue/usetoast';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Dropdown from 'primevue/dropdown';
import InputNumber from 'primevue/inputnumber';
import Toast from 'primevue/toast';
import Panel from 'primevue/panel';
import { FilterMatchMode } from '@primevue/core/api';

const userStore = useUserStore();
const toast = useToast();
const clients = ref([]);
const loading = ref(false);
const displayAddDialog = ref(false);
const displayEditDialog = ref(false);
const expandedRows = ref({});

const filters = ref({
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
});

const emptyClient = {
    name: '',
    contacts: { phones: [''], telegram: '' },
    wishes: { text: '', propertyType: '', priceRange: { from: 0, to: 0 }, rooms: 0 }
};

const newClient = ref({ ...emptyClient });
const selectedClient = ref({ ...emptyClient });

const propertyTypes = [
    { label: 'Квартира', value: 'квартира' },
    { label: 'Будинок', value: 'дім' },
    { label: 'Комерція', value: 'комерція' },
    { label: 'Земля', value: 'земля' },
];

onMounted(async () => {
    loading.value = true;
    try {
        await userStore.fetchUserAndClients();
        clients.value = userStore.clients;
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Помилка', detail: 'Не вдалося завантажити дані', life: 3000 });
    } finally {
        loading.value = false;
    }
});

const onRowToggle = (event: any) => {
    expandedRows.value = event.data;
};

const openAddDialog = () => {
    newClient.value = JSON.parse(JSON.stringify(emptyClient));
    displayAddDialog.value = true;
};

const openEditDialog = (client: any) => {
    selectedClient.value = JSON.parse(JSON.stringify(client)); // Deep copy
    displayEditDialog.value = true;
};

const addClient = async () => {
    try {
        if (!newClient.value.name.trim()) {
            toast.add({ severity: 'error', summary: 'Помилка', detail: "Ім'я обов'язкове", life: 3000 });
            return;
        }

        loading.value = true;
        await userStore.addClient(newClient.value);
        toast.add({ severity: 'success', summary: 'Успішно', detail: 'Клієнта додано', life: 3000 });

        displayAddDialog.value = false;
        await userStore.fetchUser();
        clients.value = userStore.clients;
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Помилка', detail: 'Не вдалося додати клієнта', life: 3000 });
    } finally {
        loading.value = false;
    }
};

const saveClient = async () => {
    try {
        if (!selectedClient.value.name.trim()) {
            toast.add({ severity: 'error', summary: 'Помилка', detail: "Ім'я обов'язкове", life: 3000 });
            return;
        }

        loading.value = true;
        await userStore.updateClient(selectedClient.value.id, selectedClient.value);
        toast.add({ severity: 'success', summary: 'Успішно', detail: 'Дані оновлено', life: 3000 });

        displayEditDialog.value = false;
        await userStore.fetchUser();
        clients.value = userStore.clients;
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Помилка', detail: 'Не вдалося зберегти дані', life: 3000 });
    } finally {
        loading.value = false;
    }
};

const closeAddDialog = () => {
    displayAddDialog.value = false;
    newClient.value = JSON.parse(JSON.stringify(emptyClient));
};

const closeEditDialog = () => {
    displayEditDialog.value = false;
    selectedClient.value = JSON.parse(JSON.stringify(emptyClient));
};

const deleteClient = async (id: string) => {
    try {
        loading.value = true;
        await userStore.deleteClient(id);
        toast.add({ severity: 'success', summary: 'Успішно', detail: 'Клієнта видалено', life: 3000 });
        await userStore.fetchUser();
        clients.value = userStore.clients;
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Помилка', detail: 'Не вдалося видалити клієнта', life: 3000 });
    } finally {
        loading.value = false;
    }
};
</script>
