<template>
    <div class="card">
        <h1>Об'єкти нерухомості</h1>

        <!-- Кнопка для открытия модального окна фильтров -->
        <Button label="Фільтри" icon="pi pi-filter" @click="showFiltersDialog = true" class="p-button-outlined" />

        <div v-if="selectedFiltersCount > 0">
            <p>Вибрано фільтрів: {{ selectedFiltersCount }}</p>
        </div>

        <div class="grid">
            <div  class="col-12">
                <DataTable
                    :value="filteredProperties"
                    :paginator="true"
                    :rows="10"
                    :loading="loading"
                    :rowsPerPageOptions="[10, 20, 50]"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Показано {first} по {last} з {totalRecords}"
                    responsiveLayout="scroll"
                >
                    <template #header>
                        <div class="flex justify-content-between">
                            <h2>{{ categoryTitle }}</h2>
                            <span class="p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="globalFilter" placeholder="Пошук..." />
                            </span>
                        </div>
                    </template>

                    <!-- Колонки с данными -->
                    <Column field="title" header="Назва" />
                    <Column field="price" header="Ціна" sortable :body="formatCurrency" />
                    <Column field="area" header="Площа" sortable :body="slotProps => `${slotProps.data.area} м²`" />
                    <Column field="rooms" header="Кімнати" sortable/>
                    <Column field="floor" header="Поверх" :body="slotProps => `${slotProps.data.floor}/${slotProps.data.totalFloors}`" />
                    <Column field="district" header="Район" />
                    <Column field="wallMaterial" header="Матеріал стін" :body="getWallMaterialName" />
                    <Column field="condition" header="Стан" :body="getConditionName" />
                    <Column field="images" header="Фото" :body="renderImages" />
                    <Column field="createdAt" header="Дата додавання" :body="formatDate" />
                    <Column header="Дії" :exportable="false" style="min-width: 8rem">
                        <template #body="slotProps">
                            <Button
                                icon="pi pi-pencil"
                                class="p-button-rounded p-button-success mr-2"
                                @click="editProperty(slotProps.data)"
                            />
                            <Button
                                icon="pi pi-trash"
                                class="p-button-rounded p-button-danger"
                                @click="confirmDelete(slotProps.data)"
                            />
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>

        <!-- Диалоговое окно с фильтрами -->
        <Dialog
            v-model:visible="showFiltersDialog"
            header="Фільтри"
            :style="{ width: '400px' }"
            :modal="true"
            :closable="false"
        >
            <div class="p-grid">
                <div class="p-col-12 p-md-6">
                    <InputText v-model="filters.title" placeholder="Фільтрувати за назвою" class="p-column-filter" />
                </div>
                <div class="p-col-12 p-md-6">
                    <InputNumber v-model="filters.price" placeholder="Фільтрувати за ціною" class="p-column-filter" />
                </div>
                <div class="p-col-12 p-md-6">
                    <InputNumber v-model="filters.area" placeholder="Фільтрувати за площею" class="p-column-filter" />
                </div>
                <div class="p-col-12 p-md-6">
                    <InputNumber v-model="filters.rooms" placeholder="Фільтрувати за кімнатами" class="p-column-filter" />
                </div>
                <div class="p-col-12 p-md-6">
                    <InputNumber v-model="filters.floor" placeholder="Фільтрувати за поверхом" class="p-column-filter" />
                </div>
                <div class="p-col-12 p-md-6">
                    <InputText v-model="filters.district" placeholder="Фільтрувати за районом" class="p-column-filter" />
                </div>
                <div class="p-col-12 p-md-6">
                    <Dropdown v-model="filters.wallMaterial" :options="wallMaterials" optionLabel="name" optionValue="value" placeholder="Матеріал стін" class="p-column-filter" />
                </div>
                <div class="p-col-12 p-md-6">
                    <Dropdown v-model="filters.condition" :options="conditions" optionLabel="name" optionValue="value" placeholder="Стан" class="p-column-filter" />
                </div>
                <div class="p-col-12">
                    <Button label="Застосувати фільтри" icon="pi pi-check" @click="applyFilters" class="p-button-success" />
                    <Button label="Закрити" icon="pi pi-times" @click="showFiltersDialog = false" class="p-button-secondary" />
                </div>
            </div>
        </Dialog>

        <!-- Диалоговое окно для подтверждения удаления -->
        <Dialog
            v-model:visible="deleteDialog"
            header="Підтвердження"
            :style="{ width: '450px' }"
            :modal="true"
            :closable="false"
        >
            <div class="confirmation-content">
                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                <span>Ви впевнені, що хочете видалити цей об'єкт?</span>
            </div>
            <template #footer>
                <Button
                    label="Ні"
                    icon="pi pi-times"
                    class="p-button-text"
                    @click="deleteDialog = false"
                />
                <Button
                    label="Так"
                    icon="pi pi-check"
                    class="p-button-text"
                    @click="deleteProperty"
                />
            </template>
        </Dialog>

        <Toast />
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { db, storage } from '@/firebase/config';
import { collection, query, where, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { ref as storageRef, deleteObject } from 'firebase/storage';
import Dropdown from 'primevue/dropdown';
import Dialog from 'primevue/dialog';
import { useToast } from 'primevue/usetoast';
import { useCategoriesStore } from '@/store/categories';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import Toast from 'primevue/toast';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const categoriesStore = useCategoriesStore();
const properties = ref([]);
const loading = ref(true);
const deleteDialog = ref(false);
const propertyToDelete = ref(null);
const showFiltersDialog = ref(false); // Управление видимостью окна с фильтрами
const globalFilter = ref('');
const filters = ref({
    title: '',
    price: null,
    area: null,
    rooms: null,
    floor: null,
    district: '',
    wallMaterial: null,
    condition: null
});

const wallMaterials = [
    { name: 'Цегла', value: 'brick' },
    { name: 'Панель', value: 'panel' },
    { name: 'Моноліт', value: 'monolith' },
    { name: 'Піноблок', value: 'foamBlock' }
];

const conditions = [
    { name: 'Євроремонт', value: 'euro' },
    { name: 'Житловий стан', value: 'living' },
    { name: 'Потребує ремонту', value: 'needsRepair' },
    { name: 'Від забудовника', value: 'developer' }
];

// Обработка удаления
const confirmDelete = (property) => {
    propertyToDelete.value = property;
    deleteDialog.value = true;
};

// Удаление объекта
const deleteProperty = async () => {
    try {
        if (!propertyToDelete.value) return;

        // Удаление изображений из хранилища
        for (const imageUrl of propertyToDelete.value.images) {
            try {
                const imagePath = imageUrl.split('properties%2F')[1].split('?')[0];
                const imageRef = storageRef(storage, `properties/${imagePath}`);
                await deleteObject(imageRef);
            } catch (error) {
                console.error('Error deleting image:', error);
            }
        }

        // Удаление документа из Firestore
        await deleteDoc(doc(db, 'properties', propertyToDelete.value.id));

        // Удаляем из локального состояния
        properties.value = properties.value.filter(p => p.id !== propertyToDelete.value.id);

        deleteDialog.value = false;
        propertyToDelete.value = null;

        toast.add({ severity: 'success', summary: 'Успішно', detail: 'Об\'єкт видалено', life: 3000 });
    } catch (error) {
        console.error('Error deleting property:', error);
        toast.add({ severity: 'error', summary: 'Помилка', detail: 'Помилка видалення об\'єкту', life: 3000 });
    }
};

const selectedFiltersCount = computed(() => {
    return Object.values(filters.value).filter(value => value !== null && value !== '').length;
});

const formatDate = (timestamp) => {
    console.log('Formatting date:', timestamp);
    if (!timestamp) return '';
    const date = timestamp.toDate(); // Преобразуем Timestamp в объект Date
    return new Intl.DateTimeFormat('uk-UA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
};


const categoryTitle = computed(() => {
    const category = categoriesStore.categories.find(c => c.key === route.query.category || '');
    if (!category) return '';
    const action = category.actions.find(a => a.type === route.query.subcategory || '');
    return `${category.title} - ${action?.label || ''}`;
});

const filteredProperties = computed(() => {
    return properties.value.filter(property => {
        // Global search
        if (globalFilter.value) {
            const searchValue = globalFilter.value.toLowerCase();
            const searchableFields = [
                property.title,
                property.district,
                property.street,
                property.description
            ];
            if (!searchableFields.some(field => field?.toLowerCase().includes(searchValue))) {
                return false;
            }
        }

        // Individual filters
        if (filters.value.title && !property.title.toLowerCase().includes(filters.value.title.toLowerCase())) {
            return false;
        }
        if (filters.value.price && property.price !== filters.value.price) {
            return false;
        }
        if (filters.value.area && property.area !== filters.value.area) {
            return false;
        }
        if (filters.value.rooms && property.rooms !== filters.value.rooms) {
            return false;
        }
        if (filters.value.floor && property.floor !== filters.value.floor) {
            return false;
        }
        if (filters.value.district && !property.district.toLowerCase().includes(filters.value.district.toLowerCase())) {
            return false;
        }
        if (filters.value.wallMaterial && property.wallMaterial !== filters.value.wallMaterial) {
            return false;
        }
        if (filters.value.condition && property.condition !== filters.value.condition) {
            return false;
        }

        return true;
    });
});

const applyFilters = () => {
    showFiltersDialog.value = false; // Закрытие окна с фильтрами
};

const editProperty = (property) => {
    router.push(`/pages/apartments/edit/${property.id}`);
};

// Получение имени материала стены
const getWallMaterialName = (value) => {
    return wallMaterials.find(m => m.value === value)?.name || value;
};

// Получение состояния
const getConditionName = (value) => {
    return conditions.find(c => c.value === value)?.name || value;
};

const formatCurrency = (value) => {
    return new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH' }).format(value);
};

onMounted(async () => {
    console.log('Fetching all properties data...');
    loading.value = true;

    try {
        // Выполнение запроса без фильтров по category и subcategory
        const q = query(
            collection(db, 'properties'),
            orderBy('createdAt', 'desc')
        );

        const querySnapshot = await getDocs(q);

        properties.value = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

    } catch (error) {
        console.error('Error fetching properties:', error); // Логируем ошибку при получении данных
        toast.add({ severity: 'error', summary: 'Помилка', detail: 'Помилка завантаження даних', life: 3000 });
    } finally {
        loading.value = false;
    }
});



</script>

<style scoped>
.p-datatable {
    margin-top: 1rem;
}

.p-column-filter {
    width: 100%;
}
</style>
