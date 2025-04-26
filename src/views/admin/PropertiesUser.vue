<script setup>
import { ref, computed, defineProps } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
import { useRouter } from 'vue-router';
import { useConfirm } from 'primevue/useconfirm';
import { deleteObject, ref as storageRef } from 'firebase/storage';
import { db, storage } from '@/firebase/config';
import { deleteDoc, doc } from 'firebase/firestore';
import { useToast } from 'primevue/usetoast';
import { defineEmits } from 'vue';
import { Timestamp } from 'firebase/firestore';
import { formatDateFromTimestamp } from '@/utils/dateUtils';

const confirm = useConfirm();
const toast = useToast();

const props = defineProps({
    userProperties: {
        type: Array,
        required: true,
        default: () => []
    },
    userId: {
        type: String,
        required: true
    }
});

const emit = defineEmits(['updateUserProperties']);

const router = useRouter();

const searchQuery = ref('');
const itemsPerPage = 10;
const first = ref(0);

const filteredProperties = computed(() => {
    return props.userProperties.filter((prop) => {
        const search = searchQuery.value.toLowerCase();
        return prop.title.toLowerCase().includes(search) || prop.category.name.toLowerCase().includes(search) || prop.subcategory.name.toLowerCase().includes(search);
    });
});

const editProperty = (property) => {
    const category = property.category.code;
    const subcategory = property.subcategory.code;
    router.push(`/pages/${category}/edit/${subcategory}/${property.id}?category=${category}&subcategory=${subcategory}`);
};

const deleteProperty = (property) => {
    confirm.require({
        group: 'templating',
        message: "Ви впевнені, що хочете видалити цей об'єкт?",
        icon: 'pi pi-info-circle',
        rejectProps: {
            label: 'Відміна',
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            label: 'Видалити',
            severity: 'danger'
        },
        accept: async () => {
            try {
                if (property.images?.length > 0) {
                    await Promise.allSettled(
                        property.images.map(async (image) => {
                            try {
                                const imagePath = image.url || image;
                                const imageRef = storageRef(storage, imagePath);
                                await deleteObject(imageRef);
                            } catch (error) {
                                console.error('Помилка видалення фото2:', error);
                            }
                        })
                    );
                }

                await deleteDoc(doc(db, `properties/${property.category.code}/${property.subcategory.code}`, property.id));

                emit('updateUserProperties', props.userId);

                toast.add({
                    severity: 'success',
                    summary: 'Успішно',
                    detail: "Об'єкт видалено",
                    life: 3000
                });
            } catch (error) {
                console.error("Помилка видалення об'єкту:", error);
                toast.add({
                    severity: 'error',
                    summary: 'Помилка',
                    detail: "Не вдалося видалити об'єкт",
                    life: 3000
                });
            }
        },
        reject: () => {
            toast.add({ severity: 'error', summary: 'Відхилено', detail: 'Ви відхилили видалення', life: 3000 });
        }
    });
};

const getStatusSeverity = (status) => {
    switch (status) {
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

function getDateSeverity(createdAt) {
    if (!createdAt) {
        return null;
    }

    // Преобразуем Firebase Timestamp в Date при необходимости
    const date = createdAt instanceof Timestamp ? createdAt.toDate() : new Date(createdAt);
    const now = new Date();

    // Разница в миллисекундах (всегда положительная)
    const diff = Math.abs(now.getTime() - date.getTime());

    // Константы для временных промежутков (в миллисекундах)
    const SECOND = 1000;
    const MINUTE = SECOND * 60;
    const HOUR = MINUTE * 60;
    const DAY = HOUR * 24;
    const AVG_MONTH = DAY * 30.44; // Среднее количество дней в месяце

    // Определяем временные градации
    const TIME_RANGES = [
        { threshold: 1000 * 60 * 60 * 24 * 7, severity: 'success' }, // Менее недели
        { threshold: 1000 * 60 * 60 * 24 * 30.44, severity: 'help' }, // Менее месяца
        { threshold: 1000 * 60 * 60 * 24 * 30.44 * 3, severity: 'info' }, // 1-3 месяца
        { threshold: 1000 * 60 * 60 * 24 * 30.44 * 6, severity: 'warn' }, // 3-6 месяцев
        { threshold: 1000 * 60 * 60 * 24 * 30.44 * 12, severity: 'danger' }, // 6-12 месяцев
        { threshold: Infinity, severity: 'danger' } // Более года
    ];

    // Находим подходящий диапазон
    const range = TIME_RANGES.find((r) => diff < r.threshold);

    return range ? range.severity : null;
}
</script>

<template>
    <div class="user-properties-table">
        <div v-if="filteredProperties.length === 0">No properties found.</div>
        <DataTable v-else :value="filteredProperties" :paginator="true" :rows="itemsPerPage" :lazy="false" v-model:first="first" :totalRecords="props.userProperties.length" dataKey="id">
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
                    <Tag :value="formatDateFromTimestamp(data.createdAt, 'uk-UA')" :severity="getDateSeverity(data.createdAt)" />
                </template>
            </Column>

            <Column field="status" header="Status" sortable>
                <template #body="{ data }">
                    <Tag :value="getStatus(data.isPublic)" :severity="getStatusSeverity(data.isPublic)" />
                </template>
            </Column>

            <Column header="Actions">
                <template #body="{ data }">
                    <i class="pi pi-pencil mr-6" @click="editProperty(data)" style="cursor: pointer"></i>
                    <i class="pi pi-trash text-red-500" @click="deleteProperty(data)" style="cursor: pointer"></i>
                </template>
            </Column>

            <Toast />
            <ConfirmPopup group="templating" class="mx-4">
                <template #message="slotProps">
                    <div class="flex flex-col items-center w-full gap-4 border-b border-surface-200 dark:border-surface-700 p-4 mb-4 pb-0">
                        <i :class="slotProps.message.icon" class="text-6xl text-primary-500"></i>
                        <p>{{ slotProps.message.message }}</p>
                    </div>
                </template>
            </ConfirmPopup>
        </DataTable>
        <div class="mt-5 border border-gray-300 p-4">
            <h3 class="mb-2 font-semibold">Опис кольорів дат</h3>
            <ul class="list-none pl-0">
                <li class="flex items-center mb-1">
                    <span class="w-5 h-5 rounded-full mr-2 bg-green-500"></span>
                    <span class="text-sm">Менше тижня</span>
                </li>
                <li class="flex items-center mb-1">
                    <span class="w-5 h-5 rounded-full mr-2 bg-blue-500"></span>
                    <span class="text-sm">Менше місяця</span>
                </li>
                <li class="flex items-center mb-1">
                    <span class="w-5 h-5 rounded-full mr-2 bg-sky-500"></span>
                    <span class="text-sm">1-3 місяці</span>
                </li>
                <li class="flex items-center mb-1">
                    <span class="w-5 h-5 rounded-full mr-2 bg-yellow-500"></span>
                    <span class="text-sm">3-6 місяців</span>
                </li>
                <li class="flex items-center mb-1">
                    <span class="w-5 h-5 rounded-full mr-2 bg-red-500"></span>
                    <span class="text-sm">6-12 місяців або більше року</span>
                </li>
            </ul>
        </div>
    </div>
</template>
