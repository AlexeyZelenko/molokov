<script setup>
import { onMounted, ref, watch, computed } from 'vue';
import { usePropertiesStore } from '@/store/propertiesCategories';
import  { useAreasStore } from '@/store/areasStore';
import { useRoute, useRouter } from 'vue-router';
import Button from "primevue/button";
import { formatFirebaseTimestampToTime } from '@/utils/dateUtils';
import {deleteObject, ref as storageRef} from "firebase/storage";
import {db, storage} from "@/firebase/config";
import {deleteDoc, doc} from "firebase/firestore";
import ConfirmDialog from "primevue/confirmdialog";
import {useConfirm} from "primevue/useconfirm";

const route = useRoute();
const router = useRouter();
const products = ref([]);
const options = ref(['list', 'grid']);
const layout = ref('list');
const store = usePropertiesStore();

const confirm = useConfirm();

const storeAreas = useAreasStore();
const categoryName = computed(() => storeAreas.realEstateItems.find(item => item.key === 'apartments')?.title);
const subcategoryName = computed(() => storeAreas.realEstateItems.find(item => item.key === 'apartments')?.actions.find(subcategory => subcategory.type === 'sell')?.label);

const category = computed(() => route.query.category || 'apartments');
const subcategory = computed(() => route.query.subcategory || 'sell');
// Пагинация
const currentPage = ref(1);
const pageSize = 3;

const showProperty = (property) => {
    router.push(`/pages/apartments/view/${property.id}?category=${property.category.code}&subcategory=${property.subcategory.code}`);
};

const editProperty = (property) => {
    router.push(`/pages/apartments/edit/${property.id}?category=${property.category.code}&subcategory=${property.subcategory.code}`);
};

const filters = ref({
    category: category,
    subcategory: subcategory,
});

const loadPage = async () => {
    try {
        await store.getProperties(filters.value);
    } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
    }
};

const paginatedProducts = computed(() => {
    const start = (currentPage.value - 1) * pageSize;
    const filteredProducts = store.getFilteredProperties; // Получаем отфильтрованные данные из геттера
    return filteredProducts.slice(start, start + pageSize); // Пагинируем данные
});

const totalPages = computed(() => {
    return Math.ceil(store.properties.length / pageSize);
});

// Страница товара (нумерация и навигация)
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

watch(() => store.properties, () => {
    currentPage.value = 1; // Сброс текущей страницы
});

// Загрузка данных при монтировании компонента
onMounted(() => {
    loadPage();
});

watch(() => store.properties, (newProperties) => {
    products.value = newProperties;
});

const deleteProperty = (property) => {
    confirm.require({
        message: 'Ви впевнені, що хочете видалити цей об\'єкт?',
        header: 'Підтвердження видалення',
        icon: 'pi pi-exclamation-triangle',
        accept: async () => {
            try {
                // Delete images from storage
                if (property.images && property.images.length > 0) {
                    const deleteImagePromises = property.images.map(async (imageUrl) => {
                        try {
                            const imagePath = decodeURIComponent(new URL(imageUrl).pathname)
                                .split('/o/')[1]
                                .split('?')[0];

                            const imageRef = storageRef(storage, imagePath);
                            await deleteObject(imageRef);
                        } catch (error) {
                            console.error('Помилка видалення фото:', error);
                        }
                    });

                    await Promise.allSettled(deleteImagePromises);
                }

                // Delete Firestore document
                await deleteDoc(doc(db, `properties/${property.category.code}/${property.subcategory.code}`, property.id));

                // Reload properties
                await store.getProperties(property.category.code, property.subcategory.code, property.id);

                toast.add({
                    severity: 'success',
                    summary: 'Успішно',
                    detail: 'Об\'єкт видалено',
                    life: 3000
                });
            } catch (error) {
                console.error('Помилка видалення об\'єкту:', error);
                toast.add({
                    severity: 'error',
                    summary: 'Помилка',
                    detail: 'Не вдалося видалити об\'єкт',
                    life: 3000
                });
            }
        }
    });
};
</script>

<template>
    <div class="flex flex-col">
        <ConfirmDialog
            :breakpoints="{'960px': '75vw', '640px': '100vw'}"
            :style="{ width: '450px' }"
        >
            <template #message="slotProps">
                <div class="flex flex-column align-items-center p-3">
                    <i
                        :class="slotProps.message.icon"
                        class="text-6xl text-primary mr-2 pt-4"
                    ></i>
                    <h4 class="text-xl font-bold mb-3 p-2">
                        {{ slotProps.message.header }}
                    </h4>
                    <p class="text-center p-2">
                        {{ slotProps.message.message }}
                    </p>
                </div>
            </template>
        </ConfirmDialog>
        <div class="card">
            <div class="font-semibold text-xl">{{categoryName}} / {{subcategoryName}}</div>
            <div v-if="store.loading">
                <div class="card">
                    <div class="rounded border border-surface-200 dark:border-surface-700 p-6 bg-surface-0 dark:bg-surface-900">
                        <div class="flex mb-4">
                            <Skeleton shape="circle" size="4rem" class="mr-2"></Skeleton>
                            <div>
                                <Skeleton width="10rem" class="mb-2"></Skeleton>
                                <Skeleton width="5rem" class="mb-2"></Skeleton>
                                <Skeleton height=".5rem"></Skeleton>
                            </div>
                        </div>
                        <Skeleton width="100%" height="150px"></Skeleton>
                        <div class="flex justify-between mt-4">
                            <Skeleton width="4rem" height="2rem"></Skeleton>
                            <Skeleton width="4rem" height="2rem"></Skeleton>
                        </div>
                    </div>
                </div>
            </div>
            <DataView v-else :value="paginatedProducts" :layout="layout">
                <template #header>
                    <div class="flex justify-end">
                        <SelectButton v-model="layout" :options="options" :allowEmpty="false">
                            <template #option="{ option }">
                                <i :class="[option === 'list' ? 'pi pi-bars' : 'pi pi-table']" />
                            </template>
                        </SelectButton>
                    </div>
                </template>

                <template #list="slotProps">
                    <div class="flex flex-col">
                        <div v-for="(item, index) in slotProps.items" :key="index">
                            <div class="flex flex-col sm:flex-row sm:items-center p-6 gap-4" :class="{ 'border-t border-surface': index !== 0 }">
                                <div class="md:w-40 relative">
                                    <img class="block xl:block mx-auto rounded w-full" :src="item.images[0]" :alt="item.title" />
                                </div>
                                <div class="flex flex-col md:flex-row justify-between md:items-center flex-1 gap-6">
                                    <div class="flex flex-row md:flex-col justify-between items-start gap-1">
                                        <div class="flex flex-col justify-between gap-1">
                                            <div class="text-lg font-medium mb-4">{{ item.title }}</div>
                                            <div class="font-small text-surface-500 dark:text-surface-400 text-sm">{{ item.apartmentArea.totalArea }} m2</div>
                                            <div class="font-small text-surface-500 dark:text-surface-400 text-sm">{{ item.address.city.name }} / {{ item.address.area.name }}</div>
                                            <div class="font-small text-surface-500 dark:text-surface-400 text-sm">{{ formatFirebaseTimestampToTime(item.createdAt) }}</div>
                                            <div class="font-small text-surface-500 dark:text-surface-400 text-sm">id: {{ item.idProperty }}</div>
                                        </div>
                                    </div>
                                    <div class="flex flex-col md:items-end gap-8">
                                        <span class="text-xl font-semibold">${{ item.priceUSD }}</span>
                                        <div class="flex flex-row-reverse md:flex-row gap-2">
                                            <Button
                                                icon="pi pi-eye"
                                                class="p-button-info mr-2"
                                                @click="showProperty(item)"
                                            />
                                            <Button
                                                icon="pi pi-pencil"
                                                class="p-button-warning mr-2"
                                                @click="editProperty(item)"
                                            />
                                            <Button
                                                icon="pi pi-trash"
                                                class="p-button-danger"
                                                @click="deleteProperty(item)"
                                            />
                                        </div>
                                        <Accordion value="1" expandIcon="pi pi-plus" collapseIcon="pi pi-minus">
                                            <AccordionPanel value="0">
                                                <AccordionHeader>
                                                        <span class="flex items-center gap-2 w-full">
                                                            <Avatar icon="pi pi-user" style="background-color: #dee9fc; color: #1a2551" shape="circle" />
                                                            <span class="font-bold whitespace-nowrap px-2">Користувач</span>
                                                        </span>
                                                </AccordionHeader>
                                                <AccordionContent>
                                                    <div class="font-medium text-surface-500 dark:text-surface-400 text-sm pt-2">
                                                        <i class="pi pi-user mr-2"></i>
                                                        {{ item.creator?.username }}
                                                    </div>
                                                    <div v-for="(phone, i) in item.creator?.phone" :key="i" class="font-medium text-surface-500 dark:text-surface-400 text-sm pt-2">
                                                        <i class="pi pi-phone mr-2"></i>
                                                        {{ phone }}
                                                    </div>
                                                </AccordionContent>
                                            </AccordionPanel>
                                        </Accordion>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>

                <template #grid="slotProps">
                    <div class="grid grid-cols-12 gap-4">
                        <div v-for="(item, index) in slotProps.items" :key="index" class="col-span-12 sm:col-span-6 lg:col-span-4 p-2">
                            <div class="p-6 border border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 rounded flex flex-col">
                                <div class="bg-surface-50 flex justify-center rounded p-4">
                                    <div class="relative mx-auto">
                                        <img class="rounded w-full" :src="item.images[0]" :alt="item.name" style="max-width: 300px; height: 150px" />
                                    </div>
                                </div>
                                <div class="pt-6">
                                    <div class="flex flex-row justify-between items-start gap-2">
                                        <div style="width: 100%">
                                            <span class="font-medium text-surface-500 dark:text-surface-400 text-sm">{{ item.category.name }} / {{ item.subcategory.name }}</span>
                                            <div class="text-lg font-medium mt-1">{{ item.title }}</div>
                                            <div class="font-medium text-surface-500 dark:text-surface-400 text-sm">{{ formatFirebaseTimestampToTime(item.createdAt) }}</div>
                                            <div class="font-medium text-surface-500 dark:text-surface-400 text-sm">Номер оголошення: {{ item.idProperty }}</div>

                                            <Accordion value="1" expandIcon="pi pi-plus" collapseIcon="pi pi-minus">
                                                <AccordionPanel value="0">
                                                    <AccordionHeader>
                                                        <span class="flex items-center gap-2 w-full">
                                                            <Avatar icon="pi pi-user" style="background-color: #dee9fc; color: #1a2551" shape="circle" />
                                                            <span class="font-bold whitespace-nowrap">Користувач</span>
                                                        </span>
                                                    </AccordionHeader>
                                                    <AccordionContent>
                                                        <div class="font-medium text-surface-500 dark:text-surface-400 text-sm pt-2">
                                                            <i class="pi pi-user mr-2"></i>
                                                            {{ item.creator.username }}
                                                        </div>
                                                        <div v-for="(phone, i) in item.creator.phone" :key="i" class="font-medium text-surface-500 dark:text-surface-400 text-sm pt-2">
                                                            <i class="pi pi-phone mr-2"></i>
                                                          {{ phone }}
                                                        </div>
                                                    </AccordionContent>
                                                </AccordionPanel>
                                            </Accordion>
                                        </div>
                                    </div>
                                    <div class="flex flex-col gap-6 mt-6">
                                        <span class="text-2xl font-semibold">${{ item.priceUSD }}</span>
                                        <div class="flex gap-2">
                                            <Button
                                                icon="pi pi-eye"
                                                class="p-button-info mr-2"
                                                @click="showProperty(item)"
                                            />
                                            <Button
                                                icon="pi pi-pencil"
                                                class="p-button-warning mr-2"
                                                @click="editProperty(item)"
                                            />
                                            <Button
                                                icon="pi pi-trash"
                                                class="p-button-danger"
                                                @click="deleteProperty(item)"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </DataView>
        </div>

        <!-- Пагинация -->
        <div class="pagination flex justify-center align-center gap-2">
            <Button
                label="Попередня"
                icon="pi pi-chevron-left"
                @click="prevPage"
                :disabled="currentPage === 1"
                class="pagination--btn"
            />
            <div class="pagination--text">Сторінка {{ currentPage }}</div>
            <Button
                label="Наступна"
                icon="pi pi-chevron-right"
                @click="nextPage"
                class="pagination--btn"
            />
        </div>
    </div>
</template>

<style scoped lang="scss">
.pagination {
    margin-top: 1rem;
    &--btn {
        min-width: 100px;
    }
    &--text {
        display: flex;
        align-items: center;
    }
}
</style>
