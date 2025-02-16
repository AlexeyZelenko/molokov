<script setup>
import { useRouter } from 'vue-router';
import { useConfirm } from "primevue/useconfirm";
import { deleteObject, ref as storageRef } from "firebase/storage";
import { deleteDoc, doc } from "firebase/firestore";
import { db, storage } from "@/firebase/config";
import { usePropertiesStore } from '@/store/propertiesCategories';
import { useUserStore } from '@/store/userStore';
import { computed } from 'vue';
import { useToast } from 'primevue/usetoast';

const props = defineProps({
    item: Object
});

const router = useRouter();
const confirm = useConfirm();
const store = usePropertiesStore();
const toast = useToast();
const userStore = useUserStore();

// Check if current user is the creator
const isCreator = computed(() => {
    return userStore.user?.id === props.item.creator?.id;
});

const showProperty = () => {
    router.push(`/pages/apartments/view/${props.item.id}?category=${props.item.category.code}&subcategory=${props.item.subcategory.code}`);
};

const editProperty = () => {
    if (!isCreator.value) return;
    router.push(`/pages/apartments/edit/${props.item.id}?category=${props.item.category.code}&subcategory=${props.item.subcategory.code}`);
};

const deleteProperty = () => {
    if (!isCreator.value) return;

    confirm.require({
        message: 'Ви впевнені, що хочете видалити цей об\'єкт?',
        header: 'Підтвердження видалення',
        icon: 'pi pi-exclamation-triangle',
        accept: async () => {
            try {
                if (props.item.images?.length > 0) {
                    await Promise.allSettled(props.item.images.map(async (imageUrl) => {
                        try {
                            const imagePath = decodeURIComponent(new URL(imageUrl).pathname)
                                .split('/o/')[1]
                                .split('?')[0];
                            const imageRef = storageRef(storage, imagePath);
                            await deleteObject(imageRef);
                        } catch (error) {
                            console.error('Помилка видалення фото:', error);
                        }
                    }));
                }

                await deleteDoc(doc(db, `properties/${props.item.category.code}/${props.item.subcategory.code}`, props.item.id));

                await store.getProperties({
                    category: props.item.category.code,
                    subcategory: props.item.subcategory.code}
                );

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
    <div class="flex gap-2">
        <Button
            label="Переглянути деталі"
            class="p-button-info mr-2"
            @click="showProperty"
        />
        <!-- Show edit and delete buttons only for creator -->
        <template v-if="isCreator">
            <Button
                icon="pi pi-pencil"
                class="p-button-warning mr-2"
                @click="editProperty"
            />
            <Button
                icon="pi pi-trash"
                class="p-button-danger"
                @click="deleteProperty"
            />
        </template>
    </div>
</template>
