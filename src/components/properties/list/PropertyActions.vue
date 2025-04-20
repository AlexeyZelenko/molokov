<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useConfirm } from 'primevue/useconfirm';
import { deleteObject, ref as storageRef } from 'firebase/storage';
import { deleteDoc, doc } from 'firebase/firestore';
import { db, storage } from '@/firebase/config';
import { usePropertiesStore } from '@/store/propertiesCategories';
import { useUserStore } from '@/store/userStore';
import { useToast } from 'primevue/usetoast';
import Button from 'primevue/button'; // Import PrimeVue Button
import ProgressSpinner from 'primevue/progressspinner'; // Import PrimeVue ProgressSpinner

const props = defineProps({
    item: {
        type: Object,
        required: true,
    },
});

const router = useRouter();
const confirm = useConfirm();
const store = usePropertiesStore();
const toast = useToast();
const userStore = useUserStore();

const deleting = ref(false); // Ref to track deletion state

// Check if current user is the creator
const isCreator = computed(() => {
    return userStore.user?.id === props.item.creator?.id;
});

const isAdmin = computed(() => {
    return userStore.user?.role === 'admin';
});

const showProperty = () => {
    const category = props.item.category.code;
    const subcategory = props.item.subcategory.code;
    router.push(`/pages/${category}/view/${subcategory}/${props.item.id}?category=${category}&subcategory=${subcategory}`);
};

const editProperty = () => {
    if (!isCreator.value && !isAdmin.value) {
        toast.add({
            severity: 'error',
            summary: 'Помилка',
            detail: "Ви не маєте права редагувати цей об'єкт",
            life: 3000,
        });
        return;
    }
    const category = props.item.category.code;
    const subcategory = props.item.subcategory.code;
    router.push(`/pages/${category}/edit/${subcategory}/${props.item.id}?category=${category}&subcategory=${subcategory}`);
};

const deleteProperty = (event) => {
    if (!isCreator.value && !isAdmin.value) return;

    confirm.require({
        target: event.currentTarget,
        group: 'templating',
        message: "Ви впевнені, що хочете видалити цей об'єкт?",
        icon: 'pi pi-info-circle',
        rejectProps: {
            label: 'Відміна',
            severity: 'secondary',
            outlined: true,
        },
        acceptProps: {
            label: 'Видалити',
            severity: 'danger',
        },
        accept: async () => {
            deleting.value = true;
            try {
                if (props.item.images?.length > 0) {
                    await Promise.allSettled(
                        props.item.images.map(async (image) => {
                            console.log('видалення image1', image);
                            try {
                                const imagePath = image.url || image;
                                const imageRef = storageRef(storage, imagePath);
                                await deleteObject(imageRef);
                            } catch (error) {
                                console.error('Помилка видалення фото1:', error);
                            }
                        })
                    );
                }

                await deleteDoc(doc(db, `properties/${props.item.category.code}/${props.item.subcategory.code}`, props.item.id));

                await store.getProperties({
                    category: props.item.category.code,
                    subcategory: props.item.subcategory.code,
                });
                deleting.value = false;

                toast.add({
                    severity: 'success',
                    summary: 'Успішно',
                    detail: "Об'єкт видалено",
                    life: 3000,
                });
            } catch (error) {
                deleting.value = false;
                console.error("Помилка видалення об'єкту:", error);
                toast.add({
                    severity: 'error',
                    summary: 'Помилка',
                    detail: "Не вдалося видалити об'єкт",
                    life: 3000,
                });
            }
        },
        reject: () => {
            deleting.value = false;
            toast.add({ severity: 'error', summary: 'Відхилено', detail: 'Ви відхилили видалення', life: 3000 });
        },
    });
};
</script>

<template>
    <Toast />
    <ConfirmPopup group="templating" class="mx-4">
        <template #message="slotProps">
            <div class="flex flex-col items-center w-full gap-4 border-b border-surface-200 dark:border-surface-700 p-4 mb-4 pb-0">
                <i :class="slotProps.message.icon" class="text-6xl text-primary-500"></i>
                <p>{{ slotProps.message.message }}</p>
            </div>
        </template>
    </ConfirmPopup>
    <div class="flex gap-2">
        <Button label="ПЕРЕГЛЯНУТИ ДЕТАЛІ" class="p-button-warning" @click="showProperty" />

        <template v-if="isCreator || isAdmin">
            <Button
                icon="pi pi-pencil"
                class="p-button-warning"
                @click="editProperty"
            />
            <Button
                v-if="!deleting"
                icon="pi pi-trash"
                class="p-button-danger"
                @click="deleteProperty"
            ></Button>
            <ProgressSpinner v-else style="width: 16px; height: 16px; margin-top: 8px" strokeWidth="8" fill="transparent"
                             animationDuration=".7s" aria-label="Custom ProgressSpinner" />

        </template>
    </div>
</template>
