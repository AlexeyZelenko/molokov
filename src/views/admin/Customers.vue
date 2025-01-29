<template>
    <div class="container mx-auto px-4 py-8">
        <h1 class="text-2xl font-bold mb-6">User Management</h1>

        <div v-if="usersStore.loading" class="text-center">
            Loading...
        </div>

        <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {{ error }}
        </div>

        <div class="overflow-x-auto">
            <table class="min-w-full bg-white shadow-md rounded">
                <thead>
                <tr class="bg-gray-100">
                    <th class="px-6 py-3 text-left">Email</th>
                    <th class="px-6 py-3 text-left">Name</th>
                    <th class="px-6 py-3 text-left">Current Role</th>
                    <th class="px-6 py-3 text-left">Actions</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="user in usersStore.users" :key="user.id" class="border-b">
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
                            <option value="admin">customer</option>
                            <option value="admin">manager</option>
                        </select>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useUserStore } from '@/store/userStore';

const usersStore = useUserStore();
const error = ref(null);
const updating = ref(false);

onMounted(async () => {
    try {
        await usersStore.fetchUsers();
        console.log(usersStore.users);
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
</script>
