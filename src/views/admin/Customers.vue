<script setup>
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '@/store/userStore';
import { useToast } from 'primevue/usetoast';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import Tag from 'primevue/tag';
import Avatar from 'primevue/avatar';
import Toast from 'primevue/toast';
import ProgressSpinner from 'primevue/progressspinner';
import Button from 'primevue/button';
import PropertiesUser from './PropertiesUser.vue';
import ProfileUser from '@/components/users/ProfileUser.vue';

import { usePropertyStore } from '@/store/propertyStore';
const propertyStore = usePropertyStore();
const selectedUserId = ref(null);
const userProperties = ref([]);
const fetchPropertiesForUser = async (userId) => {
    selectedUserId.value = userId;
    try {
        userProperties.value = await propertyStore.fetchUserProperties(userId);
    } catch (err) {
        showError('Не удалось загрузить объявления пользователя: ' + err.message);
    }
};
const loadingProperties = computed(() => {
    return propertyStore.loading;
});
const expandRow = (event) => {
    const userId = event.data.id;
    fetchPropertiesForUser(userId);
};

const usersStore = useUserStore();
const toast = useToast();
const error = ref(null);
const updating = ref(false);
const firstRowIndex = ref(0);
const searchQuery = ref('');
const expandedRows = ref([]);
const itemsPerPage = 10;

const roleOptions = computed(() => {
    return usersStore.userTypes
})

onMounted(async () => {
    try {
        await usersStore.fetchUsers();
    } catch (err) {
        showError('Не вдалося завантажити користувачів: ' + err.message);
    }
});

const reload = async () => {
    try {
        await usersStore.fetchUsers();
        toast.add({
            severity: 'success',
            summary: 'Успішно',
            detail: 'Користувачі оновлені',
            life: 3000
        });
    } catch (err) {
        showError('Не вдалося перезавантажити користувачів: ' + err.message);
    }
};

const filteredUsers = computed(() => {
    return usersStore.users.filter((user) => {
        const search = searchQuery.value.toLowerCase();
        return user?.email?.toLowerCase().includes(search) || user?.name?.toLowerCase().includes(search);
    });
});

const getRoleSeverity = (role) => {
    switch (role) {
        case 'admin':
            return 'success';
        case 'buyer':
            return 'info';
        case 'agent':
            return 'secondary';
        case 'seller':
            return 'warning';
        case 'blocked':
            return 'danger';
        default:
            return null;
    }
};

const updateRole = async (userId, newRole) => {
    try {
        updating.value = true;
        await usersStore.updateUserRole(userId, newRole);
        toast.add({
            severity: 'success',
            summary: 'Успішно',
            detail: 'Роль користувача оновлено',
            life: 3000
        });
    } catch (err) {
        showError('Не вдалося оновити роль: ' + err.message);
    } finally {
        updating.value = false;
    }
};

const formatDate = (timestamp) => {
    if (!timestamp) return 'Невідомо';
    try {
        const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
        return date.toLocaleString();
    } catch (error) {
        console.error('Ошибка при форматировании Timestamp:', error);
        return 'Невідомо';
    }
};

const collapseAll = () => {
    expandedRows.value = [];
};

const showError = (message) => {
    error.value = message;
    toast.add({
        severity: 'error',
        summary: 'Помилка',
        detail: message,
        life: 5000
    });
};
</script>

<template>
    <div class="card">
        <DataTable
            :value="filteredUsers"
            :paginator="true"
            :rows="itemsPerPage"
            v-model:first="firstRowIndex"
            v-model:expandedRows="expandedRows"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
            currentPageReportTemplate="Показано {first} - {last} з {totalRecords}"
            :loading="usersStore.loading"
            dataKey="id"
            @row-expand="expandRow"
            tableStyle="min-width: 75rem"
        >
            <template #header>
                <div class="flex justify-between items-center">
                    <section>
                        <h1 class="text-2xl font-bold">
                            Керування користувачами
                            <span class="ml-2 text-sm cursor-pointer border-gray-500 rounded" @click="reload"><i class="pi pi-replay"/></span></h1>
                        <p class="text-sm text-gray-500">Ви можете редагувати ролі користувачів та переглядати їх об'єкти.</p>
                    </section>

                    <div class="flex gap-2">
                        <Button icon="pi pi-minus" label="Згорнути всі" @click="collapseAll" class="p-button-text" />
                        <span class="p-input-icon-left">
                            <i class="pi pi-search mr-2" />
                            <InputText v-model="searchQuery" placeholder="Пошук користувачів..." class="w-64" />
                        </span>
                    </div>
                </div>
            </template>

            <Column :expander="true" headerStyle="width: 3rem" />

            <Column field="avatar" header="Аватар" style="width: 100px">
                <template #body="{ data }">
                    <img v-if="data.avatar" :src="data.avatar" alt="Avatar" class="w-10 h-10 rounded-full" />
                    <Avatar v-else icon="pi pi-user" size="large" style="background-color: #ece9fc; color: #2a1261" shape="circle" />
                </template>
            </Column>

            <Column field="email" header="Email" sortable></Column>
            <Column field="name" header="Ім'я" sortable>
                <template #body="{ data }">
                    {{ data.name || '-' }}
                </template>
            </Column>

            <Column field="role" header="Поточна роль" sortable>
                <template #body="{ data }">
                    <Tag :value="data.role.name" :severity="getRoleSeverity(data.role.role)" />
                </template>
            </Column>

            <Column header="Зміна ролі" style="width: 200px">
                <template #body="{ data }">
                    <Dropdown
                        v-model="data.role"
                        :options="roleOptions"
                        optionLabel="name"
                        :optionValue="undefined"
                        @change="updateRole(data.id, $event.value)"
                        :disabled="updating"
                        class="w-full"
                        />
                </template>
            </Column>

            <template #expansion="{ data }">
                <div class="p-4 bg-gray-50">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h5 class="font-medium mb-2">Додаткова інформація</h5>
                            <div class="space-y-2">
                                <p><span class="font-semibold">ID:</span> {{ data.id }}</p>
                                <p><span class="font-semibold">Дата реєстрації:</span> {{ formatDate(data.createdAt) }}</p>
                                <p><span class="font-semibold">Остання активність:</span> {{ formatDate(data.lastLogin) }}</p>
                            </div>
                        </div>
                        <div>
                            <h5 class="font-medium mb-2">Статистика</h5>
                            <div class="space-y-2">
                                <p><span class="font-semibold">Кількість об'єктів:</span> {{ userProperties.length || 0 }}</p>
                            </div>
                        </div>
                    </div>

                    <Accordion value="0" class="mt-4">
                        <AccordionPanel value="1">
                            <AccordionHeader>
                                <OverlayBadge :value="userProperties.length">
                                    <span class="text-xl">Об'єкти користувача</span>
                                </OverlayBadge>
                            </AccordionHeader>
                            <AccordionContent>
                                <div class="my-4">
                                    <div v-if="loadingProperties">Завантаження об'єктів користувача...</div>
                                    <div v-else-if="propertyStore.error">{{ usersStore.error }}</div>
                                    <div v-else-if="userProperties.length > 0">
                                        <PropertiesUser :userProperties="userProperties" :userId="data.id" @updateUserProperties="fetchPropertiesForUser" />
                                    </div>
                                    <div v-else>
                                        <p class="text-gray-500">Цей користувач не має жодного об'єкта.</p>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionPanel>
                    </Accordion>

                    <Accordion value="0" class="mt-4">
                        <AccordionPanel value="1">
                            <AccordionHeader>
                                <span class="text-xl">Редагувати профіль користувача</span>
                            </AccordionHeader>
                            <AccordionContent>
                                <ProfileUser :user="data" />
                            </AccordionContent>
                        </AccordionPanel>
                    </Accordion>
                </div>
            </template>

            <template #empty>
                <div class="text-center py-4 text-gray-500">Користувачів не знайдено</div>
            </template>

            <template #loading>
                <div class="flex justify-center items-center py-4">
                    <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" />
                </div>
            </template>
        </DataTable>

        <Toast />
    </div>
</template>

<style scoped>
:deep(.p-datatable) {
    font-size: 0.9rem;
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
    background-color: #f8fafc;
    color: #64748b;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-size: 0.75rem;
}

:deep(.p-datatable .p-datatable-tbody > tr) {
    transition: background-color 0.2s;
}

:deep(.p-datatable .p-datatable-tbody > tr:hover) {
    background-color: #f1f5f9 !important;
}

:deep(.p-row-expansion) {
    background-color: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
}
</style>
