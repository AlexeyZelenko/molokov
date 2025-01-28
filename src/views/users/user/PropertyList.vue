<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useUserStore } from '@/store/userStore';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const loading = ref(false);
const userStore = useUserStore();
const newList = ref({
    name: '',
    clientName: '',
});
const clients = ref([]);
const selectedClient = ref(null);

// Спостерігаємо за змінами в `clientName`
watch(
    () => newList.value.clientName,
    (newClient) => {
        console.log("newClientName", newClient);
        if (!newClient) {
            selectedClient.value = null;
            return;
        }
        selectedClient.value = newClient || null;
    },
    { immediate: true }
);

// Завантажуємо дані при монтуванні компонента
onMounted(async () => {
    loading.value = true;
    try {
        await userStore.fetchUserAndClients();
        await userStore.fetchPropertyLists();
        clients.value = userStore.clients;
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Помилка', detail: 'Не вдалося завантажити дані', life: 3000 });
    } finally {
        loading.value = false;
    }
});

// Створення нового списку
const createNewList = async () => {
    if (newList.value.name && newList.value.clientName) {
        const id = selectedClient.value.id;
        await userStore.createPropertyList(
            newList.value.name,
            newList.value.clientName,
            id
        );
        newList.value = { name: '', clientName: '' };
    }
};
</script>

<template>
    <div class="max-w-2xl mx-auto p-6">
        <h2 class="text-2xl font-bold mb-6">Списки нерухомості</h2>

        <div class="bg-white rounded-lg shadow p-6 mb-6">
            <h3 class="text-lg font-semibold mb-4">Створити новий список</h3>
            <form @submit.prevent="createNewList" class="space-y-4">
                <div>
                    <label class="block mb-1">Назва списка</label>
                    <input
                        v-model="newList.name"
                        type="text"
                        class="w-full border rounded p-2"
                        required
                    >
                </div>
                <div>
                    <label class="block mb-1">Клієнт</label>
                    <Select
                        v-model="newList.clientName"
                        :options="clients"
                        optionLabel="name"
                        placeholder="Вибрати клієнта"
                        class="w-full border rounded p-2"
                        required
                    />
                </div>
                <!-- Додаткова інформація про клієнта -->
                <div v-if="selectedClient" class="mt-4">
                    <Accordion>
                        <AccordionPanel>
                            <AccordionHeader class="font-semibold">Додаткова інформація про клієнта</AccordionHeader>
                            <AccordionContent class="mt-2">
                                <p><strong>Ім'я:</strong> {{ selectedClient.name }}</p>
                                <p><strong>Телефон:</strong> {{ selectedClient.contacts?.phones[0] || 'Немає даних' }}</p>
                                <p><strong>Тип нерухомості:</strong> {{ selectedClient.wishes?.propertyType || 'Немає даних' }}</p>
                                <p><strong>Бажання:</strong> {{ selectedClient.wishes?.text || 'Немає даних' }}</p>
                                <p><strong>Ціна:</strong> {{ selectedClient.wishes?.priceRange?.from }} - {{selectedClient.wishes?.priceRange?.to}}</p>
                                <p><strong>Id клієнта:</strong> {{ selectedClient.id }}</p>
                            </AccordionContent>
                        </AccordionPanel>
                    </Accordion>
                </div>

                <button
                    type="submit"
                    class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Зберегти список
                </button>
            </form>
        </div>

        <!-- Список існуючих списків нерухомості -->
        <div class="space-y-4">
            <div
                v-for="list in userStore.propertyLists"
                :key="list.id"
                class="bg-white rounded-lg shadow p-4"
            >
                <h3 class="font-semibold">{{ list.name }}</h3>
                <p class="text-gray-600">Клієнт: {{ list.clientName }}</p>
                <p class="text-sm text-gray-500">
                    Об'єктів у списку: {{ list.properties.length }}
                </p>
            </div>
        </div>
    </div>
</template>
