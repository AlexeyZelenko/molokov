<template>
    <div class="p-4">
        <Toast />

        <div>
            <div class="flex justify-between items-center mb-6">
                <h1 class="text-2xl font-bold text-gray-800">Клієнти</h1>
                <Button
                    label="Додати клієнта"
                    icon="pi pi-plus"
                    @click="openAddDialog"
                    class="p-button-raised p-button-primary shadow-md hover:shadow-lg transition-shadow duration-200"
                    iconClass="mr-2"
                />
            </div>
        </div>

        <!-- Desktop версія -->
        <DataTable
            :value="clients"
            stripedRows
            paginator
            :rows="10"
            :rowsPerPageOptions="[5, 10, 20]"
            tableStyle="min-width: 60rem"
            class="hidden md:block p-datatable-hoverable-rows shadow-sm rounded-lg"
            dataKey="id"
            :expandedRows="expandedRows"
            @rowToggle="onRowToggle"
            v-model:filters="filters"
            filterDisplay="row"
        >
            <template #empty>
                <div class="text-gray-500 p-4">Нічого не знайдено.</div>
            </template>
            <Column :expander="true" headerStyle="width: 3rem" />
            <Column field="name" header="Name" style="min-width: 12rem">
                <template #body="{ data }">
                    <span class="font-medium">{{ data.name }}</span>
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText
                        v-model="filterModel.value"
                        type="text"
                        @input="filterCallback()"
                        placeholder="Search by name"
                        class="p-inputtext-sm w-full"
                    />
                </template>
            </Column>
            <Column field="wishes.propertyType" header="Тип нерухомості" sortable>
                <template #body="{ data }">
                    <Tag :value="data.wishes.propertyType" :severity="getPropertyTypeSeverity(data.wishes.propertyType)" />
                </template>
            </Column>
            <Column field="wishes.rooms" header="Кімнати" sortable>
                <template #body="{ data }">
                    <Badge
                        :value="data.wishes.rooms"
                        size="xlarge"
                        :severity="getSeverity(data.wishes.rooms)"
                    />
                </template>
            </Column>
            <Column field="wishes.priceRange.from" header="Min" sortable>
                <template #body="{ data }">
                    {{ formatPrice(data.wishes.priceRange.from) }}
                </template>
            </Column>
            <Column field="wishes.priceRange.to" header="Max" sortable>
                <template #body="{ data }">
                    {{ formatPrice(data.wishes.priceRange.to) }}
                </template>
            </Column>
            <Column header="Дії" :exportable="false" style="min-width:8rem">
                <template #body="{ data }">
                    <div class="flex gap-2">
                        <Button
                            icon="pi pi-pencil"
                            class="p-button-rounded p-button-text p-button-info hover:bg-blue-50"
                            @click="openEditDialog(data)"
                            v-tooltip.top="'Редагувати'"
                        />
                        <Button
                            icon="pi pi-trash"
                            class="p-button-rounded p-button-text p-button-danger hover:bg-red-50"
                            @click="confirmDelete(data)"
                            v-tooltip.top="'Видалити'"
                        />
                    </div>
                </template>
            </Column>
            <template #expansion="slotProps">
                <div class="p-4 bg-gray-50 rounded-lg shadow-inner">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="space-y-3">
                            <div>
                                <div class="font-semibold text-gray-700 mb-1">Телефони:</div>
                                <div v-for="(phone, index) in slotProps.data.contacts.phones" :key="index"
                                     class="flex items-center gap-2">
                                    <i class="pi pi-phone text-gray-500"></i>
                                    <a :href="'tel:' + phone" class="text-blue-600 hover:text-blue-800">{{ phone }}</a>
                                </div>
                            </div>
                            <div>
                                <div class="font-semibold text-gray-700 mb-1">Telegram:</div>
                                <div class="flex items-center gap-2">
                                    <i class="pi pi-telegram text-blue-500"></i>
                                    <a :href="'https://t.me/' + slotProps.data.contacts.telegram"
                                       target="_blank"
                                       class="text-blue-600 hover:text-blue-800">
                                        {{ slotProps.data.contacts.telegram }}
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div class="space-y-3">
                            <div>
                                <div class="font-semibold text-gray-700 mb-1">Побажання:</div>
                                <p class="text-gray-600" style="word-wrap: break-word;">{{ slotProps.data.wishes.text }}</p>
                            </div>
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <div class="font-semibold text-gray-700">Тип нерухомості:</div>
                                    <Tag :value="slotProps.data.wishes.propertyType"
                                         :severity="getPropertyTypeSeverity(slotProps.data.wishes.propertyType)" />
                                </div>
                                <div>
                                    <div class="font-semibold text-gray-700">Ціна:</div>
                                    <span class="text-gray-600">
                                        {{ formatPrice(slotProps.data.wishes.priceRange.from) }} -
                                        {{ formatPrice(slotProps.data.wishes.priceRange.to) }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </DataTable>

        <!-- Mobile версія -->
        <div class="md:hidden space-y-4">
            <div v-for="client in clients" :key="client.id"
                 class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
                <div class="p-4">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-bold text-gray-800">{{ client.name }}</h3>
                        <div class="flex gap-2">
                            <Button
                                icon="pi pi-pencil"
                                class="p-button-rounded p-button-text p-button-info"
                                @click="openEditDialog(client)"
                            />
                            <Button
                                icon="pi pi-trash"
                                class="p-button-rounded p-button-text p-button-danger"
                                @click="confirmDelete(client)"
                            />
                        </div>
                    </div>
                    <Panel :toggleable="true" :collapsed="true" class="border-none">
                        <template #header>
                            <div class="flex items-center gap-2">
                                <i class="pi pi-info-circle text-blue-500"></i>
                                <span class="font-semibold text-gray-700">Деталі</span>
                            </div>
                        </template>
                        <div class="space-y-4 pt-3">
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
                                <strong>Побажання:</strong>
                                <p style="word-wrap: break-word;" v-text="client.wishes.text"></p>
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
                <Button label="Зберегти" icon="pi pi-check" @click="saveClient(selectedClient.id)" class="p-button-success" />
            </template>
        </Dialog>

        <ConfirmDialog />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/store/userStore';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
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
import Tag from 'primevue/tag';
import Badge from 'primevue/badge';
import ConfirmDialog from 'primevue/confirmdialog';
import { FilterMatchMode } from '@primevue/core/api';

const confirm = useConfirm();
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

const getPropertyTypeSeverity = (type: string) => {
    const map: { [key: string]: string } = {
        'квартира': 'info',
        'дім': 'success',
        'комерція': 'warning',
        'земля': 'help'
    };
    return map[type] || 'info';
};

const getSeverity = (rooms: number) => {
    if (rooms === 1) return 'success';
    if (rooms === 2) return 'info';
    if (rooms === 3) return 'warning';
    if (rooms >= 4) return 'danger';
    return 'info';
};

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('uk-UA', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
    }).format(price);
};

const confirmDelete = (client: any) => {
    confirm.require({
        message: `Ви впевнені, що хочете видалити клієнта "${client.name}"?`,
        header: 'Підтвердження видалення',
        icon: 'pi pi-exclamation-triangle',
        accept: () => deleteClient(client.id),
        reject: () => {
            toast.add({ severity: 'info', summary: 'Скасовано', detail: 'Видалення скасовано', life: 3000 });
        }
    });
};

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

const saveClient = async (id: string) => {
    try {
        if (!selectedClient.value.name.trim()) {
            toast.add({ severity: 'error', summary: 'Помилка', detail: "Ім'я обов'язкове", life: 3000 });
            return;
        }

        loading.value = true;
        await userStore.updateClient(id, selectedClient.value);
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


<style scoped>
.p-datatable .p-datatable-tbody > tr > td {
    padding: 1rem;
}

.p-button {
    transition: all 0.2s ease;
}

.p-panel .p-panel-header {
    background: transparent;
    border: none;
    padding: 0;
}

.p-panel .p-panel-content {
    border: none;
    background: transparent;
}
</style>
