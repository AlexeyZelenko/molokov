<script setup>
import { defineProps, onMounted, ref, computed } from 'vue';
import { useAuthStore } from '@/store/authFirebase';

const authStore = useAuthStore();

const props = defineProps({
    creator: Object
});

const users = ref([]);
const owner = computed(() => users.value.find(user => user.id === props.creator.id));

onMounted(async () => {
    users.value = await authStore.getUsers();
});
</script>

<template>
    <Accordion
        v-if="owner"
        value="1"
        expandIcon="pi pi-phone"
        collapseIcon="pi pi-angle-up"
        class="justify-start"
    >
        <AccordionPanel value="0">
            <AccordionHeader>
                <div class="avatar-container flex-col flex md:flex-row  gap-2">
                    <div class="flex justify-start items-center gap-1">
                        <div class="p-avatar">
                            <div
                                class="rounded-full bg-gray-200 flex items-center justify-center border-2 border-blue-100 w-10 h-10"
                            >
                                <i class="pi pi-building"></i>
                            </div>
                        </div>
                        <span>{{owner.agency}}</span>
                    </div>
                    <!-- Маленький аватар с именем (для навигации/заголовков) -->
                    <div class="flex items-center gap-1 w-full">
                        <div class="avatar-small">
                            <img
                                v-if="owner?.avatar"
                                :src="owner?.avatar"
                                alt="Аватар пользователя"
                                class="rounded-full object-cover border-2 border-blue-100 w-10 h-10"
                            />
                            <div
                                v-else
                                class="rounded-full bg-gray-200 flex items-center justify-center border-2 border-blue-100 w-10 h-10"
                            >
                                <i class="pi pi-user"></i>
                            </div>
                        </div>
                        <span class="font-bold whitespace-nowrap px-1">{{ owner?.name || 'Користувач' }}</span>
                    </div>
                </div>
            </AccordionHeader>
            <AccordionContent v-if="owner?.phones && owner.phones.length > 0">
                <div v-for="(phone, i) in owner.phones"
                     :key="i"
                     class="flex justify-end font-medium text-surface-500 dark:text-surface-400 text-sm pt-2">
                    <i class="pi pi-phone mr-2"></i>
                    {{ phone }}
                </div>
            </AccordionContent>
        </AccordionPanel>
    </Accordion>
</template>

<style>
.p-avatar {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    object-fit: cover;
}

.p-avatar img {
    width: 100%;
    height: 100%;
}
</style>
