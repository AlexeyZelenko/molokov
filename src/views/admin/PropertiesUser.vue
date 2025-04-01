<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
import InputText from 'primevue/inputtext';
import { useRouter } from 'vue-router'; // If you need navigation

const props = defineProps({
    userProperties: {
        type: Array,
        required: true,
        default: () => []
    }
});

const formatDateFromTimestamp = (timestamp) => {
    if (!timestamp) return 'Невідомо';
    try {
        const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
        return date.toLocaleString();
    } catch (error) {
        console.error('Ошибка при форматировании Timestamp:', error);
        return 'Невідомо';
    }
};

const emit = defineEmits(['edit-property']);

const router = useRouter(); // For navigation (if needed)

const searchQuery = ref('');
const expandedRows = ref([]);
const itemsPerPage = 10;
const first = ref(0);

// Фильтрация объявлений
const filteredProperties = computed(() => {
    return props.userProperties.filter((prop) => {
        const search = searchQuery.value.toLowerCase();
        return prop.title.toLowerCase().includes(search) || prop.category.name.toLowerCase().includes(search) || prop.subcategory.name.toLowerCase().includes(search);
    });
});

// Function for navigation (example)
const editProperty = (propertyId) => {
    console.log('Editing property with ID:', propertyId);
    emit('edit-property', propertyId);
};

const deleteProperty = (propertyId) => {
    // Implement delete logic here
    console.log('Deleting property with ID:', propertyId);
};

const getStatusSeverity = (status) => {
    switch (
        status
    ) {
        case true:
            return 'success';
        case false:
            return 'warn';
        case 'sold':
            return 'info';
        case 'archived':
            return 'danger';
        default:
            return null;
    }
};

const getStatus = (isPublic) => {
    return isPublic ? 'Опубліковане' : 'Неопубліковане';
};
</script>

<template>
    <div class="user-properties-table">
        <div v-if="filteredProperties.length === 0">No properties found.</div>
        <DataTable v-else :value="filteredProperties" :paginator="true" :rows="itemsPerPage" :lazy="false" v-model:first="first" :totalRecords="props.userProperties.length" dataKey="id">
<!--            <template #header>-->
<!--                <div class="table-header">-->
<!--                    <strong class="text-lime-600 text-xl">Об'єкти користувача</strong>-->
<!--                    <InputText v-model="searchQuery" type="text" placeholder="Search..." />-->
<!--                </div>-->
<!--            </template>-->
            <Column field="title" header="Title" sortable></Column>
            <Column field="category.name" header="Category" sortable>
                <template #body="{ data }">
                    {{ data.category.name }}
                </template>
            </Column>
            <Column field="subcategory.name" header="Subcategory" sortable>
                <template #body="{ data }">
                    {{ data.subcategory.name }}
                </template>
            </Column>
            <Column field="price" header="Price" sortable></Column>
            <Column field="createdAt" header="Created At" sortable>
                <template #body="{ data }">
                    {{ formatDateFromTimestamp(data.createdAt) }}
                </template>
            </Column>

            <Column field="status" header="Status" sortable>
                <template #body="{ data }">
                    <Tag :value="getStatus(data.isPublic)" :severity="getStatusSeverity(data.isPublic)" />
                </template>
            </Column>

            <Column header="Actions">
                <template #body="{ data }">
                    <i class="pi pi-pencil mr-6" @click="editProperty(data.id)" style="cursor: pointer;"></i>
                    <i class="pi pi-trash text-red-500" @click="deleteProperty(data.id)" style="cursor: pointer;"></i>
                </template>

            </Column>
        </DataTable>
    </div>
</template>

<style scoped>
.user-properties-table {
    /* Styles for the table */
}

.table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>
