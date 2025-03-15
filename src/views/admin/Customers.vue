<template>
    <div class="container mx-auto px-4 py-8">
        <h1 class="text-2xl font-bold mb-6">Керування користувачами</h1>

        <div v-if="usersStore.loading" class="text-center">
            Loading...
        </div>

        <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {{ error }}
        </div>

        <div class="mb-4">
            <input
                type="text"
                v-model="searchQuery"
                placeholder="Пошук користувачів..."
                class="border rounded px-3 py-2 w-full"
            />
        </div>

        <div class="overflow-x-auto">
            <table class="min-w-full bg-white shadow-md rounded">
                <thead>
                <tr class="bg-gray-100">
                    <th class="px-6 py-3 text-left">Email</th>
                    <th class="px-6 py-3 text-left">Name</th>
                    <th class="px-6 py-3 text-left">Поточна роль</th>
                    <th class="px-6 py-3 text-left">Зміна ролі</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="user in paginatedUsers" :key="user.id" class="border-b">
                    <td class="px-6 py-4">{{ user?.email }}</td>
                    <td class="px-6 py-4">{{ user?.name }}</td>
                    <td class="px-6 py-4">{{ user?.role }}</td>
                    <td class="px-6 py-4">
                        <select
                            :value="user?.role"
                            @change="updateRole(user.id, $event.target.value)"
                            class="border rounded px-2 py-1"
                            :disabled="updating"
                        >
                            <option value="user">user</option>
                            <option value="admin">admin</option>
                            <option value="customer">customer</option>
                            <option value="manager">manager</option>
                            <option value="guest">guest</option>
                            <option value="blocked">блокувати</option>
                        </select>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>

        <div class="mt-4 flex justify-between items-center">
            <button
                @click="prevPage"
                :disabled="currentPage === 1"
                class="px-4 py-2 bg-gray-200 rounded"
            >
                Попередня
            </button>
            <span>Сторінка {{ currentPage }} з {{ totalPages }}</span>
            <button
                @click="nextPage"
                :disabled="currentPage === totalPages"
                class="px-4 py-2 bg-gray-200 rounded"
            >
                Наступна
            </button>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { useUserStore } from '@/store/userStore';

const usersStore = useUserStore();
const error = ref(null);
const updating = ref(false);

// Пагінація
const currentPage = ref(1);
const itemsPerPage = 10;

// Пошук
const searchQuery = ref('');

onMounted(async () => {
    try {
        await usersStore.fetchUsers();
    } catch (err) {
        error.value = 'Failed to fetch users: ' + err.message;
    }
});

const updateRole = async (userId, newRole) => {
    try {
        error.value = null;
        updating.value = true;
        await usersStore.updateUserRole(userId, newRole);
    } catch (err) {
        error.value = 'Failed to update role: ' + err.message;
    } finally {
        updating.value = false;
    }
};

const filteredUsers = computed(() => {
    return usersStore.users.filter((user) => {
        const search = searchQuery.value.toLowerCase();
        return (
            user?.email?.toLowerCase().includes(search) ||
            user?.name?.toLowerCase().includes(search)
        );
    });
});

const totalPages = computed(() => {
    return Math.ceil(filteredUsers.value.length / itemsPerPage);
});

const paginatedUsers = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredUsers.value.slice(start, end);
});

const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++;
    }
};

const prevPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--;
    }
};
</script>
