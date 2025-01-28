<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUserStore } from '../stores/userStore';

const userStore = useUserStore();
const newList = ref({
    name: '',
    clientName: ''
});

onMounted(async () => {
    await userStore.fetchPropertyLists();
});

const createNewList = async () => {
    if (newList.value.name && newList.value.clientName) {
        await userStore.createPropertyList(
            newList.value.name,
            newList.value.clientName
        );
        newList.value = { name: '', clientName: '' };
    }
};
</script>

<template>
    <div class="max-w-2xl mx-auto p-6">
        <h2 class="text-2xl font-bold mb-6">Списки недвижимости</h2>

        <div class="bg-white rounded-lg shadow p-6 mb-6">
            <h3 class="text-lg font-semibold mb-4">Создать новый список</h3>
            <form @submit.prevent="createNewList" class="space-y-4">
                <div>
                    <label class="block mb-1">Название списка</label>
                    <input
                        v-model="newList.name"
                        type="text"
                        class="w-full border rounded p-2"
                        required
                    >
                </div>
                <div>
                    <label class="block mb-1">Имя клиента</label>
                    <input
                        v-model="newList.clientName"
                        type="text"
                        class="w-full border rounded p-2"
                        required
                    >
                </div>
                <button
                    type="submit"
                    class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Создать список
                </button>
            </form>
        </div>

        <div class="space-y-4">
            <div
                v-for="list in userStore.propertyLists"
                :key="list.id"
                class="bg-white rounded-lg shadow p-4"
            >
                <h3 class="font-semibold">{{ list.name }}</h3>
                <p class="text-gray-600">Клиент: {{ list.clientName }}</p>
                <p class="text-sm text-gray-500">
                    Объектов в списке: {{ list.properties.length }}
                </p>
            </div>
        </div>
    </div>
</template>
